/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC } from "react";
import Layout from 'components/layout/Layout';
import Popus from 'components/layout/Popus';
import { Users, SignIn, Properties, Quickreplies, Groupconfig, Whitelist, InappropriateWords, IntelligentModels, SLA, Domains, Person, NotFound, Forbidden, InternalServererror, Supervisor } from 'pages';
import { BrowserRouter as Router, Switch, Route, RouteProps, useLocation } from 'react-router-dom';
import paths from "common/constants/paths";
import { ExtrasLayout } from "components";
import { makeStyles } from "@material-ui/core";
import { useSelector } from 'hooks';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getAccessToken } from 'common/helpers';
import { Redirect } from 'react-router-dom';
import { validateToken } from 'store/login/actions';
import { useDispatch } from 'react-redux';
const useStyles = makeStyles((theme) => ({
	main: {
		padding: theme.spacing(3),
		width: '100%'
	},
}));

interface PrivateRouteProps extends Omit<RouteProps, "component"> {
	component?: React.ElementType;
}

// view: 0
// modify: 1
// insert: 2
// delete: 3

const ProtectRoute: FC<PrivateRouteProps> = ({ children, component: Component, ...rest }) => {
	console.log("ProtectRoute rendering");
	const resValidateToken = useSelector(state => state.login.validateToken);
	const applications = resValidateToken?.user?.menu;
	const location = useLocation();

	const dispatch = useDispatch();
	// const location = useLocation();
	const existToken = getAccessToken();

	React.useEffect(() => {
		if (existToken)
			dispatch(validateToken());
	}, [])
	
	if (!existToken) {
		return <Redirect to={{ pathname: "/sign-in" }} />;
	} else if (resValidateToken.loading && !applications) {
		return (
			<Route {...rest}>
				<Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={true}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</Route>
		);
	} else if (resValidateToken.error) {
		return <Redirect to={{ pathname: "/sign-in" }} />;
	} else if (!applications?.[location.pathname][0]) {
		return <Redirect to={{ pathname: "/403" }} />;
	} else if (Component) {
		return <Route {...rest} render={props => <Component {...props} />} />;
	} else if (location.pathname === "/") {
		return <Redirect to={{ pathname: resValidateToken.user?.redirect }} />
	}
	return <Route {...rest}>{children}</Route>;
}

const RouterApp: FC = () => {
	const classes = useStyles();

	return (
		<Router>
			<Switch>
				<ProtectRoute exact path="/"/>
				<Route exact path="/sign-in" component={SignIn} />

				<ProtectRoute exact path="/email_inbox">
					<Layout mainClasses={classes.main}>
						<Properties />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.SUPERVISOR}>
					<Layout mainClasses={classes.main}>
						<Supervisor />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.PROPERTIES}>
					<ExtrasLayout><Properties /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.USERS}>
					<ExtrasLayout><Users /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.QUICKREPLIES}>
					<ExtrasLayout><Quickreplies /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.GROUPCONFIG}>
					<ExtrasLayout><Groupconfig /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.WHITELIST}>
					<ExtrasLayout><Whitelist /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.INAPPROPRIATEWORDS}>
					<ExtrasLayout><InappropriateWords /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.INTELLIGENTMODELS}>
					<ExtrasLayout><IntelligentModels /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.SLA}>
					<ExtrasLayout><SLA /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.DOMAINS}>
					<ExtrasLayout><Domains /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.PERSON}>
					<ExtrasLayout><Person /></ExtrasLayout>
				</ProtectRoute>
				<Route exact path="/403">
					<Forbidden />
				</Route>
				<Route exact path="/500">
					<InternalServererror />
				</Route>
				<Route>
					<NotFound />
				</Route>
				<Popus />
			</Switch >
		</Router >
	);
};

export default RouterApp;
