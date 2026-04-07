import type { APIRoute } from "astro";
import { executeSql } from "../../../turso";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async ( {params} ) => {
    try {
        const { id } = params;

        const result = await executeSql('SELECT * FROM Clients WHERE id = ?', [Number(id)], env);

        // result.rows es un array de arrays con valores {type, value}
        if (!result.rows || result.rows.length === 0) {
            return new Response(JSON.stringify({ error: `Client with id ${id} not found` }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Retornar la primera fila directamente
        return new Response(JSON.stringify(result.rows[0]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('Error en GET /api/clients/:id', error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Error desconocido' }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export const PUT: APIRoute = async ( {params, request } ) => {
    try {
        const { id } = params;
        const body = await request.json() as Record<string, any>;

        // Verificar que el cliente existe
        const checkResult = await executeSql('SELECT * FROM Clients WHERE id = ?', [Number(id)], env);
        
        if (!checkResult.rows || checkResult.rows.length === 0) {
            return new Response(JSON.stringify({ error: `Client with id ${id} not found` }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Construir UPDATE dinámico con los campos del body
        const columns = Object.keys(body).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(body), Number(id)];
        
        await executeSql(`UPDATE Clients SET ${columns} WHERE id = ?`, values, env);

        return new Response(JSON.stringify({ message: "Client updated", id, ...body }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('Error en PUT /api/clients/:id', error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Error desconocido' }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export const DELETE: APIRoute = async ( {params} ) => {
    try {
        const { id } = params;

        // Verificar que el cliente existe
        const checkResult = await executeSql('SELECT * FROM Clients WHERE id = ?', [Number(id)], env);
        
        if (!checkResult.rows || checkResult.rows.length === 0) {
            return new Response(JSON.stringify({ error: `Client with id ${id} not found` }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        await executeSql('DELETE FROM Clients WHERE id = ?', [Number(id)], env);

        return new Response(JSON.stringify({ message: `Client with id ${id} deleted` }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('Error en DELETE /api/clients/:id', error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Error desconocido' }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export const PATCH: APIRoute = async ( {params, request } ) => {
    try {
        const { id } = params;
        const body = await request.json() as Record<string, any>;

        // Construir UPDATE dinámico con los campos del body (PATCH es actualización parcial)
        const columns = Object.keys(body).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(body), Number(id)];
        
        await executeSql(`UPDATE Clients SET ${columns} WHERE id = ?`, values, env);

        return new Response(JSON.stringify({ message: "Client updated", id, ...body }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('Error en PATCH /api/clients/:id', error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Error desconocido' }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}   