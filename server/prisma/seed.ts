import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatarUrl: 'https://github.com/mrkdavi.png',
    },
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Pool 1',
      code: 'BOL123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      }
    },
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:00.086Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    },
  })

  await prisma.game.create({
    data: {
      date: '2022-11-03T12:00:00.086Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_poolId: {
                poolId: pool.id,
                userId: user.id,
              }
            }
          }
        }
      }
    },
  })
}

main();