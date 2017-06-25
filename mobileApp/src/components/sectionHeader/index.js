import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import headers from '../../styles/headers'

const SectionHeader = (props) => (
  <View style={headers.SectionHeader}>
    <Text style={headers.text}>{props.character}</Text>
  </View>
);

export default SectionHeader;
