FROM node:22-alpine

WORKDIR /app
COPY engine.js .

USER node
CMD ["node", "engine.js"]