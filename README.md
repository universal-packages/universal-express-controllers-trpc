# Express Controllers TRPC

[![npm version](https://badge.fury.io/js/@universal-packages%2Fexpress-controllers-trpc.svg)](https://www.npmjs.com/package/@universal-packages/express-controllers-trpc)
[![Testing](https://github.com/universal-packages/universal-express-controllers-trpc/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-express-controllers-trpc/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-express-controllers-trpc/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-express-controllers-trpc)

[tRPC](https://trpc.io/) middleware for [universal-express-controllers](https://github.com/universal-packages/universal-express-controllers)

## Install

```shell
npm install @universal-packages/express-controllers-trpc

npm install @universal-packages/express-controllers
```

## Global methods

#### **`initialize(options: Object)`**

Initialize the trpc middleware to start passing requests to trpc.

```js
import { ExpressControllers } from '@universal-packages/express-controllers'
import { initialize } from '@universal-packages/express-controllers-trpc'

await initialize({ trpcLocation: './src/trpc.js', trpcPath: '/my-trpc' })

const app = new ExpressControllers({ port: 3000 })
await app.prepare()
await app.run()
```

Now you can access your trpc routes at `http://localhost:3000/my-trpc`

#### Options

- **`trpcLocation`** `String` `default: ./src/trpc`
  - The location where you have exported your trpc router and a possible `createContext` function.
- **`trpcPath`** `String` `default: /trpc`
  - The path where you want to access your trpc routes.

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
