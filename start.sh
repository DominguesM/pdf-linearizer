#!/bin/bash

# Cria o diretório pdf_storage se não existir
mkdir -p pdf_storage
chmod 777 pdf_storage

# Inicia o docker-compose
docker-compose up --build