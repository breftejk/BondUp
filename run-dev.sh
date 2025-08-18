#!/usr/bin/env bash

docker compose --env-file .env.dev.local \
  -f infrastructure/docker-compose.yml \
  -f infrastructure/docker-compose.dev.yml \
  up --build