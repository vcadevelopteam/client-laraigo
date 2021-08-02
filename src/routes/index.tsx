import { FC } from "react";
import Layout from 'components/layout/Layout';
import { TicketList, SignIn } from 'pages';
import Properties from 'components/Properties';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from "./routes";
import { TextField } from "@material-ui/core";
import { SearchField } from "components";

const RouterApp: FC = () => {
    return (
        <Router>
			<Switch>
				<Route exact path="/sign-in" component={SignIn} />
				<Layout
					routes={routes}
					title={<SearchField />}
					paragraph="A JavaScript library for building user interfaces."
				>
					<Route exact path="/properties" component={Properties} />
					<Route exact path="/tickets" component={TicketList} />
				</Layout>
			</Switch>
		</Router>
    );
};

export default RouterApp;
