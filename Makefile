ps:
	docker compose ps -a

init:
	docker compose build --no-cache
	docker compose up -d
	@make npm-install

start:
	docker compose start

restart:
	@make down
	@make init

bash:
	docker compose exec -it bot bash

down:
	docker compose down --rmi all --volumes --remove-orphans

package-reset:
	docker compose exec -it bot rm -f ./package-lock.json
	docker compose exec -it bot rm -rf ./node_modules/

npm-install:
	@make package-reset
	docker compose exec -it bot npm install

npm-%:
	docker compose exec -it bot npm run ${@:npm-%=%}
