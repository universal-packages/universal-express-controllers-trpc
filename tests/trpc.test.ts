import { TRPCError } from '@trpc/server'
import { Measurement } from '@universal-packages/time-measurer'

import { getTrpcReference, initialize } from '../src'

beforeAll(() => {
  initialize({ trpcLocation: 'tests/__fixtures__/trpc/trpc.ts' })
})

describe('TRPC', (): void => {
  describe('making a trpc request', (): void => {
    it('returns ok and renders the user', async (): Promise<void> => {
      const listener = jest.fn()

      getTrpcReference().emitter.on('error', listener)
      getTrpcReference().emitter.on('start', listener)
      getTrpcReference().emitter.on('end', listener)

      await runExpressControllers()

      await fGet('/trpc/userList\?batch\=1\&input\=%7B%7D')

      expect(fResponse).toHaveReturnedWithStatus('OK')
      expect(fResponseBody).toMatchObject([
        {
          result: {
            data: [
              { id: 1, name: 'John Doe' },
              { id: 2, name: 'Jane Doe' }
            ]
          }
        }
      ])
      expect(listener.mock.calls).toEqual([
        [{ event: 'start', payload: { endpoints: ['userList'], params: { batch: '1', input: '{}' } } }],
        [{ event: 'end', payload: { endpoints: ['userList'], params: { batch: '1', input: '{}' } }, measurement: expect.any(Measurement) }]
      ])

      listener.mockClear()

      await fGet('/trpc/errored\?batch\=1\&input\=%7B%7D')

      expect(fResponse).toHaveReturnedWithStatus('INTERNAL_SERVER_ERROR')
      expect(fResponseBody).toMatchObject([
        {
          error: {
            message: 'This is an error',
            code: -32603,
            data: {
              code: 'INTERNAL_SERVER_ERROR',
              httpStatus: 500,
              stack: expect.any(String),
              path: 'errored'
            }
          }
        }
      ])
      expect(listener.mock.calls).toEqual([
        [{ event: 'start', payload: { endpoints: ['errored'], params: { batch: '1', input: '{}' } } }],
        [{ event: 'error', error: new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'This is an error' }), payload: { endpoints: ['errored'] } }],
        [{ event: 'end', payload: { endpoints: ['errored'], params: { batch: '1', input: '{}' } }, measurement: expect.any(Measurement) }]
      ])
    })
  })
})
