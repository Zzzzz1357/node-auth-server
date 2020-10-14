FROM node:12-alpine
WORKDIR /usr/app
COPY . .
RUN npm install
EXPOSE 3002
CMD node app.js