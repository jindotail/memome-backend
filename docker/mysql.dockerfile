FROM mysql:5.7

COPY ./docker/mysql/create_table.sql /docker-entrypoint-initdb.d

EXPOSE 3306 