FROM docker.io/library/python:3.13.7-alpine3.22

RUN apk add --no-cache \
    gcc g++ musl-dev build-base \
    libffi-dev openssl-dev python3-dev \
    postgresql-dev mariadb-connector-c-dev \
    graphviz graphviz-dev \
    sqlite sqlite-libs sqlite-dev \
    cargo rust \
    git curl xsel \
    nodejs npm \
    zsh font-noto-emoji

RUN sed -i 's|^root:.*:/bin/ash$|root:x:0:0:root:/root:/bin/zsh|' /etc/passwd
RUN sed -i 's|^root:.*:/bin/sh$|root:x:0:0:root:/root:/bin/zsh|' /etc/passwd

WORKDIR /workspaces