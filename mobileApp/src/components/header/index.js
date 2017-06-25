import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

import headers from '../../styles/headers'

const Header = (props) => (
  <View style={headers.container}>
    <TextInput
      style={headers.input}
      placeholder="Search..."
      onChangeText={(text) => console.log('searching for ', text)}
    />
  </View>
);

export default Header;
