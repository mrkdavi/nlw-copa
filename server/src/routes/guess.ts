import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count();
    return { count };
  })

  fastify.post('/pools/:poolId/games/:gameId/guesses', {
    onRequest: [authenticate],
  }, async (request, reply) => {
    const createGuessParams = z.object({
      poolId: z.string(),
      gameId: z.string(),
    });

    const createGuessBody = z.object({
      firstTeamPoints: z.number(),
      secondTeamPoints: z.number(),
    });

    const { poolId, gameId } = createGuessParams.parse(request.params);
    const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body);

    const participant = await prisma.participant.findUnique({
      where: {
        userId_poolId: {
          userId: request.user.sub,
          poolId,
        }
      }
    });

    if (!participant) {
      return reply.status(400).send({
        message: 'User doesn\'t participate in this pool',
      });
    }

    const guess = await prisma.guess.findUnique({
      where: {
        gameId_participantId: {
          gameId,
          participantId: participant.id,
        }
      }
    })

    if (guess) {
      return reply.status(400).send({
        message: 'User already guessed this game on this pool',
      });
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      }
    })

    if (!game) {
      return reply.status(400).send({
        message: 'Game not found',
      });
    }

    if (game.date < new Date()) {
      return reply.status(400).send({
        message: 'You cannot send a guess for a game that already happened',
      });
    }

    await prisma.guess.create({
      data: {
        gameId,
        firstTeamPoints,
        secondTeamPoints,
        participantId: participant.id,
      }
    });

    return reply.status(201).send();
  })
}