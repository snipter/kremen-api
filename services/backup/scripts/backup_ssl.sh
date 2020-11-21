#!/usr/bin/env sh
set -e

mkdir -p /backup

TS=$(date +%Y%m%d-%H%M%S)
tar -zcf /backup/ssl-$(date +%Y%m%d-%H%M%S).tar.gz -C /var/data/ ssl
