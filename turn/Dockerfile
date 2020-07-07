FROM ubuntu:18.04

# Setup turn server

RUN apt-get update -y
RUN apt-get install coturn -y

EXPOSE 3478

CMD turnserver -a -o -v -n --no-dtls --no-tls -u test:test -r testRealm & sleep infinity
