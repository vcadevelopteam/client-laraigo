import React, { FC } from "react";
import Layout from 'components/layout/Layout';
import Popus from 'components/layout/Popus';
import { Users, SignIn, Properties, Quickreplies, Groupconfig, Whitelist, InappropriateWords, IntelligentModels, SLA, Domains } from 'pages';
import { BrowserRouter as Router, Switch, Route, RouteProps } from 'react-router-dom';
import paths from "common/constants/paths";
import { ExtrasLayout } from "components";
import { makeStyles } from "@material-ui/core";
import { useSelector } from 'hooks';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getAccessToken } from 'common/helpers';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
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

const ProtectRoute: FC<PrivateRouteProps> = ({ children, component: Component, ...rest }) => {
	const resValidateToken = useSelector(state => state.login.validateToken);

	const dispatch = useDispatch();
	// const location = useLocation();
	const existToken = getAccessToken();

	React.useEffect(() => {
		if (existToken)
			dispatch(validateToken());
	}, [])

	return (
		<Route
			{...rest}
			render={props =>
				!existToken ? (
					<Redirect to={{ pathname: "/sign-in" }} />
				) : (resValidateToken.loading ? (
					<Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={true}>
						<CircularProgress color="inherit" />
					</Backdrop>
				) : (resValidateToken.error ?
					<Redirect
						to={{ pathname: "/" }}
					/> : Component ? (<Component {...props} />) : children)
				)
			}
		/>
	)
}

const RouterApp: FC = () => {
	const classes = useStyles();

	return (
		<Router>
			<Switch>
				<Route exact path="/sign-in" component={SignIn} />

				{/* <ProtectRoute> */}
				<ProtectRoute exact path="/email_inbox">
					<Layout mainClasses={classes.main}>
						<Properties />
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
				{/* </ProtectRoute> */}
				<ProtectRoute>
					<Layout mainClasses={classes.main}>
						<h2>Página no encontrada</h2>
					</Layout>
				</ProtectRoute>
				<Popus />
			</Switch >
		</Router >
	);
};

export default RouterApp;
