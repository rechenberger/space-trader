# SpaceTraders

A simple NextJS app to interact with the [SpaceTraders API](https://spacetraders.io/).

Try it out at [spacetraders.rechenberger.io](https://spacetraders.rechenberger.io/).

![Screenshot](./public/screenshot-01.png)

## Features

- No Database (only saves login in cookies)
- Entirely written with NextJS [App Router](https://nextjs.org/docs/app) and [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- Multi-Login Support (switch between accounts)
- Automation done with [trigger.dev](https://trigger.dev/)

## Development

- Clone the repository
- `pnpm install`
- `pnpm dev`

### Develop Automation

- Create `.env.local` file
- Provide Secrets for trigger.dev
- `pnpm trigger`

### Re-Generate SDK:

Might be necessary to re-generate the SDK if the API changes in the future.

```bash
openapi-generator generate \
 -i https://stoplight.io/api/v1/projects/spacetraders/spacetraders/nodes/reference/SpaceTraders.json?fromExportButton=true&snapshotType=http_service&deref=optimizedBundle \
 -o packages/spacetraders-sdk \
 -g typescript-fetch \
 --additional-properties=npmName="spacetraders-sdk" \
 --additional-properties=npmVersion="2.0.0" \
 --additional-properties=supportsES6=true \
 --additional-properties=withSeparateModelsAndApi=true \
 --additional-properties=modelPackage="models" \
 --additional-properties=apiPackage="api"
```

- Delete waypoint trait parameter file as its corrupt and replace references with `any`
