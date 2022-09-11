FROM node:16.16.0
EXPOSE 5000
WORKDIR /app
COPY . /app/
RUN npm i -g pnpm
RUN pnpm i 
RUN pnpm run build
CMD [ "pnpm" , "run start"]