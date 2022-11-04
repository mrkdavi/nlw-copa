import { createFastify } from "./config/createFastify";

(
  async () => {
    const fastify = await createFastify();
    
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  }
)();