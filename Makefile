DOCKER_COMPOSE = podman-compose
COMPOSE_DEV = compose.yaml

dev:
	$(DOCKER_COMPOSE) -f $(COMPOSE_DEV) up

stop:
	$(DOCKER_COMPOSE) -f $(COMPOSE_DEV) down

.PHONY: dev stop
