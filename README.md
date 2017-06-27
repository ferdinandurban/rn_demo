# React Native WebSockets Demo

A simple RN demo app to show how to communicate via WebSockets.

## Usage

- go to server folder and type `npm install` to install dependencies
- in the server forlder start server typing `node server.js` and the server shall listen on port `3005`
- build RN app from `mobileApp` folder typing `react-native run-ios`. The app shall be started in iOS simulator and automatically connected to the local WebSockets server. 
- To run it on mobile device go to file `mobileApp/src/congif/config.js` and change the line with `LOCAL_WEBSOCKET_SERVER:   'ws://localhost:3005'` to your IP.
- you can add random number data by clicking on the `Add Random Data` button or delete all data by clicking on `Delete All Data` button.


