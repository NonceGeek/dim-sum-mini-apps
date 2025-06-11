# Dim-sum-miniapps links
https://dim-sum-miniapps-shadowing-game.vercel.app/

# Dim-sum-miniapps Turborepo starter

This Dim-sum-miniapps is built and managed by turborpo(monorepo).


## What's inside?

This Dim-sum-miniapps Turborepo includes the following packages/apps:

### Apps and Packages

- `shadowing_game`: a [Next.js](https://nextjs.org/) shadowing_game app
- `<your new app>`: you could add your new app in the floder ./apps
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).


### Develop

To develop all apps and packages, run the following command:

```
pnpm dev
```

### Deployment

To deploy all apps and packages, config the root folder in vercel. and then run the pnpm i and pnpm run bild.

```
apps/<your miniapp>
pnpm i
pnpm run build
```
