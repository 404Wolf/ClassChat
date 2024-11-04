DOCKER_COMPOSE = podman-compose
COMPOSE_DEV = compose-dev.yaml
COMPOSE_PROD = $(DOCKER_COMPOSE).yaml

.PHONY: dev
dev: ## Run development environment
	$(DOCKER_COMPOSE) -f $(COMPOSE_DEV) up

.PHONY: dev-build
dev-build: ## Run development environment with build
	$(DOCKER_COMPOSE) -f $(COMPOSE_DEV) up --build --force-recreate

.PHONY: prod
prod: ## Run production environment
	$(DOCKER_COMPOSE) -f $(COMPOSE_PROD) up --build --force-recreate

.PHONY: build-dev
build-dev: ## Build development environment without starting
	$(DOCKER_COMPOSE) -f $(COMPOSE_DEV) build

.PHONY: build-prod
build-prod: ## Build production environment without starting
	$(DOCKER_COMPOSE) -f $(COMPOSE_PROD) build

.PHONY: stop
stop: ## Stop all running containers
	$(DOCKER_COMPOSE) -f $(COMPOSE_DEV) stop
	$(DOCKER_COMPOSE) -f $(COMPOSE_PROD) stop

.PHONY: down-dev
down-dev: ## Stop and remove development containers and networks
	$(DOCKER_COMPOSE) -f $(COMPOSE_DEV) down

.PHONY: down-prod
down-prod: ## Stop and remove production containers and networks
	$(DOCKER_COMPOSE) -f $(COMPOSE_PROD) down

.PHONY: logs-dev
logs-dev: ## Tail logs for development environment
	$(DOCKER_COMPOSE) -f $(COMPOSE_DEV) logs -f

.PHONY: logs-prod
logs-prod: ## Tail logs for production environment
	$(DOCKER_COMPOSE) -f $(COMPOSE_PROD) logs -f

