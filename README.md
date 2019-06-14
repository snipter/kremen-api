# Kremen API

Set of different APIs based on Kremenchuk's open data.

## Init

Create `config.dev.json` and `config.prod.json` with configs:

```json
{
  "REDIS_HOST": "%host%",
  "REDIS_PORT": 5555,
  "REDIS_PASS": "%pass%"
}

```

Where:

- `REDIS_HOST / REDIS_PORT / REDIS_PASS` - redis credentials

## Invoke

```bash
# Transport
sls invoke local -f transport --stage dev --data '{ "resource": "/transport/routes"}'
sls invoke local -f transport --stage dev --data '{ "resource": "/transport/buses"}'
sls invoke local -f transport --stage dev --data '{ "resource": "/transport/buses", "queryStringParams": {"cache": "false"}}'
sls invoke local -f transport --stage dev \
  --data '{ "resource": "/transport/find", "queryStringParameters": {"from": "49.060470,33.406315", "to": "49.084064,33.423749" }}'

# Cinemas 
sls invoke local -f cinemas --stage dev --data '{ "resource": "/cinemas"}'

# Equipment 
sls invoke local -f equipment --stage dev --data '{ "resource": "/equipment"}'
```

## Kremen.Cinema API

Sources:

- https://bilet.vkino.com.ua/afisha/galaktika/
- http://filmax.net.ua/kremenchuk/фильмы/
- https://www.kinofilms.ua/ukr/cinema/205/afisha/

Invoke:

```bash
sls invoke local -f cinemas --stage dev --data '{ "resource": "/cinemas"}'
sls invoke local -f cinemas --stage dev --data '{ "resource": "/cinemas/{cid}", "pathParameters": {"cid": "galaxy"}}'
```


