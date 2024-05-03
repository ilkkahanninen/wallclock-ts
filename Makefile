build-frontend:
	@rm -rf src/backend/static
	@npm install
	@npm run frontend:build

build: build-frontend
	@docker compose build

start: build
	@docker compose up -d

logs:
	@docker compose logs -f
