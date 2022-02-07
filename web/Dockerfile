# Setup website gui on 7000
FROM python:3.8
EXPOSE 7000
RUN mkdir /web
COPY ./ /web
WORKDIR /web/
CMD python -m http.server 7000 & sleep infinity
