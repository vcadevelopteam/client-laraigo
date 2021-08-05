import { FC } from "react";
import Layout from 'components/layout/Layout';
import { Users, SignIn, Properties } from 'pages';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from "./routes";

const RouterApp: FC = () => {
    return (
        <Router>
			<Switch>
				<Route exact path="/sign-in" component={SignIn} />
				<Layout
					routes={routes}
				>
					<Route exact path="/properties" component={Properties} />
					<Route exact path="/users" component={Users} />
				</Layout>
			</Switch>
		</Router>
    );
};

export default RouterApp;
