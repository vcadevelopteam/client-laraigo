/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC } from "react";
import Layout from 'components/layout/Layout';
import Popus from 'components/layout/Popus';
import {
	Users, SignIn, SignUp, Properties, Quickreplies, Groupconfig, Whitelist, InappropriateWords, IntelligentModels, SLA, Domains, Person, NotFound, Forbidden, InternalServererror, Supervisor,
	Organizations, MessageTemplates, Tipifications, Channels, ChannelAdd, IntegrationManager, ChannelAddChatWeb, ChannelAddFacebook, ChannelAddMessenger, ChannelAddInstagram, ChannelAddWhatsapp, ChannelAddTelegram,
	Reports, ReportTemplate, Tickets, MessageInbox, BotDesigner, VariableConfiguration, ChannelAddTwitter, ChannelAddTwitterDM, Campaign, Emojis, PersonDetail, Iaservices,
	Corporations, Settings, Dashboard
} from 'pages';

import { BrowserRouter as Router, Switch, Route, RouteProps, useLocation } from 'react-router-dom';
import paths from "common/constants/paths";
import { ExtrasLayout } from "components";
import { makeStyles } from "@material-ui/core";
import { useSelector } from 'hooks';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { wsConnect } from "store/inbox/actions";
import { getAccessToken } from 'common/helpers';
import { Redirect } from 'react-router-dom';
import { validateToken } from 'store/login/actions';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
	main: {
		padding: theme.spacing(2),
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
	const resValidateToken = useSelector(state => state.login.validateToken);
	const applications = resValidateToken?.user?.menu;
	const location = useLocation();

	const dispatch = useDispatch();
	const existToken = getAccessToken();

	React.useEffect(() => {
		if (existToken)
			dispatch(validateToken());
	}, [])

	React.useEffect(() => {
		if (!resValidateToken.error && !resValidateToken.loading) {
			const { userid, orgid } = resValidateToken.user!!
			dispatch(wsConnect({ userid, orgid, usertype: 'PLATFORM' }));
		}
	}, [resValidateToken])

	if (!existToken) {
		return <Redirect to={{ pathname: paths.SIGNIN }} />;
	} else if (resValidateToken.loading && !applications) {
		return (
			<Route {...rest}>
				<Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={true}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</Route>
		);
	} else if (resValidateToken.error) {
		return <Redirect to={{ pathname: paths.SIGNIN }} />;
	} else if (!applications?.[location.pathname]?.[0] && !location.pathname.includes('channels') && !location.pathname.includes('person')) {
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
		<Router basename={process.env.PUBLIC_URL}>
			<Switch>
				<ProtectRoute exact path="/" />
				<Route exact path={paths.SIGNIN} component={SignIn} />
				<Route exact path={paths.SIGNUP} component={SignUp} />

				<ProtectRoute exact path={paths.REPORTS}>
					<Layout mainClasses={classes.main}>
						<Reports />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.REPORTDESIGNER}>
					<Layout mainClasses={classes.main}>
						<ReportTemplate />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.TICKETS}>
					<Layout mainClasses={classes.main}>
						<Tickets />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CHANNELS}>
					<Layout mainClasses={classes.main}>
						<Channels />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CHANNELS_ADD}>
					<Layout mainClasses={classes.main}>
						<ChannelAdd />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CHANNELS_ADD_CHATWEB}>
					<Layout mainClasses={classes.main}>
						<ChannelAddChatWeb />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CHANNELS_ADD_FACEBOOK.path}>
					<Layout mainClasses={classes.main}>
						<ChannelAddFacebook />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CHANNELS_ADD_MESSENGER.path}>
					<Layout mainClasses={classes.main}>
						<ChannelAddMessenger />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CHANNELS_ADD_INSTAGRAM.path}>
					<Layout mainClasses={classes.main}>
						<ChannelAddInstagram />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CHANNELS_ADD_WHATSAPP.path}>
					<Layout mainClasses={classes.main}>
						<ChannelAddWhatsapp />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CHANNELS_ADD_TELEGRAM.path}>
					<Layout mainClasses={classes.main}>
						<ChannelAddTelegram />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CHANNELS_ADD_TWITTER.path}>
					<Layout mainClasses={classes.main}>
						<ChannelAddTwitter />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CHANNELS_ADD_TWITTERDM.path}>
					<Layout mainClasses={classes.main}>
						<ChannelAddTwitterDM />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CORPORATIONS}>
					<Layout mainClasses={classes.main}>
						<Corporations />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.ORGANIZATIONS}>
					<Layout mainClasses={classes.main}>
						<Organizations />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.IASERVICES}>
					<Layout mainClasses={classes.main}>
						<Iaservices />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.SUPERVISOR}>
					<Layout >
						<Supervisor />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.MESSAGE_INBOX}>
					<Layout>
						<MessageInbox />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.PROPERTIES}>
					<Layout mainClasses={classes.main}><Properties /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.USERS}>
					<Layout mainClasses={classes.main}><Users /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.QUICKREPLIES}>
					<Layout mainClasses={classes.main}><Quickreplies /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.GROUPCONFIG}>
					<Layout mainClasses={classes.main}><Groupconfig /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.WHITELIST}>
					<Layout mainClasses={classes.main}><Whitelist /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.INAPPROPRIATEWORDS}>
					<Layout mainClasses={classes.main}><InappropriateWords /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.INTELLIGENTMODELS}>
					<Layout mainClasses={classes.main}><IntelligentModels /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.SLA}>
					<Layout mainClasses={classes.main}><SLA /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.TIPIFICATIONS}>
					<Layout mainClasses={classes.main}><Tipifications /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.DOMAINS}>
					<Layout mainClasses={classes.main}><Domains /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.PERSON}>
					<Layout mainClasses={classes.main}><Person /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.PERSON_DETAIL.path}>
					<Layout mainClasses={classes.main}><PersonDetail /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.MESSAGETEMPLATE}>
					<Layout mainClasses={classes.main}><MessageTemplates /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.INTEGRATIONMANAGER}>
					<Layout mainClasses={classes.main}><IntegrationManager /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CAMPAIGN}>
					<Layout mainClasses={classes.main}><Campaign /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.BOTDESIGNER}>
					<ExtrasLayout><BotDesigner /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.VARIABLECONFIGURATION}>
					<Layout mainClasses={classes.main}><VariableConfiguration /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.EMOJIS}>
					<Layout mainClasses={classes.main}><Emojis /></Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.DASHBOARD}>
					<Layout mainClasses={classes.main}>
						<Dashboard />
					</Layout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CONFIGURATION}>
					<Layout mainClasses={classes.main}><Settings /></Layout>
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