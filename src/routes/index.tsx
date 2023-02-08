/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, lazy } from "react";
import Layout from 'components/layout/Layout';
import Popus from 'components/layout/Popus';
import { BrowserRouter as Router, Switch, Route, RouteProps, useLocation } from 'react-router-dom';
import paths from "common/constants/paths";
import { makeStyles } from "@material-ui/core";
import { useForcedDisconnection, useSelector } from 'hooks';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { setDataUser, wsConnect } from "store/inbox/actions";
import { voximplantConnect } from "store/voximplant/actions";
import { getAccessToken, removeAuthorizationToken } from 'common/helpers';
import { Redirect } from 'react-router-dom';
import { validateToken } from 'store/login/actions';
import { useDispatch } from 'react-redux';
import CancelEvent from "pages/CancelEvent";

const Users = lazy(() => import('pages/Users'));
const ReportScheduler = lazy(() => import('pages/ReportScheduler'));
const ProductCatalog = lazy(() => import('pages/ProductCatalog'));
const CatalogMaster = lazy(() => import('pages/CatalogMaster'));
const Orders = lazy(() => import('pages/Orders'));
const SignIn = lazy(() => import('pages/SignIn'));
const Properties = lazy(() => import('pages/Properties'));
const Quickreplies = lazy(() => import('pages/Quickreplies'));
const Groupconfig = lazy(() => import('pages/GroupConfig'));
const Whitelist = lazy(() => import('pages/Whitelist'));
const InappropriateWords = lazy(() => import('pages/InappropriateWords'));
const IntelligentModels = lazy(() => import('pages/IntelligentModels'));
const SLA = lazy(() => import('pages/SLA'));
const Domains = lazy(() => import('pages/Domains'));
const Reports = lazy(() => import('pages/Reports'));
const Person = lazy(() => import('pages/Person'));
const PersonDetail = lazy(() => import('pages/PersonDetail'));
const Supervisor = lazy(() => import('pages/Supervisor'));
const MessageInbox = lazy(() => import('pages/MessageInbox'));
const MessageTemplates = lazy(() => import('pages/MessageTemplates'));
const Tipifications = lazy(() => import('pages/Tipifications'));
const InputValidation = lazy(() => import('pages/InputValidation'));
const IntegrationManager = lazy(() => import('pages/IntegrationManager'));
const VariableConfiguration = lazy(() => import('pages/VariableConfiguration'));
const Emojis = lazy(() => import('pages/Emojis'));
const Iaservices = lazy(() => import('pages/LaraigoIA'));
const Campaign = lazy(() => import('pages/campaign/Campaign'));
const NotFound = lazy(() => import('pages/NotFound'));
const Forbidden = lazy(() => import('pages/Forbidden'));
const InternalServererror = lazy(() => import('pages/InternalServerError'));
const Corporations = lazy(() => import('pages/Corporations'));
const BillingSetups = lazy(() => import('pages/BillingSetups'));
const Organizations = lazy(() => import('pages/Organizations'));
const Tickets = lazy(() => import('pages/Tickets'));
const UserSettings = lazy(() => import('pages/UserSettings'));
const Invoice = lazy(() => import('pages/Invoice'));
const KPIManager = lazy(() => import('pages/KPIManager'));
const GetLocations = lazy(() => import('pages/GetLocations'));
const Calendar = lazy(() => import('pages/calendar/Calendar'));
const AutomatizationRules = lazy(() => import('pages/AutomatizationRules'));
const Channels = lazy(() => import('pages/channels/Channels'));
const ChannelAdd = lazy(() => import('pages/channels/ChannelAdd'));
const ChannelAddChatWeb = lazy(() => import('pages/channels/ChannelAddChatWeb'));
const ChannelAddWebForm = lazy(() => import('pages/channels/ChannelAddWebForm'));
const ChannelAddFacebook = lazy(() => import('pages/channels/ChannelAddFacebook'));
const ChannelAddMessenger = lazy(() => import('pages/channels/ChannelAddMessenger'));
const ChannelAddInstagram = lazy(() => import('pages/channels/ChannelAddInstagram'));
const ChannelAddInstagramDM = lazy(() => import('pages/channels/ChannelAddInstagramDM'));
const ChannelAddWhatsapp = lazy(() => import('pages/channels/ChannelAddWhatsapp'));
const ChannelAddTelegram = lazy(() => import('pages/channels/ChannelAddTelegram'));
const ChannelAddTwitter = lazy(() => import('pages/channels/ChannelAddTwitter'));
const ChannelAddTwitterDM = lazy(() => import('pages/channels/ChannelAddTwitterDM'));
const ChannelAddPhone = lazy(() => import('pages/channels/ChannelAddPhone'));
const ChannelAddSMS = lazy(() => import('pages/channels/ChannelAddSMS'));
const ChannelAddEmail = lazy(() => import('pages/channels/ChannelAddEmail'));
const ChannelAddIos = lazy(() => import('pages/channels/ChannelAddIos'));
const ChannelAddAndroid = lazy(() => import('pages/channels/ChannelAddAndroid'));
const ChannelAddTikTok = lazy(() => import('pages/channels/ChannelAddTikTok'));
const ChannelAddYouTube = lazy(() => import('pages/channels/ChannelAddYouTube'));
const ChannelAddLinkedIn = lazy(() => import('pages/channels/ChannelAddLinkedIn'));
const ChannelAddTeams = lazy(() => import('pages/channels/ChannelAddTeams'));
const ChannelAddBlogger = lazy(() => import('pages/channels/ChannelAddBlogger'));
const ChannelAddWhatsAppOnboarding = lazy(() => import('pages/channels/ChannelAddWhatsAppOnboarding'));
const ChannelEdit = lazy(() => import('pages/channels/ChannelEdit'));
const SignUp = lazy(() => import('pages/signup/SignUp'));
const BotDesigner = lazy(() => import('pages/BotDesigner'));
const Dashboard = lazy(() => import('pages/dashboard/Dashboard'))
const DashboardAdd = lazy(() => import('pages/dashboard/DashboardAdd'))
const DashboardLayout = lazy(() => import('pages/dashboard/DashboardLayout'))
const Settings = lazy(() => import('pages/Settings'));
const Privacy = lazy(() => import('pages/Privacy'));
const ActivateUser = lazy(() => import('pages/ActivateUser'));
const RecoverPassword = lazy(() => import('pages/RecoverPassword'));
const CRM = lazy(() => import('pages/crm/CRM'));
const LeadForm = lazy(() => import('pages/crm/LeadForm'));
const ChangePwdFirstLogin = lazy(() => import('pages/ChangePwdFirstLogin'));
const CalendarEvent = lazy(() => import('pages/CalendarEvent'));
const PaymentOrder = lazy(() => import('pages/PaymentOrder'));
const PaymentOrderNiubiz = lazy(() => import('pages/PaymentOrderNiubiz'));
const PaymentOrderNiubizStatus = lazy(() => import('pages/PaymentOrderNiubizStatus'));
const Assistant = lazy(() => import('pages/assistant/Assistant'));
const Location = lazy(() => import('pages/Location'));
const SecurityRules = lazy(() => import('pages/SecurityRules'));
const PostCreator = lazy(() => import('pages/PostCreator'));

const useStyles = makeStyles((theme) => ({
	main: {
		padding: theme.spacing(2),
		paddingTop: theme.spacing(1),
		width: '100%'
	},
}));

interface PrivateRouteProps extends Omit<RouteProps, "component"> {
	component: React.ElementType;
}

// view: 0
// modify: 1
// insert: 2
// delete: 3

const ProtectRoute: FC<PrivateRouteProps> = ({ children, component: Component, ...rest }) => {
	const resValidateToken = useSelector(state => state.login.validateToken);
	const ignorePwdchangefirstloginValidation = useSelector(state => state.login.ignorePwdchangefirstloginValidation);
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
			// const automaticConnection = resLogin.user?.automaticConnection || false;
			const automaticConnection = localStorage.getItem("firstLoad") === "1";
			if (automaticConnection) {
				localStorage.removeItem("firstLoad")
			}
			dispatch(setDataUser({
				holdingBySupervisor: resValidateToken.user?.properties.holding_by_supervisor || "CANAL",
				userGroup: resValidateToken.user?.groups || "",
				role: resValidateToken.user?.roledesc || "",
			}))

			const { userid, orgid, roledesc, ownervoxi, sitevoxi } = resValidateToken.user!!
			dispatch(wsConnect({ userid, orgid, usertype: 'PLATFORM', automaticConnection, fromLogin: automaticConnection, roledesc }));
			if (sitevoxi && ownervoxi) {
				dispatch(voximplantConnect({
					automaticConnection: automaticConnection || !!localStorage.getItem("agentConnected") || false,
					user: `user${userid}.${orgid}`,
					application: ownervoxi
				}));
			}
		}
	}, [resValidateToken.loading])

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
	} else if (!ignorePwdchangefirstloginValidation && resValidateToken.user!.pwdchangefirstlogin === true) {
		return <Redirect to={{ pathname: paths.CHNAGE_PWD_FIRST_LOGIN }} />;
	} else if (location.pathname !== "/" && !applications?.[location.pathname]?.[0] && !location.pathname.includes('channels') && !location.pathname.includes('person') && !location.pathname.includes('crm') && !location.pathname.includes('dashboard')) {
		return <Redirect to={{ pathname: "/403" }} />;
	} else if (location.pathname === "/") {
		return <Redirect to={{ pathname: resValidateToken.user?.redirect }} />
	} else {
		return <Route {...rest} render={props => <Component {...props} />} />;
	}
}

const RouterApp: FC = () => {
	const classes = useStyles();
	const dispatch = useDispatch();

	useForcedDisconnection(useCallback(() => {
		removeAuthorizationToken()
	}, [dispatch]));

	return (
		<Router basename={process.env.PUBLIC_URL}>
			<React.Suspense fallback={(
				<Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={true}>
					<CircularProgress color="inherit" />
				</Backdrop>
			)}>
				<Switch>
					<ProtectRoute exact path="/" component={() => <span>x</span>} />
					<Route exact path={paths.SIGNIN} render={() => <SignIn />} />
					<Route exact path={paths.SIGNUP.path} render={() => <SignUp />} />
					<Route exact path={paths.LOCATION.path} render={() => <GetLocations />} />
					<Route exact path={paths.CALENDAR_EVENT.path} render={() => <CalendarEvent />} />
					<Route exact path={paths.CANCEL_EVENT.path} render={() => <CancelEvent />} />
					<Route exact path={paths.CULQI_PAYMENTORDER.path} render={() => <PaymentOrder />} />
					<Route exact path={paths.NIUBIZ_PAYMENTORDER.path} render={() => <PaymentOrderNiubiz />} />
					<Route exact path={paths.NIUBIZ_PAYMENTORDERSTATUS.path} render={() => <PaymentOrderNiubizStatus />} />
					<Route exact path={paths.PRIVACY} render={() => <Privacy />} />
					<Route exact path={paths.ACTIVATE_USER.path} render={() => <ActivateUser />} />
					<Route exact path={paths.RECOVER_PASSWORD.path} render={() => <RecoverPassword />} />
					<ProtectRoute exact path={paths.PRODUCTCATALOG} component={() => (<Layout mainClasses={classes.main}><ProductCatalog /></Layout>)} />
					<ProtectRoute exact path={paths.CATALOGMASTER} component={() => (<Layout mainClasses={classes.main}><CatalogMaster /></Layout>)} />
					<ProtectRoute exact path={paths.ORDERS} component={() => (<Layout mainClasses={classes.main}><Orders /></Layout>)} />
					<ProtectRoute exact path={paths.REPORTS} component={() => (<Layout mainClasses={classes.main}><Reports /></Layout>)} />
					<ProtectRoute exact path={paths.REPORTSCHEDULER} component={() => (<Layout mainClasses={classes.main}><ReportScheduler /></Layout>)} />
					<ProtectRoute exact path={paths.TICKETS} component={() => (<Layout mainClasses={classes.main}><Tickets /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS} component={() => (<Layout mainClasses={classes.main}><Channels /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD} component={() => (<Layout mainClasses={classes.main}><ChannelAdd /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_CHATWEB} component={() => (<Layout mainClasses={classes.main}><ChannelAddChatWeb edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_WEBFORM} component={() => (<Layout mainClasses={classes.main}><ChannelAddWebForm edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_FACEBOOK.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddFacebook /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_MESSENGER.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddMessenger /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_INSTAGRAM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddInstagram /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_INSTAGRAMDM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddInstagramDM /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_WHATSAPP.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddWhatsapp edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_TELEGRAM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTelegram /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_TWITTER.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTwitter /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_TWITTERDM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTwitterDM /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_PHONE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddPhone /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_SMS.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddSMS /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_EMAIL.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddEmail /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_IOS.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddIos /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_ANDROID.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddAndroid /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_TIKTOK.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTikTok /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_YOUTUBE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddYouTube /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_LINKEDIN.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddLinkedIn /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_TEAMS.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTeams /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_BLOGGER.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddBlogger /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_WHATSAPPONBOARDING.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddWhatsAppOnboarding /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT.path} component={() => (<Layout mainClasses={classes.main}><ChannelEdit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_CHATWEB.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddChatWeb edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_WEBFORM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddWebForm edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_WHATSAPP.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddWhatsapp edit /></Layout>)} />
					<ProtectRoute exact path={paths.CORPORATIONS} component={() => (<Layout mainClasses={classes.main}><Corporations /></Layout>)} />
					<ProtectRoute exact path={paths.ORGANIZATIONS} component={() => (<Layout mainClasses={classes.main}><Organizations /></Layout>)} />
					<ProtectRoute exact path={paths.IASERVICES} component={() => (<Layout mainClasses={classes.main}><Iaservices /></Layout>)} />
					<ProtectRoute exact path={paths.SUPERVISOR} component={() => (<Layout ><Supervisor /></Layout>)} />
					<ProtectRoute exact path={paths.BILLING_SETUPS} component={() => (<Layout mainClasses={classes.main}><BillingSetups /></Layout>)} />
					<ProtectRoute exact path={paths.INVOICE} component={() => (<Layout mainClasses={classes.main}><Invoice /></Layout>)} />
					<ProtectRoute exact path={paths.MESSAGE_INBOX} component={() => (<Layout><MessageInbox /></Layout>)} />
					<ProtectRoute exact path={paths.PROPERTIES} component={() => <Layout mainClasses={classes.main}><Properties /></Layout>} />
					<ProtectRoute exact path={paths.USERS} component={() => <Layout mainClasses={classes.main}><Users /></Layout>} />
					<ProtectRoute exact path={paths.QUICKREPLIES} component={() => <Layout mainClasses={classes.main}><Quickreplies /></Layout>} />
					<ProtectRoute exact path={paths.GROUPCONFIG} component={() => <Layout mainClasses={classes.main}><Groupconfig /></Layout>} />
					<ProtectRoute exact path={paths.USERSETTINGS} component={() => <Layout mainClasses={classes.main}><UserSettings /></Layout>} />
					<ProtectRoute exact path={paths.INAPPROPRIATEWORDS} component={() => <Layout mainClasses={classes.main}><InappropriateWords /></Layout>} />
					<ProtectRoute exact path={paths.INTELLIGENTMODELS} component={() => <Layout mainClasses={classes.main}><IntelligentModels /></Layout>} />
					<ProtectRoute exact path={paths.SLA} component={() => <Layout mainClasses={classes.main}><SLA /></Layout>} />
					<ProtectRoute exact path={paths.TIPIFICATIONS} component={() => <Layout mainClasses={classes.main}><Tipifications /></Layout>} />
					<ProtectRoute exact path={paths.INPUTVALIDATION} component={() => <Layout mainClasses={classes.main}><InputValidation /></Layout>} />
					<ProtectRoute exact path={paths.DOMAINS} component={() => <Layout mainClasses={classes.main}><Domains /></Layout>} />
					<ProtectRoute exact path={paths.WHITELIST} component={() => <Layout mainClasses={classes.main}><Whitelist /></Layout>} />
					<ProtectRoute exact path={paths.PERSON} component={() => <Layout mainClasses={classes.main}><Person /></Layout>} />
					<ProtectRoute exact path={paths.PERSON_DETAIL.path} component={() => <Layout mainClasses={classes.main}><PersonDetail /></Layout>} />
					<ProtectRoute exact path={paths.MESSAGETEMPLATE} component={() => <Layout mainClasses={classes.main}><MessageTemplates /></Layout>} />
					<ProtectRoute exact path={paths.INTEGRATIONMANAGER} component={() => <Layout mainClasses={classes.main}><IntegrationManager /></Layout>} />
					<ProtectRoute exact path={paths.CAMPAIGN} component={() => <Layout mainClasses={classes.main}><Campaign /></Layout>} />
					<ProtectRoute exact path={paths.BOTDESIGNER} component={() => <Layout mainClasses={classes.main}><BotDesigner /></Layout>} />
					<ProtectRoute exact path={paths.VARIABLECONFIGURATION} component={() => <Layout mainClasses={classes.main}><VariableConfiguration /></Layout>} />
					<ProtectRoute exact path={paths.EMOJIS} component={() => <Layout mainClasses={classes.main}><Emojis /></Layout>} />
					<ProtectRoute exact path={paths.DASHBOARD} component={() => <Layout mainClasses={classes.main}><Dashboard /></Layout>} />
					<ProtectRoute exact path={paths.DASHBOARD_ADD} component={() => <Layout mainClasses={classes.main}><DashboardAdd /></Layout>} />
					<ProtectRoute exact path={paths.DASHBOARD_EDIT.path} component={() => <Layout mainClasses={classes.main}><DashboardAdd edit /></Layout>} />
					<ProtectRoute exact path={paths.DASHBOARD_COPY} component={() => <Layout mainClasses={classes.main}><DashboardAdd edit /></Layout>} />
					<ProtectRoute exact path={paths.DASHBOARD_LAYOUT.path} component={() => <Layout mainClasses={classes.main}><DashboardLayout /></Layout>} />
					<ProtectRoute exact path={paths.CONFIGURATION} component={() => <Layout mainClasses={classes.main}><Settings /></Layout>} />
					<ProtectRoute exact path={paths.AUTOMATIZATIONRULES} component={() => <Layout mainClasses={classes.main}><AutomatizationRules /></Layout>} />
					<ProtectRoute exact path={paths.CRM} component={() => <Layout mainClasses={classes.main}><CRM /></Layout>} />
					<ProtectRoute exact path={paths.AUTOMATIZATIONRULES} component={() => <Layout mainClasses={classes.main}><AutomatizationRules /></Layout>} />
					<ProtectRoute exact path={paths.CRM_ADD_LEAD} component={() => <Layout mainClasses={classes.main}><LeadForm /></Layout>} />
					<ProtectRoute exact path={paths.CRM_EDIT_LEAD.path} component={() => <Layout mainClasses={classes.main}><LeadForm edit /></Layout>} />
					<ProtectRoute exact path={paths.KPIMANAGER} component={() => <Layout mainClasses={classes.main}><KPIManager /></Layout>} />
					<ProtectRoute exact path={paths.CALENDAR} component={() => <Layout mainClasses={classes.main}><Calendar /></Layout>} />
					<ProtectRoute exact path={paths.ASSISTANT} component={() => <Layout mainClasses={classes.main}><Assistant /></Layout>} />
					<ProtectRoute exact path={paths.SECURITYRULES} component={() => <Layout mainClasses={classes.main}><SecurityRules /></Layout>} />
					<ProtectRoute exact path={paths.EXTRASLOCATION} component={() => <Layout mainClasses={classes.main}><Location /></Layout>} />
					<ProtectRoute exact path={paths.POSTCREATOR} component={() => (<Layout mainClasses={classes.main}><PostCreator /></Layout>)} />
					<Route exact path={paths.CHNAGE_PWD_FIRST_LOGIN}>
						<ChangePwdFirstLogin />
					</Route>
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
			</React.Suspense >
		</Router >
	);
};

export default RouterApp;