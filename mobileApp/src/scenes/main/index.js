/**
 * Basic UI to show data received from the server.
 * 
 * It connects to the server and download all data stored in the database.
 * 
 * There are also ability to add a new data or delete all data.
 * 
 * There is no ability to reconnect when the connection is lost. 
 * The UI must be refreshed manually.
 * 
 */
import React, 
    { Component }       from 'react';
import {
    ListView,
    ScrollView,
    Text,
    StyleSheet,
    View }              from 'react-native';

import {
    Button,
    List,
    ListItem}           from 'react-native-elements';

import buttons          from '../../styles/buttons';
import containers       from '../../styles/containers';
import texts            from '../../styles/texts';

var WS_METHOD  = {
    GET_ALL_DATA    : 'getAllData',
    INSERT          : 'insertData',
    DELETE_ALL      : 'deleteAllData'
};

export default class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [{'key': 'init data'}],
            connected: false
        }

        // connect to the socket server
        this.socket = new WebSocket(LOCAL_WEBSOCKET_SERVER);

        // on open the conection 
        // - change the state
        // - download all data
        this.socket.onopen = () => {
            this.setState ({connected: true});   
            var msg = {
                "type": "request",
                "method": WS_METHOD.GET_ALL_DATA,
                "id": "abcd-1234",
                "date": Date.now()
            };
            this._send(JSON.stringify(msg));         
        }

        // on received message
        // - check the message
        this.socket.onmessage = (evt) => {
            this._checkMessage(evt.data);
        }

        // on close the connection
        // - update the state
        this.socket.onclose = (evt) => {
            this.setState({connected: false});
        }
    }
    
    /**
     * Builds a message data
     * @param {*} method from WS_METHOD enum
     * @param {*} data 
     */
    _buildMessage(method, data){
        var msg = {
            "type": "request",
            "method": method,
            "data": data != null ? {'key':data} : '',
            "id": "abcd-1234",
            "date": Date.now()
        };

        return msg;
    }

    /**
     * Checks if the received message is correct and provide
     * adequate actions
     * @param {*} data 
     */
    _checkMessage(data){
        var msgObj = JSON.parse(data);

        if(msgObj.type === 'response'){
            switch(msgObj.method){
                case WS_METHOD.INSERT:
                    var tmpData = this.state.data;

                    msgObj.data.forEach((element) => {
                        tmpData.push(element);    
                    });
                    
                    this.setState({data: tmpData});
                    break;

                case WS_METHOD.DELETE_ALL:
                    this.setState({data:[]});
                    break;
                    
                case WS_METHOD.GET_ALL_DATA:
                    this.setState({data: msgObj.data});
                    break;

                default:
                    break;
            }
        }
    }

    /**
     * Delete all data on the server side
     */
    _deleteData() {
        console.log('Deleting all data');
        var msg = this._buildMessage(WS_METHOD.DELETE_ALL, null);
        
        this._send(JSON.stringify(msg));
    }

    /**
     * Generates a new random data and send them to the server
     */
    _generateNewData() {
        console.log('Generating random data...');

        var rnd = Math.random();
        var msg = this._buildMessage(WS_METHOD.INSERT, rnd);
        
        this._send(JSON.stringify(msg));
      }

    /**
     * Sends a data via WS
     * @param {*} data JSON string to be sent
     */
    _send(data) {
        if(this.state.connected) {
            this.socket.send(data);
        }
    }

    /**
     * Render UI
     */
    render() {
        return (
            <View style={containers.list}>
                <Button
                    icon={{name: 'plus', size: 20, type:'font-awesome'}}
                    buttonStyle={buttons.basic}
                    textStyle={{textAlign: 'center'}}
                    title={`Add Random Data`}
                    onPress={() => this._generateNewData()}
                />

                <ScrollView>
                    <List style={containers.list}>
                    {
                        this.state.data.map((l, i) => (
                            <ListItem
                                key={i}
                                title={`id: ${l._id} value: ${l.key}`}
                                hideChevron={true}
                            />
                        ))
                    }
                    </List>
                </ScrollView>

                <Button
                    icon={{name: 'trash', size: 20, type:'font-awesome'}}
                    buttonStyle={buttons.remove}
                    textStyle={{textAlign: 'center'}}
                    title={`Delete All Data`}
                    onPress={() => this._deleteData()}
                />

                <Text style={texts.subheader}>
                    {`${this.state.connected ? 'Connected to WebSockets Server.' : 'Not connected to WebSockets Server.'} Items(${this.state.data.length})`}</Text>
            </View>
        );
    }
}

