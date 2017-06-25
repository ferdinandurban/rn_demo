import React from 'react';
import { Image, Text, View} from 'react-native';

import rows from '../../styles/rows'

const Row = (props) => (
  <View style={rows.container}>
    <Text style={rows.text}>
      {`${props.newData}`}
    </Text>
  </View>
);

export default Row;
