import React from 'react';
import Layout from 'components/layout/Layout';
// import SignIn from 'pages/SignIn';
import { TicketList, SignIn } from 'pages';
import Properties from 'components/Properties';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import logo from './logo.svg';
// import './App.css';

function App() {
	return (
		<div className="App">

			<Router>
				<Switch>
					<Route exact path="/sign-in" component={SignIn} />
					<Layout
						title="React"
						paragraph="A JavaScript library for building user interfaces."
					>
						<Route exact path="/properties" component={Properties} />
						<Route exact path="/tickets" component={TicketList} />
					</Layout>
				</Switch>
			</Router>
		</div >
	);
}

export default App;
