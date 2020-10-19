default: build

dev: FORCE
	docker-compose run --service-ports api

build: FORCE
	yarn dist

push: FORCE
	npm publish --access public

FORCE: ;