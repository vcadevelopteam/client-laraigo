import React from 'react';
// import Layout from 'components/Layout';
import SignIn from 'components/SignIn';
import Tickets from 'components/Tickets';
import Properties from 'components/Properties';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import logo from './logo.svg';
// import './App.css';

function App() {
	return (
		<div className="App">
			{/* <Layout 
        title="React"
        paragraph="A JavaScript library for building user interfaces."
      /> */}
			<Router>
				<Switch>
					<Route exact path="/sign-in" component={SignIn} />
					<Route exact path="/properties" component={Properties} />
					<Route exact path="/tickets" component={Tickets} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
