import * as trpcExpress from '@trpc/server/adapters/express'
import { checkFile } from '@universal-packages/fs-utils'
import { Handler } from 'express'

import { ExpressControllersTRPCOptions } from './types'

let TRPC_REFERENCE: { trpcMiddleware: Handler; options?: ExpressControllersTRPCOptions } = null

export function initialize(options?: ExpressControllersTRPCOptions): void {
  if (!TRPC_REFERENCE) {
    const finalLocation = checkFile(options?.trpcLocation || './src/trpc')
    const trpc = require(finalLocation)
    const router = Object.values(trpc).find((value) => value?.['createCaller'] !== undefined) as any
    const createContext = trpc.createContext
    const trpcMiddleware = trpcExpress.createExpressMiddleware({ router, createContext })

    TRPC_REFERENCE = { trpcMiddleware, options }
  } else {
    throw new Error('TRPC already setup')
  }
}

export function getTRPC() {
  return TRPC_REFERENCE
}
