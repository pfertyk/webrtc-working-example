# WebRTC: a working example

This is a simple working example of WebRTC technology, without unnecessary
3rd party dependencies. It allows 2 devices to exchange audio and video
streams. Tested on Mozilla Firefox 74, Android 5.1, and Android 9.

Full description of how this example works can be found in
[this blog post](https://pfertyk.me/2020/03/webrtc-a-working-example/)
(general explanation and web app) and in
[this blog post](https://pfertyk.me/2020/04/webrtc-on-mobile-devices/)
(React Native setup and mobile app).

## Dependencies

The signaling server uses Python3 with `aiohttp` and `python-socketio` modules.

The web application uses `socket.io-client` version 4.2.0, released under MIT
license, which can be downloaded from
[here](https://github.com/socketio/socket.io-client/releases). The script is
added to this repository, so you don't have to download it separately or
install it with `npm`.

The mobile application uses [React Native](https://reactnative.dev/) with
[this module](https://github.com/react-native-webrtc/react-native-webrtc).
The repository contains only Android configuration, but extending it with iOS
should not be difficult.

## Setup

### Docker Compose

Thanks to [grebtsew](https://github.com/grebtsew), starting the signaling
server, the TURN server, and the web application (all described below)
can be easily done with a single command:

```
docker-compose up -d
```

This setup should also work on public servers.

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
turnserver -a -o -v -n --no-dtls --no-tls -u username:credential -r realmName
```

This will start a TURN server at `{YOUR_SERVER_IP}:3478`.

To check if your TURN server setup is correct, you can use
[this validator](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/).
To test the example above you should input the following values:
* **STUN or TURN URI**: `turn:{YOUR_SERVER_IP}:3478`
* **TURN username**: `test`
* **TURN password**: `test`

Click "Add Server", remove other servers, and select "Gather candidates".
If you get a component of type `relay`, that means your setup is working.

### Web application

You just need to host the files from `web` directory. Any HTTP server will do,
for example:

```
cd web
python -m http.server 7000
```

Then you can access the application in your browser: `localhost:7000`.

### Mobile application

You need to setup React Native on your machine by following
[these instructions](https://reactnative.dev/docs/environment-setup). Take note
of your Android SDK location, you will need it later. WebRTC
doesn't work with Expo or emulators, so you will have to run it on a physical
phone. Connect the phone to the computer and enable USB debugging.
Edit `mobile/src/webrtc-utils.js` file to point to an actual signaling server
(and an actual TURN server, if you want to communicate over a non-local network).
Then run these commands:

```
cd mobile
npm install
npx react-native start
```

In a new terminal session (also in the `mobile` directory) run:

```
export ANDROID_SDK_ROOT=/path/to/your/Android/Sdk
npx react-native run-android
```

The application should now be installed on your phone. You can test it with another
mobile device or with the web application. Press the "Connect" button to start
the WebRTC connection.
