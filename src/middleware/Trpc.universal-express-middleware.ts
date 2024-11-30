import { BaseMiddleware, Middleware } from '@universal-packages/express-controllers'

import { getTRPC } from '../initialize'

function TRPCMiddlewareConstructor() {
  const TRPC_REFERENCE = getTRPC()

  if (TRPC_REFERENCE) return Middleware(TRPC_REFERENCE.options.trpcPath || 'trpc')

  return () => {}
}

@TRPCMiddlewareConstructor()
export default class TRPCMiddleware extends BaseMiddleware {
  public async middleware(): Promise<void> {
    const TRPC_REFERENCE = getTRPC()

    TRPC_REFERENCE.trpcMiddleware(this.request, this.response, () => {})

    await new Promise((resolve) => {
      this.response.once('finish', resolve)
    })
  }
}
