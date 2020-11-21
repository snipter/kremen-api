default: build

dev: FORCE
	docker-compose run --service-ports api

build: FORCE
	docker-compose -f docker-compose.build.yml build

push: FORCE
	docker-compose -f docker-compose.build.yml push entry api watchman mongo

envs-backup: FORCE
	./scripts/envs-backup/index.js

FORCE: ;