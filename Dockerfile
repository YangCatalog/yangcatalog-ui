### Build Angular app ###
FROM node:14

ARG YANG_ID
ARG YANG_GID

ENV YANG_ID "$YANG_ID"
ENV YANG_GID "$YANG_GID"

WORKDIR /usr/src
COPY package.json ./
COPY package-lock.json ./
COPY .npmrc ./
COPY ./tmp ./tmp
RUN npm ci
RUN ./node_modules/.bin/ngcc
COPY . .
RUN npm run build-prod

CMD cp -r /usr/src/dist/yangcatalog-ui/* /usr/share/nginx/html/. && chown -R ${YANG_ID}:${YANG_GID} /usr/share/nginx/html
