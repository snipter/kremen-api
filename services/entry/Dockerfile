FROM nginx:1.19-alpine

COPY --from=kremen-web-dev:latest /usr/src/app/dist /var/www/html/kremen.dev
COPY --from=kremen-web-transport:latest /usr/src/app/dist /var/www/html/transport.kremen.dev

COPY conf /etc/nginx/conf.d
