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
        [
          {
            endpoints: ['userList'],
            params: { batch: '1', input: '{}' }
          }
        ],
        [{ endpoints: ['userList'], params: { batch: '1', input: '{}' }, measure: expect.any(Measurement) }]
      ])
    })
  })
})
