FROM node:latest
ENV PROJECT_PATH /usr/share/showcase_portal/
ENV CONTAINER_PATH /usr/share/nginx/html/
COPY . $PROJECT_PATH
WORKDIR $PROJECT_PATH
RUN npm install yarn
RUN npm install @angular/cli
RUN yarn install
RUN yarn build

FROM nginx:alpine
ENV PROJECT_DIST_PATH /usr/share/showcase_portal/dist
ENV CONTAINER_PATH /usr/share/nginx/html/
RUN rm -rf $CONTAINER_PATH/*
COPY  --from=0 $PROJECT_DIST_PATH $CONTAINER_PATH
RUN cd /usr/share/nginx/html/ && ls -l
