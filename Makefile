.PHONY: build dev test lint up down

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

dev: down up dev-frontend dev-backend

test: test-frontend test-backend

lint: lint-frontend lint-backend

dev-frontend:
	docker compose up -d frontend-dev

dev-backend:
	docker compose up -d backend-dev

test-frontend:
	cd frontend && npm run test

lint-frontend:
	cd frontend && npm run lint

build-backend:
	cd backend && cargo build

test-backend:
	cd backend && cargo test

lint-backend:
	cd backend && cargo clippy
