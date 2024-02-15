FROM postgres:latest

ADD Backend/scripts /scripts
RUN cat /scripts/*.sql > /docker-entrypoint-initdb.d/init.sql && rm -rf /scripts