FROM ubuntu:18.04

# Set up signaling server at localhost:9999

RUN mkdir /signaling
COPY ./ /signaling

RUN apt-get update && \
	apt-get install -y \
    sudo \
	curl \
    nano \
    python3-pip \
    python3.8-venv \ 
    python3.8-dev  && \
    apt-get -y autoremove && \
    rm -rf /var/lib/apt/lists/*


RUN pip3 install -r /signaling/requirements.txt

EXPOSE 9999

CMD python3 /signaling/server.py & sleep infinity
