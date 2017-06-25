import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import footers from '../../styles/footers'

const Footer = (props) => (
  <View style={footers.container}>
    <TouchableOpacity style={footers.button} onPress={() => console.log('load more')}>
      <Text style={footers.text}>Load More</Text>
    </TouchableOpacity>
  </View>
);

export default Footer;
