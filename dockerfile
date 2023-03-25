#install node.js
FROM node:18.15-alpine

#prepare the project folder
WORKDIR /LATIHAN_YT

#initialize project using npm init. This will create package.json
COPY package.json package.json

#install library based on package.json package.json
RUN npm install

#create data.json
COPY data.json data.json

#create index.js
COPY index.js index.js

#declare the port to connect
ENV PORT=3000
EXPOSE 3000

#run the application using command node index.js
CMD [ "node", "index.js" ]

#Build this image                   : docker build -t [tag name] -f [dockerfile file] .             || docker build -t ajay-f ./dockerfile .
#run image with open port docker    : docker run -p [localhost port]:[container port] [tag name]    || docker run -p 8080:3000 ajay