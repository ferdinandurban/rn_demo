
import React, 
       { Component }    from 'react';
import { Navigator,
         StyleSheet,
         View }         from 'react-native';

import Main           from './scenes/main';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			initialRoute: null,
		};
	}

	renderContent() {
        return (
            <Main />
        );
	}

	render() {
		return (
			<View>
				{this.renderContent()}
			</View>
		);
	}
}

export default App;
