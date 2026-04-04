import type { APIRoute } from "astro";
import { executeSql } from "../../../turso";

// Deshabilitar pre-renderizado para endpoints dinámicos
export const prerender = false;

/**
 * GET /api/clients
 * Obtiene todos los registros de la tabla Clients
 */
export const GET: APIRoute = async ({ locals }) => {
  try {
    // Obtener variables de entorno del runtime de Cloudflare
    const env = locals.runtime?.env;
    
    // Debug: ver qué hay en locals
    console.log('locals:', JSON.stringify(locals, null, 2));
    console.log('env:', env);
    console.log('TURSO_DATABASE_URL:', env?.TURSO_DATABASE_URL);
    
    // Ejecutar consulta SELECT
    const result = await executeSql('SELECT * FROM Clients', [], env);
    
    console.log('Registros obtenidos:', result.rows.length);

    // Retornar respuesta exitosa con los datos
    return new Response(
      JSON.stringify({ clients: result.rows }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    // Manejar errores y retornar respuesta con status 500
    console.error('Error en GET /api/clients:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

/**
 * POST /api/clients
 * Crea un nuevo registro en la tabla Clients
 * Body esperado: { name: string, age: number, isActive: number }
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Obtener variables de entorno del runtime de Cloudflare
    const env = locals.runtime?.env;
    
    // Parsear body del request (excluir 'id' si viene en el body)
    const { id, ...clientData } = await request.json();
    
    // Construir SQL INSERT con placeholders seguros (previene SQL injection)
    const columns = Object.keys(clientData).join(', ');
    const placeholders = Object.keys(clientData).map(() => '?').join(', ');
    const values = Object.values(clientData);
    
    const insertSql = `INSERT INTO Clients (${columns}) VALUES (${placeholders})`;
    
    // Ejecutar INSERT
    await executeSql(insertSql, values, env);
    
    // Obtener el ID del registro recién insertado
    const lastIdResult = await executeSql('SELECT last_insert_rowid() as id', [], env);
    const newId = lastIdResult.rows?.[0]?.[0]?.value || null;

    // Retornar respuesta exitosa con status 201 (Created)
    return new Response(
      JSON.stringify({ 
        id: newId, 
        ...clientData 
      }), 
      {
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    // Manejar errores y retornar respuesta con status 500
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error('Error en POST /api/clients:', errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}