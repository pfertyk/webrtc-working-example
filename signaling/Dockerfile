# Set up signaling server at localhost:9999
FROM python:3.8
EXPOSE 9999
RUN mkdir /signaling
COPY ./ /signaling
WORKDIR /signaling/
RUN python -m pip install -r requirements.txt
CMD python server.py & sleep infinity
