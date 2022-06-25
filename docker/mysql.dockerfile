FROM mysql:5.7

COPY ./docker/mysql/create_table.sql /docker-entrypoint-initdb.d/1.sql
COPY ./docker/mysql/insert_testdata.sql /docker-entrypoint-initdb.d/2.sql
COPY ./docker/mysql/my.cnf /etc/mysql/conf.d/my.cnf

EXPOSE 3306 