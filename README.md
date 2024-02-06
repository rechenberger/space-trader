## Generate SDK:

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

delete waypoint trait paramater file as its corrupt and replace references with `any`
