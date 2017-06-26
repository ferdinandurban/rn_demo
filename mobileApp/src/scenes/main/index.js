
import React, { 
    Component }         from 'react';
import {
    FlatList,
    Text,
    StyleSheet,
    View }              from 'react-native';

import {
    List,
    ListItem }          from 'react-native-elements';

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
            this.setState({data: JSON.parse(evt.data)});
            console.log(evt.data);
        }
    }
    
    render() {
        return (
            <View style={containers.list}>
                <List>
                    {
                        this.state.data.map((item, i) => (
                        <ListItem
                            hideChevron={true}
                            key={i}
                            title={item._id}
                            subtitle={item.key}
                        />
                        ))
                    }
                    </List>
            </View>
        );
    }
}

