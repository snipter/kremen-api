#! /bin/bash

cd "$(dirname "$0")/.."

curl https://api.kremen.dev/transport/routes > src/store/transport/routes.json
curl https://api.kremen.dev/transport/buses > src/store/transport/buses.json