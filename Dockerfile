FROM node:6-onbuild
ADD index.js .
ADD package.json .
ADD index.html .
ADD public/ .
EXPOSE 8300
