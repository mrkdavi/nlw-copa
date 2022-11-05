import { authRoutes } from './auth'
import { userRoutes } from './user'
import { poolRoutes } from './pool'
import { guessRoutes } from './guess'
import { gameRoutes } from './game'
import { FastifyInstance } from 'fastify'

export async function createRoutes(fastify: FastifyInstance) {
  await fastify.register(authRoutes);
  await fastify.register(userRoutes);
  await fastify.register(poolRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(gameRoutes);
}