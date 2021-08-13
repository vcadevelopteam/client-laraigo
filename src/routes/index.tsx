import { FC } from "react";
import Layout from 'components/layout/Layout';
import Popus from 'components/layout/Popus';
import { Users, SignIn, Properties,Quickreplies, Groupconfig, Whitelist, InappropriateWords, IntelligentModels,SLA,Domains  } from 'pages';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import paths from "common/constants/paths";
import { ExtrasLayout } from "components";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	main: {
		padding: theme.spacing(3),
	},
}));

const RouterApp: FC = () => {
	const classes = useStyles();

    return (
        <Router>
			<Switch>
				<Route exact path="/sign-in" component={SignIn} />
				<Route exact path={paths.PROPERTIES}>
					<ExtrasLayout><Properties /></ExtrasLayout>
				</Route>
				<Route exact path={paths.USERS}>
					<ExtrasLayout><Users /></ExtrasLayout>
				</Route>
				<Route exact path={paths.QUICKREPLIES}>
					<ExtrasLayout><Quickreplies /></ExtrasLayout>
				</Route>
				<Route exact path={paths.GROUPCONFIG}>
					<ExtrasLayout><Groupconfig /></ExtrasLayout>
				</Route>
				<Route exact path={paths.WHITELIST}>
					<ExtrasLayout><Whitelist /></ExtrasLayout>
				</Route>
				<Route exact path={paths.INAPPROPRIATEWORDS}>
					<ExtrasLayout><InappropriateWords /></ExtrasLayout>
				</Route>

				<Route exact path={paths.INTELLIGENTMODELS}>
					<ExtrasLayout><IntelligentModels /></ExtrasLayout>
				</Route>
				<Route exact path={paths.SLA}>
					<ExtrasLayout><SLA /></ExtrasLayout>
				</Route>
				<Route exact path={paths.DOMAINS}>
					<ExtrasLayout><Domains /></ExtrasLayout>
				</Route>
				{/* <ExtrasLayout>
					<Route exact path={paths.PROPERTIES} component={Properties} />
					<Route exact path={paths.USERS} component={Users} />
					<Route exact path={paths.QUICKREPLIES} component={Quickreplies} />
					<Route exact path={paths.GROUPCONFIG} component={Groupconfig}/>
					<Route exact path={paths.WHITELIST} component={Whitelist} />
					<Route exact path={paths.INAPPROPRIATEWORDS} component={InappropriateWords} />
				</ExtrasLayout> */}
				<Route>
					<Layout mainClasses={classes.main}>
						<h2>Página no encontrada</h2>
					</Layout>
				</Route>
				<Popus />
			</Switch>
		</Router>
    );
};

export default RouterApp;
