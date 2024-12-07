import { BaseMiddleware, Middleware } from '@universal-packages/express-controllers'
import { startMeasurement } from '@universal-packages/time-measurer'

import { getTrpcReference } from './initialize'

function TRPCMiddlewareConstructor() {
  const TRPC_REFERENCE = getTrpcReference()

  if (TRPC_REFERENCE) return Middleware(TRPC_REFERENCE.options.trpcPath || 'trpc')

  return () => {}
}

@TRPCMiddlewareConstructor()
export default class TRPCMiddleware extends BaseMiddleware {
  public async middleware(): Promise<void> {
    const TRPC_REFERENCE = getTrpcReference()
    const measurement = startMeasurement()
    const endpoints = this.request.path.split('/').slice(-1)[0].split(',')

    const startEvent = {
      endpoints: endpoints,
      params: this.request.query
    }

    TRPC_REFERENCE.emitter.emit('start', startEvent)

    TRPC_REFERENCE.trpcMiddleware(this.request, this.response, () => {})

    await new Promise<void>((resolve) => {
      this.response.once('finish', () => {
        const endEvent = {
          endpoints: endpoints,
          params: this.request.query,
          measure: measurement.finish()
        }

        TRPC_REFERENCE.emitter.emit('end', endEvent)

        resolve()
      })
    })
  }
}
