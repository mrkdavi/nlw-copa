import Fastify from 'fastify';
import { createRoutes } from '../routes';
import { createPlugins } from './createPlugins';

export async function createFastify() {
  const fastify = Fastify({
    logger: true,
  });

  await createPlugins(fastify);
  await createRoutes(fastify);

  return fastify;
}