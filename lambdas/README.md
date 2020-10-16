# #Kremen.API

Set of different APIs based on Kremenchuk's open data.

![](https://github.com/snipter/kremen-api/workflows/Lint/badge.svg)

## Init

Create `config.dev.json` and `config.prod.json` with configs:

```json
{
  "REDIS_HOST": "%host%",
  "REDIS_PORT": 5555,
  "REDIS_PASS": "%pass%"
}

```

## Usage

Transport:

```bash
sls invoke local -f transport --stage dev --data '{ "resource": "/transport/routes"}'
sls invoke local -f transport --stage dev --data '{ "resource": "/transport/buses"}'
sls invoke local -f transport --stage dev --data '{ "resource": "/transport/buses", "queryStringParams": {"cache": "false"}}'
sls invoke local -f transport --stage dev \
  --data '{ "resource": "/transport/find", "queryStringParameters": {"from": "49.060470,33.406315", "to": "49.084064,33.423749" }}'
```

Cinemas:

```bash
sls invoke local -f cinemas --stage dev --data '{ "resource": "/cinemas"}'
sls invoke local -f cinemas --stage dev --data '{ "resource": "/cinemas/{cid}", "pathParameters": {"cid": "galaxy"}}'
```

Equipment:

```bash
sls invoke local -f equipment --stage dev --data '{ "resource": "/equipment"}'
```

## Contacts

Jaroslav Khorishchenko

[Facebook](https://fb.me/snipter), [Twitter](https://twitter.com/snipter), [Telegram](https://t.me/ideveloper)

