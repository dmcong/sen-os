FROM node:14.17.4

WORKDIR /home/senos

COPY package*.json ./
RUN npm install --unsafe-perm
COPY . .
RUN npm run __ENV__

EXPOSE 80
CMD [ "npm", "run", "serve" ]
