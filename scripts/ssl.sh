#! /bin/bash

docker run -it --rm \
  -v "ssl:/etc/letsencrypt" \
  -v "$(pwd)/creds/cloudflare:/var/cloudflare" \
  snipter/certbot renew
