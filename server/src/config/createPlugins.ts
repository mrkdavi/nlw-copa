import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import 'dotenv/config'

export async function createPlugins(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: true,
  })
  const secret = `${process.env.JWT_SECRET}`;
  await fastify.register(jwt, {
    secret,
  });
}