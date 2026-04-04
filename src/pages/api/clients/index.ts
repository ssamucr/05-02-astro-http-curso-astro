import type { APIRoute } from "astro";
import { turso } from "../../../turso";

export const prerender = false;

export const GET: APIRoute = async () => {
  
    // ESTE CODIGO A CONTINUACION LAS LINEAS 9 Y 11 ES EL QUE HAY QUE DESCOMENTAR Y HACER QUE FUNCIONE
    // const {rows} = await turso.execute('SELECT * FROM Clients');

    // console.log(rows);

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// export const POST: APIRoute = async ( {params, request } ) => {
//     try {
//         const {id, ...body} = await request.json();

//         const { lastInsertRowid } = await db.insert(Clients).values(body);

//         return new Response(JSON.stringify({ id: lastInsertRowid?.toString(), ...body }), {
//             status: 201,
//             headers: { "Content-Type": "application/json" },
//         });
//     } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : "Unknown error";
//         return new Response(JSON.stringify({ msg: errorMessage }), {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//         });
//     }
// }