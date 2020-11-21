#! /bin/bash
set -x

cd /root/platform

docker pull docker.pkg.github.com/husky-dev/kremen-api/backup:latest

docker run -it --rm \
  -v "$(pwd)/backup:/backup" \
  -v "ssl:/var/data/ssl" \
  --network="platform_default" \
  docker.pkg.github.com/husky-dev/kremen-api/backup:latest sh -c "./backup_mongo.sh"

docker run -it --rm \
  -v "$(pwd)/backup:/backup" \
  -v "ssl:/var/data/ssl" \
  --network="platform_default" \
  docker.pkg.github.com/husky-dev/kremen-api/backup:latest sh -c "./backup_redis.sh"

docker run -it --rm \
  -v "$(pwd)/backup:/backup" \
  -v "ssl:/var/data/ssl" \
  --network="platform_default" \
  docker.pkg.github.com/husky-dev/kremen-api/backup:latest sh -c "./backup_ssl.sh"
