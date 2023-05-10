FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3700

CMD ["node","app.js"]
