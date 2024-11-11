DOCKER_COMPOSE = podman-compose
COMPOSE_DEV = compose-dev.yaml
COMPOSE_PROD = $(DOCKER_COMPOSE).yaml

dev:
	$(DOCKER_COMPOSE) -f $(COMPOSE_DEV) up

stop:
	$(DOCKER_COMPOSE) -f $(COMPOSE_DEV) down

.PHONY: dev stop
