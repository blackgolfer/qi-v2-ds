REGISTRY=blackgolfer

.PHONY: help
help: ##
	@cat $(MAKEFILE_LIST) | grep -E '^[a-zA-Z_-]+:.*?## .*$$' | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: env
env: # generate .env file
	@echo "USERNAME=$$(id -un)">.env
	@echo "UID=$$(id -u)">>.env
	@echo "GID=$$(id -g)">>.env
	@echo "REGISTRY=${REGISTRY}">>.env
	@echo "VERSION=0.1">>.env
	@mv .env .devcontainer