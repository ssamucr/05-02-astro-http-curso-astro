import type { APIRoute } from "astro";
import { executeSql } from "../../../turso";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async ( {params} ) => {

    const { id } = params;

    const result = await executeSql('SELECT * FROM Posts WHERE id = ?', [id], env);

    if (result.rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Post no encontrado' }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const title = result.rows[0][1].value;
    const likes = parseInt(result.rows[0][2].value);
    
    return new Response(JSON.stringify({ title, likes }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};

export const PUT: APIRoute = async ( {params, request } ) => {
    const { id } = params;

    const result = await executeSql('SELECT * FROM Posts WHERE id = ?', [id], env);

    if (result.rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Post no encontrado' }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { likes = 0 } = await request.json() as { likes?: number };

    const currentLikes = parseInt(result.rows[0][2].value);
    const newLikes = currentLikes + likes;

    await executeSql('UPDATE Posts SET likes = ? WHERE id = ?', [newLikes, id], env);

    return new Response(JSON.stringify({ message: 'Like agregado', likes: newLikes }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });


};