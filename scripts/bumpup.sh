#!/usr/bin/env bash

set -eu

DIRNAME="$(realpath "$(dirname  -- "${BASH_SOURCE[0]}")")"
PROJECT_ROOT="$(realpath "${DIRNAME}/..")"
NEW_VERSION="$@"

if [[ ! "${NEW_VERSION}" =~ ^[0-9\.]+$ ]]; then
  echo "Version number can only contain numbers and dots."
  exit 1
fi

if [[ -z "$(git diff "${PROJECT_ROOT}/package.json" \
    "${PROJECT_ROOT}/modules/create-opendata-editor/package.json" \
    "${PROJECT_ROOT}/modules/create-opendata-editor/template/package.json" \
    "${PROJECT_ROOT}/modules/opendata-editor/package.json" \
    "${PROJECT_ROOT}/modules/web/package.json" \
    "${PROJECT_ROOT}/lerna.json")" ]]; then
  AUTO_COMMIT="true"
else
  AUTO_COMMIT="false"
fi

npx esno "${DIRNAME}/bumpup.ts" "${NEW_VERSION}"

if [[ "${AUTO_COMMIT}" == "true" ]]; then
  git add "${PROJECT_ROOT}/package.json" \
    "${PROJECT_ROOT}/modules/create-opendata-editor/package.json" \
    "${PROJECT_ROOT}/modules/create-opendata-editor/template/package.json" \
    "${PROJECT_ROOT}/modules/opendata-editor/package.json" \
    "${PROJECT_ROOT}/modules/web/package.json" \
    "${PROJECT_ROOT}/lerna.json"
  git commit --message="chore: v${NEW_VERSION}"

  echo "Updated version numbers in this project. The changes are automatically committed."
else
  echo "Updated version numbers in this project. Please commit the changes manually."
fi
