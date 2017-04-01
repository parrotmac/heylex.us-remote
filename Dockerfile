FROM node:6-onbuild
EXPOSE 8300
CMD mkdir -p /usr/src/app
ADD . /usr/src/app