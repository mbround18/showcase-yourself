FROM node:carbon
ENV PROJECT_PATH /usr/share/showcase_portal/
ENV CONTAINER_PATH /var/www/html/
COPY . $PROJECT_PATH
WORKDIR $PROJECT_PATH
RUN npm install yarn
RUN npm install @angular/cli
RUN yarn install
RUN yarn build
RUN rm -rf $CONTAINER_PATH/*
RUN ls -l
WORKDIR $PROJECT_PATH/dist/
COPY . $CONTAINER_PATH

FROM nginx:latest
ENV CONTAINER_PATH /var/www/html/
COPY ./nginx_server.conf /etc/nginx/conf/
WORKDIR $CONTAINER_PATH
VOLUME /var/www/html
VOLUME /etc/nginx
EXPOSE 8080

