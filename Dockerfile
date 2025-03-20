FROM --platform=linux/amd64 node:lts-alpine
WORKDIR /app
COPY .env /app/.env
COPY package*.json /app/
RUN  npm install
COPY /dist /app/dist/
EXPOSE 3001
CMD [ "node", "dist/index.js" ]