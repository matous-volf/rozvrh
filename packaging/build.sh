#!/bin/bash

docker compose exec -it app vite build
zip -r dist.zip dist
