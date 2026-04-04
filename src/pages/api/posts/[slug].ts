import type { APIRoute } from "astro";
import { getEntry, getCollection } from "astro:content";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
    const slug = params.slug;

    if (slug) {
        const post = await getEntry("blog", slug);

        if (post) {
            return new Response(JSON.stringify(post), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ error: `Post not found: ${slug}` }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ error: "Slug not provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
    });
};

export const POST: APIRoute = async ({ params, request }) => {

    const body = await request.json();

    console.log("Received POST request with body:", body);

    return new Response(JSON.stringify({ method: "POST", ...body }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};

export const PUT: APIRoute = async ({ params, request }) => {
    const body = await request.json();

    console.log("Received PUT request with body:", body);

    return new Response(JSON.stringify({ method: "PUT", ...body }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};

export const DELETE: APIRoute = async ({ params, request }) => {
    const body = await request.json();
    console.log("Received DELETE request with body:", body);
    return new Response(JSON.stringify({ method: "DELETE", ...body }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};