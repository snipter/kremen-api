# Backup scripts

```bash
dc run -it --rm \
  -v "$(pwd)/backup:/backup" \
  -v "ssl:/var/data/ssl" \
  --network="platform_default" \
  docker.pkg.github.com/husky-dev/kremen-api/backup:latest sh -c "./backup_mongo.sh"

dc run -it --rm \
  -v "$(pwd)/backup:/backup" \
  -v "ssl:/var/data/ssl" \
  --network="platform_default" \
  docker.pkg.github.com/husky-dev/kremen-api/backup:latest sh -c "./backup_redis.sh"

dc run -it --rm \
  -v "$(pwd)/backup:/backup" \
  -v "ssl:/var/data/ssl" \
  --network="platform_default" \
  docker.pkg.github.com/husky-dev/kremen-api/backup:latest sh -c "./backup_ssl.sh"
```
