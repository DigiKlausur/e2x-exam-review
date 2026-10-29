FROM dhi.io/node:24-alpine-dev as dependencies

WORKDIR /usr/src/app
COPY package.json package-lock.json ./

RUN npm ci

RUN cd / && mkdir /data && mkdir /data/answer-sheets && mkdir /data/archive && chown -R node:node /data

FROM dhi.io/node:24-alpine as runtime

WORKDIR /usr/src/app

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/package*.json ./

COPY dist ./dist

EXPOSE 3000

COPY --from=dependencies --chown=node:node /data /data
VOLUME ["/data/answer-sheets", "/data/archive"]
ENV FILE_STORAGE_LOCATION="/data/answer-sheets" ARCHIVE_STORAGE_LOCATION="/data/archive"


CMD ["node", "dist/app.js"]