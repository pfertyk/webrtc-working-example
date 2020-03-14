# WebRTC: a working example

This is a simple working example of WebRTC technology, without unnecessary
3rd party dependencies. It allows 2 web browsers to exchange audio and video
streams. Tested on Mozilla Firefox 74.

## Dependencies

The signaling server uses Python3 with `aiohttp` and `python-socketio` modules.

The web application uses `socket.io-client` version 2.2.0, released under MIT
license, which can be downloaded from
[here](https://github.com/socketio/socket.io-client/releases). The script is
added to this repository, so you don't have to download it separately or
install it with `npm`.

## Setup

### Signaling server

```
cd signaling
pip install -r requirements.txt
python server.py
```

This will start a websocket server at `localhost:9999`.

### TURN server

You will not need this for localhost testing. However, if you are going to use
this example over a public network, then you have to setup your own TURN
server on a publicly available IP address. On Ubuntu-based OS it can be done
like this:

```
sudo apt install coturn
turnserver -a -o -v -n --no-dtls --no-tls -u username:credential
```

This will start a TURN server at `{YOUR_SERVER_IP}:3478`.

### Web application

You just need to host the files from `web` directory. Any HTTP server will do,
for example:

```
cd web
python -m http.server 7000
```

Then you can access the application in your browser: `localhost:7000`.
