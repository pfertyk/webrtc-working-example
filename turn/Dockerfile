FROM ubuntu:18.04

# Setup turn server

RUN apt-get update -y
RUN apt-get install coturn -y

EXPOSE 3478/tcp
EXPOSE 3478/udp

CMD turnserver -a -o -v -n --no-dtls --no-tls -u username:credential -r testRealm & sleep infinity
