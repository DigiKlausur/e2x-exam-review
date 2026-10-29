FROM dhi.io/nginx:1-alpine
COPY dist/e2x-exam-review-frontend /usr/share/nginx/html/
#COPY index.html /usr/share/nginx/html/browser/
RUN sed -i 's/js;/js mjs;/' /etc/nginx/mime.types
ADD nginx/default.conf /etc/nginx/conf.d/
ADD nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 4200
