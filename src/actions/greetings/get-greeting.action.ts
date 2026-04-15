import { z } from "astro/zod";
import { defineAction } from "astro:actions";

export const getGreeting = defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async ( { name } ) => {
        console.log('Received name:', name);
      return `Hello, ${name}!`
    }
  })