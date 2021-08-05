FROM node:14.17.4

WORKDIR /home/senos

# COPY package*.json ./
# RUN npm install
# COPY . .
COPY . .
RUN npm install --unsafe-perm
RUN npm run __ENV__

EXPOSE 80
CMD [ "npm", "run", "serve" ]
