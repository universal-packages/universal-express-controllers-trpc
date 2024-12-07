import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({}) // no context
type Context = Awaited<ReturnType<typeof createContext>>
export const trpc = initTRPC.context<Context>().create()

const router = trpc.router
const publicProcedure = trpc.procedure

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ]
  })
})

export type AppRouter = typeof appRouter
