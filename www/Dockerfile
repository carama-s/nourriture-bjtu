FROM  nginx

COPY  docker/nginx.conf /etc/nginx/nginx.conf
COPY  docker/runserver.sh /runserver.sh
RUN   mkdir /www
COPY  www/ /www

CMD ["/runserver.sh"]
