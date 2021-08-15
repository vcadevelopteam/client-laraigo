import React, { FC } from "react";
import Layout from 'components/layout/Layout';
import Popus from 'components/layout/Popus';
import { Users, SignIn, Properties, Quickreplies, Groupconfig, Whitelist, InappropriateWords, IntelligentModels, SLA, Domains } from 'pages';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import paths from "common/constants/paths";
import { ExtrasLayout } from "components";
import { makeStyles } from "@material-ui/core";
import { useSelector } from 'hooks';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getAccessToken } from 'common/helpers';
import { useHistory, useLocation } from 'react-router-dom';
import { validateToken } from 'store/login/actions';
import { useDispatch } from 'react-redux';
const useStyles = makeStyles((theme) => ({
	main: {
		padding: theme.spacing(3),
		width: '100%'
	},
}));

const ProtectRoute: FC = ({ children }) => {
	const resValidateToken = useSelector(state => state.login.validateToken);

	const dispatch = useDispatch();
	// const location = useLocation();
	const history = useHistory();
	const existToken = getAccessToken();
	React.useEffect(() => {
		if (existToken)
			dispatch(validateToken());
	}, [])

	if (!existToken) {
		history.push("sign-in");
	}
	if (resValidateToken.loading) {
		return (
			<Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={true}>
				<CircularProgress color="inherit" />
			</Backdrop>
		)
	} else if (resValidateToken.error) {
		history.push("sign-in");
	}

	return (
		<>{children}</>
	);
}

const RouterApp: FC = () => {
	const classes = useStyles();

	return (
		<Router>
			<Switch>
				<Route exact path="/sign-in" component={SignIn} />

				<ProtectRoute>
					<Route exact path="/email_inbox">
						<Layout mainClasses={classes.main}>
							<Properties />
						</Layout>

					</Route>
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
				</ProtectRoute>
				{/* <Route>
					<Layout mainClasses={classes.main}>
						<h2>Página no encontrada</h2>
					</Layout>
				</Route> */}
				<Popus />
			</Switch >
		</Router >
	);
};

export default RouterApp;
