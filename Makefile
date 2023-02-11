ps:
	docker compose ps -a

init:
	docker compose build --no-cache
	docker compose up -d
	@make npm-install

start:
	docker compose start

bash:
	docker compose exec -it bot bash

down:
	docker compose down --rmi all --volumes --remove-orphans

package-reset:
	docker compose exec -it bot rm ./package-lock.json
	docker compose exec -it bot rm -r ./node_modules/

npm-install:
	@make package-reset
	docker compose exec -it bot npm install

npm-%:
	docker compose exec -it bot npm run ${@:npm-%=%}
