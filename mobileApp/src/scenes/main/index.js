
import React, { 
    Component }         from 'react';
import {
    FlatList,
    Text,
    StyleSheet,
    View }              from 'react-native';

import demoData         from './data'
import containers       from '../../styles/containers'

export default class Main extends Component {
    constructor(props) {
        super(props)
        
        const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
        const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];
        
        this.state = {
            data: demoData,
            connected: false
        }

        this.socket = new WebSocket('ws://localhost:3005');
        this.socket.onopen = () => {
            this.state.connected = true;   

            var msg = {
                "type": "request",
                "method": "getAllData",
                "id": "abcd-1234",
                "date": Date.now()
            };
            this.socket.send(JSON.stringify(msg));         
        }

        this.socket.onmessage = (evt) => {
            this.state.data = evt.data;
            console.log(evt.data);
        }
    }
    
    render() {
        return (
            <View style={containers.list}>
            <FlatList
                data={this.state.data}
                renderItem={({item}) => <Text>{item.key}</Text>}
                />
            </View>
        );
    }
}

