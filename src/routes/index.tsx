/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC } from "react";
import Layout from 'components/layout/Layout';
import Popus from 'components/layout/Popus';
import { Users, SignIn,SignUp, Properties, Quickreplies, Groupconfig, Whitelist, InappropriateWords, IntelligentModels, SLA, Domains, Person, NotFound, Forbidden, InternalServererror, Supervisor,
	Organizations, MessageTemplates, Tipifications, Channels, ChannelAdd, IntegrationManager, ChannelAddChatWeb, ChannelAddFacebook, ChannelAddMessenger,ChannelAddInstagram,ChannelAddWhatsapp,ChannelAddTelegram,
	Reports, ReportTemplate, MessageInbox, FlowDesigner, VariableConfiguration, ChannelAddTwitter, ChannelAddTwitterDM, Campaign, Emojis, PersonDetail
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
	} else if (!applications?.[location.pathname]?.[0] && !location.pathname.includes('channels')) {
		return <Redirect to={{ pathname: "/sign-in" }} />;
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
				<ProtectRoute exact path={paths.PERSONALIZEDREPORTS}>
					<Layout mainClasses={classes.main}>
						<ReportTemplate />
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
				<ProtectRoute exact path={paths.ORGANIZATIONS}>
					<Layout mainClasses={classes.main}>
						<Organizations />
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
				<ProtectRoute exact path={paths.TIPIFICATIONS}>
					<ExtrasLayout><Tipifications /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.DOMAINS}>
					<ExtrasLayout><Domains /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.PERSON}>
					<ExtrasLayout><Person /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.PERSON_DETAIL.path}>
					<ExtrasLayout><PersonDetail /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.MESSAGETEMPLATE}>
					<ExtrasLayout><MessageTemplates /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.INTEGRATIONMANAGER}>
					<ExtrasLayout><IntegrationManager /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.CAMPAIGN}>
					<ExtrasLayout><Campaign /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.FLOWDESIGNER}>
					<ExtrasLayout><FlowDesigner /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.VARIABLECONFIGURATION}>
					<ExtrasLayout><VariableConfiguration /></ExtrasLayout>
				</ProtectRoute>
				<ProtectRoute exact path={paths.EMOJIS}>
					<ExtrasLayout><Emojis /></ExtrasLayout>
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
