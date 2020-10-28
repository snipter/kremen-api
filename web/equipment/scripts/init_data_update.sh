#! /bin/bash

cd "$(dirname "$0")/.."

curl https://api.kremen.dev/equipment > src/store/equipment/items.json
