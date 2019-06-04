# Kremen API

Set of different APIs based on Kremenchuk's open data.

## Transport

```
sls invoke local -f transport --stage dev --data '{ "path": "/transport/routes"}'
sls invoke local -f transport --stage dev --data '{ "path": "/transport/buses"}'

sls invoke local -f cinemas --stage dev --data '{ "resource": "/cinemas"}'
```
