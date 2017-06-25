
import React, 
       { Component }    from 'react';
import { Navigator,
         View }         from 'react-native';

import Main           	from './scenes/main';

import containers 		from './styles/containers';

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
			<View style={containers.container}>
				{this.renderContent()}
			</View>
		);
	}
}

export default App;
