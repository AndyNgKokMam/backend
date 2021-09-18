#!/bin/bash

echo "Getting started"

# Bundle docs into zero-dependency HTML file
npx redoc-cli bundle docs/openapi.yaml && \
mv redoc-static.html docs/index.html && \
echo "Changed name from redoc-static.html to index.html" && \
echo -e "\nDone!"