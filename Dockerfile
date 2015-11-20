FROM python:2.7.10
MAINTAINER Lucas Rondenet

RUN apt-get update -y
RUN apt-get install -y python-pip

RUN pip install crossbar[twisted]

COPY .crossbar /.crossbar
COPY web/dist /www

CMD crossbar start && sleep 10
