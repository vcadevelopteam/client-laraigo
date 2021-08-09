import { FC } from "react";
import Layout from 'components/layout/Layout';
import Popus from 'components/layout/Popus';
import { Users, SignIn, Properties, PropertyDetail } from 'pages';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from "./routes";

const RouterApp: FC = () => {
    return (
		<div>
			<Router>
				<Switch>
					<Route exact path="/sign-in" component={SignIn} />
					<Layout routes={routes}>
						<Route exact path="/properties" component={Properties} />
						<Route exact path="/properties/:id" component={PropertyDetail} />
						<Route exact path="/users" component={Users} />
					</Layout>
				</Switch>
			</Router>
			<Popus />
		</div>
    );
};

export default RouterApp;
