import * as trpcExpress from '@trpc/server/adapters/express'
import { EventEmitter } from '@universal-packages/event-emitter'
import { checkFile } from '@universal-packages/fs-utils'
import { Handler } from 'express'

import { ExpressControllersTRPCOptions } from './types'

let TRPC_REFERENCE: { trpcMiddleware: Handler; options?: ExpressControllersTRPCOptions; emitter: EventEmitter } = null

export function initialize(options?: ExpressControllersTRPCOptions): void {
  if (!TRPC_REFERENCE) {
    const finalLocation = checkFile(options?.trpcLocation || './src/trpc')
    const trpcModule = require(finalLocation)

    const router = Object.values(trpcModule).find((value) => value?.['createCaller'] !== undefined) as any
    const createContext = trpcModule.createContext
    const emitter = new EventEmitter()

    const trpcMiddleware = trpcExpress.createExpressMiddleware({
      router,
      createContext,
      onError: (event) => {
        const endpoints = event.path.split('/').slice(-1)[0].split(',')

        emitter.emit('error', { error: event.error, payload: { endpoints } })
      }
    })

    TRPC_REFERENCE = { trpcMiddleware, options, emitter }
  } else {
    throw new Error('TRPC already setup')
  }
}

export function getTrpcReference() {
  return TRPC_REFERENCE
}
