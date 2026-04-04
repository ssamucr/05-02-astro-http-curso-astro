/**
 * Convierte un valor de JavaScript al formato esperado por Turso
 * @param arg - Valor a convertir (string, number, boolean, null)
 * @returns Objeto con type y value en formato Turso
 */
function formatArgumentForTurso(arg: any) {
  // String: texto plano
  if (typeof arg === 'string') {
    return { type: 'text', value: arg };
  }
  
  // Number: integer o float
  if (typeof arg === 'number') {
    return {
      type: Number.isInteger(arg) ? 'integer' : 'float',
      value: Number.isInteger(arg) ? arg.toString() : arg
    };
  }
  
  // Boolean: convertir a 1 o 0
  if (typeof arg === 'boolean') {
    return { type: 'integer', value: arg ? '1' : '0' };
  }
  
  // Null
  if (arg === null) {
    return { type: 'null' };
  }
  
  // Por defecto: convertir a texto
  return { type: 'text', value: String(arg) };
}

/**
 * Ejecuta una consulta SQL en Turso usando la API HTTP
 * @param sql - Consulta SQL a ejecutar (soporta placeholders ?)
 * @param args - Parámetros para los placeholders (previene SQL injection)
 * @param env - Variables de entorno (runtime.env en Cloudflare Workers)
 * @returns Resultado de la consulta
 */
export async function executeSql(sql: string, args: any[] = [], env?: any) {
  // Obtener credenciales desde el ambiente (producción) o import.meta.env (desarrollo)
  const TURSO_DATABASE_URL = env?.TURSO_DATABASE_URL || import.meta.env.TURSO_DATABASE_URL;
  const TURSO_AUTH_TOKEN = env?.TURSO_AUTH_TOKEN || import.meta.env.TURSO_AUTH_TOKEN;
  
  // Construir URL del endpoint de Turso
  const apiUrl = TURSO_DATABASE_URL.replace("libsql://", "https://") + "/v2/pipeline";
  
  // Formatear argumentos al formato requerido por Turso
  const formattedArgs = args.map(formatArgumentForTurso);
  
  // Realizar petición HTTP a Turso
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TURSO_AUTH_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql, args: formattedArgs } }
      ]
    })
  });

  // Validar respuesta exitosa
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Turso error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  // Procesar respuesta
  const data = await response.json() as { results: Array<{ response: any }> };
  const responseData = data.results[0].response;
  
  // SELECT devuelve 'result', INSERT/UPDATE/DELETE devuelven solo 'response'
  return responseData.result || responseData;
}