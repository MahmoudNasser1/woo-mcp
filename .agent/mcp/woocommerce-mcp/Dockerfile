FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY index.js ./

EXPOSE 3010

ENV PORT=3010

CMD ["node", "index.js"]
