build-frontend:
	@rm -rf src/backend/static
	@npm install
	@npm run frontend:build

build:
	@docker compose build

start: build
	@docker compose up -d

logs:
	@docker compose logs -f
