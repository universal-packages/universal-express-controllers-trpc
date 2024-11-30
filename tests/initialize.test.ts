import { getTRPC, initialize } from '../src'

describe(initialize, (): void => {
  it('loads trpc references', async (): Promise<void> => {
    // Just to check controller registration when no initialization has taken place
    await runExpressControllers()

    initialize({ trpcLocation: 'tests/__fixtures__/trpc/trpc.ts' })

    const trpc = getTRPC()

    expect(trpc).toBeDefined()

    let error: Error

    try {
      initialize({ trpcLocation: 'tests/__fixtures__/trpc/trpc.ts' })
    } catch (err) {
      error = err
    }

    expect(error.message).toEqual('TRPC already setup')
  })
})
