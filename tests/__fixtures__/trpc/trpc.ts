import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({}) // no context
type Context = Awaited<ReturnType<typeof createContext>>
const t = initTRPC.context<Context>().create()

const router = t.router
const publicProcedure = t.procedure

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ]
  })
})

export type AppRouter = typeof appRouter
