#!/bin/bash
# This script is run as part of the dev reload process from the /app dir
yarn run build:worker && yarn run restart