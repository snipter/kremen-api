# Kremen API

Set of different APIs based on Kremenchuk's open data.

## Transport

```
sls invoke local -f transport --stage dev --data '{ "path": "/transport/routes"}'
sls invoke local -f transport --stage dev --data '{ "path": "/transport/buses"}'
sls invoke local -f transport --stage dev \
  --data '{ "resource": "/transport/find", "queryStringParameters": {"from": "49.060470,33.406315", "to": "49.084064,33.423749" }}'

sls invoke local -f cinemas --stage dev --data '{ "resource": "/cinemas"}'
```
