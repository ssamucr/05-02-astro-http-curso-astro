import type { APIRoute } from "astro";
import { Clients, db, eq } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ( {params} ) => {
    const { id } = params;

    const client = await db.select().from(Clients).where(eq(Clients.id, Number(id))).get();

    if (!client) {
        return new Response(JSON.stringify({ error: `Client with id ${id} not found` }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(client), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export const PUT: APIRoute = async ( {params, request } ) => {
    const { id } = params;
    
    const body = await request.json();

    const client = await db.select().from(Clients).where(eq(Clients.id, Number(id))).get();

    if (!client) {
        return new Response(JSON.stringify({ error: `Client with id ${id} not found` }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    await db.update(Clients).set(body).where(eq(Clients.id, Number(id)));

    return new Response(JSON.stringify({ method: "PUT", id, body }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export const DELETE: APIRoute = async ( {params} ) => {
    const { id } = params;

    const client = await db.select().from(Clients).where(eq(Clients.id, Number(id))).get();

    if (!client) {
        return new Response(JSON.stringify({ error: `Client with id ${id} not found` }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    await db.delete(Clients).where(eq(Clients.id, Number(id)));

    return new Response(JSON.stringify({msg: `Client with id ${id} deleted` }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export const PATCH: APIRoute = async ( {params, request } ) => {
    const { id } = params;
    const body = await request.json();
    await db.update(Clients).set(body).where(eq(Clients.id, Number(id)));
    return new Response(JSON.stringify({ method: "PATCH", id, body }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}   