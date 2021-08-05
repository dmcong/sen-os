FROM node:14

WORKDIR /home/senos

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run __ENV__

EXPOSE 80
CMD [ "npm", "run", "serve" ]
