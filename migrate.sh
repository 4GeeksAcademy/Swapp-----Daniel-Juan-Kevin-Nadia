#!/bin/sh
set -e

PIPENV="pipenv run"

make_migrations() {
    echo "Initializing migrations..."
    $PIPENV init
    $PIPENV migrate
    $PIPENV upgrade
    $PIPENV diagram
}

update_migrations() {
    echo "Updating migrations..."
    $PIPENV migrate
    $PIPENV upgrade
    $PIPENV diagram
}

dir=$(pwd)

if [ -d "$dir/migrations" ]; then
    update_migrations
else
    make_migrations
fi
