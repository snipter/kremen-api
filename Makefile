default: run

run: FORCE
	docker-compose run --service-ports kremen-api

build: FORCE
	docker-compose -f docker-compose.build.yml build

push: FORCE
	docker-compose -f docker-compose.build.yml push

FORCE: ;