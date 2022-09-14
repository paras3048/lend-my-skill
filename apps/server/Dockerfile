FROM node:16.16.0
EXPOSE 5000
WORKDIR /app
COPY . /app/
# Install Node Modules Using Yarn
RUN yarn install
RUN yarn build

CMD [ "yarn " , "start:prod"]

