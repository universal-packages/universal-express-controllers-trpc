import { ExpressControllers } from '@universal-packages/express-controllers'

let expressControllers: ExpressControllers

declare global {
  function runExpressControllers(debugError?: boolean): Promise<ExpressControllers>
}

global.runExpressControllers = async function runExpressControllers(debugError?: boolean): Promise<ExpressControllers> {
  expressControllers = new ExpressControllers({ appLocation: './tests/__fixtures__', port: fDefaultPort })

  if (debugError) expressControllers.on('request/error', console.log)

  await expressControllers.prepare()
  await expressControllers.run()

  return expressControllers
}

afterEach(async (): Promise<void> => {
  if (expressControllers) await expressControllers.stop()

  expressControllers = undefined
})
