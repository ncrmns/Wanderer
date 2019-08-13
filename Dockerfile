FROM node:10-alpine
WORKDIR /app
COPY *.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
