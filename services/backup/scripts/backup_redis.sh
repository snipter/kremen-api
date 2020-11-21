#!/usr/bin/env sh
set -e

mkdir -p /backup/redis
# Ask redis to create backup
redis-cli -h redis SAVE
redis-cli -h redis --rdb dump.rdb
mv dump.rdb /backup/redis/dump.rdb
# Create archive
TS=$(date +%Y%m%d-%H%M%S)
tar -zcf /backup/redis-$TS.tar.gz -C /backup redis
# Remove raw data
rm -rf /backup/redis
