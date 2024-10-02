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
const Orders = lazy(() => import('pages/orders/Orders'));
const SignIn = lazy(() => import('pages/SignIn'));
const Properties = lazy(() => import('pages/Properties'));
const DocumentLibrary = lazy(() => import('pages/documentlibrary/DocumentLibrary'));
const Quickreplies = lazy(() => import('pages/Quickreplies'));
const Groupconfig = lazy(() => import('pages/GroupConfig'));
const Whitelist = lazy(() => import('pages/Whitelist'));
const InappropriateWords = lazy(() => import('pages/InappropriateWords'));
const ReassignmentRules = lazy(() => import('pages/ReassignmentRules'));
const AiConnectors = lazy(() => import('pages/aiconnectors/AiConnectors'));
const IAConfiguration = lazy(() => import('pages/iaconfiguration/IAConfiguration'));
const SLA = lazy(() => import('pages/SLA'));
const Domains = lazy(() => import('pages/Domains'));
const Reports = lazy(() => import('pages/Reports'));
const Person = lazy(() => import('pages/person/Person'));
const PersonDetail = lazy(() => import('pages/person/PersonDetail'));
const MetaChannels = lazy(() => import('pages/MetaChannels'));
const Supervisor = lazy(() => import('pages/Supervisor'));
const MessageInbox = lazy(() => import('pages/MessageInbox'));
const AdvancedTemplatesCampaigns = lazy(() => import('pages/AdvancedTemplatesCampaigns'));
const MessageTemplatesOld = lazy(() => import('pages/MessageTemplatesOld'));
const Tipifications = lazy(() => import('pages/Tipifications'));
const InputValidation = lazy(() => import('pages/InputValidation'));
const IntegrationManager = lazy(() => import('pages/IntegrationManager'));
const VariableConfiguration = lazy(() => import('pages/VariableConfiguration'));
const CustomVariable = lazy(() => import('pages/CustomVariable'));
const Emojis = lazy(() => import('pages/Emojis'));
const AITraining = lazy(() => import('pages/aitraining/AITraining'));
const CampaignOld = lazy(() => import('pages/campaignold/Campaign'));
const NotFound = lazy(() => import('pages/NotFound'));
const Forbidden = lazy(() => import('pages/Forbidden'));
const InternalServererror = lazy(() => import('pages/InternalServerError'));
const Corporations = lazy(() => import('pages/Corporations'));
const Partners = lazy(() => import('pages/partners/Partners'));
const DeliveryConfiguration = lazy(() => import('pages/deliveryconfiguration/DeliveryConfiguration'))
const OrderList = lazy(() => import('pages/deliveryorderslist/OrderList'))
const AttentionOrders = lazy(() => import('pages/attentionorders/AttentionOrders'))
const StoreCoverage = lazy(() => import('pages/storecoverage/StoreCoverage'))
const StoreOrders = lazy(() => import('pages/storeorders/StoreOrders'))
const BillingSetups = lazy(() => import('pages/BillingSetups'));
const TimeSheet = lazy(() => import('pages/TimeSheet'));
const Organizations = lazy(() => import('pages/Organizations'));
const Tickets = lazy(() => import('pages/Tickets'));
const UserSettings = lazy(() => import('pages/accountconfiguration/UserSettings'));
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
const ChannelAddFacebookLead = lazy(() => import('pages/channels/ChannelAddFacebookLead'));
const ChannelAddFacebookWorkplace = lazy(() => import('pages/channels/ChannelAddFacebookWorkplace'));
const ChannelAddFacebookDM = lazy(() => import('pages/channels/ChannelAddFacebookDM'));
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
const ChannelAddBusiness = lazy(() => import('pages/channels/ChannelAddBusiness'));
const ChannelAddPlayStore = lazy(() => import('pages/channels/ChannelAddPlayStore'));
const ChannelAddAppStore = lazy(() => import('pages/channels/ChannelAddAppStore'));
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
const TermsOfService = lazy(() => import('pages/TermsOfService'));
const ActivateUser = lazy(() => import('pages/ActivateUser'));
const RecoverPassword = lazy(() => import('pages/RecoverPassword'));
const Conversation = lazy(() => import('pages/Conversation'));
const CRM = lazy(() => import('pages/crm/CRM'));
const LeadForm = lazy(() => import('pages/crm/LeadForm'));
const ServiceDesk = lazy(() => import('pages/servicedesk/ServiceDesk'));
const ServiceDeskLeadForm = lazy(() => import('pages/servicedesk/ServiceDeskLeadForm'));
const ChangePwdFirstLogin = lazy(() => import('pages/ChangePwdFirstLogin'));
const CalendarEvent = lazy(() => import('pages/CalendarEvent'));
const PaymentOrder = lazy(() => import('pages/PaymentOrder'));
const PaymentOrderNiubiz = lazy(() => import('pages/PaymentOrderNiubiz'));
const PaymentOrderNiubizStatus = lazy(() => import('pages/PaymentOrderNiubizStatus'));
const PaymentOrderOpenpay = lazy(() => import('pages/PaymentOrderOpenpay'));
const PaymentOrderOpenpayColombia = lazy(() => import('pages/PaymentOrderOpenpayColombia'));
const PaymentOrderIzipay = lazy(() => import('pages/PaymentOrderIzipay'));
const PaymentOrderEpayco = lazy(() => import('pages/PaymentOrderEpayco'));
const PhoneRedirect = lazy(() => import('pages/PhoneRedirect'));
const Assistant = lazy(() => import('pages/assistant/Assistant'));
const Location = lazy(() => import('pages/Location'));
const SecurityRules = lazy(() => import('pages/SecurityRules'));
const PostCreator = lazy(() => import('pages/PostCreator'));
const ProductMaster = lazy(() => import('pages/inventory/product/ProductMaster'));
const Warehouse = lazy(() => import('pages/inventory/warehouse/Warehouse'));
const Company = lazy(() => import('pages/inventory/company/Company'));
const Inventory = lazy(() => import('pages/inventory/inventory/Inventory'));
const InventoryConsumption = lazy(() => import('pages/inventory/inventory_consumption/InventoryConsumption'));

const useStyles = makeStyles((theme) => ({
	main: {
		padding: theme.spacing(2),
		paddingTop: theme.spacing(1),
		paddingBottom: 0,
		width: '100%'
	},
}));

interface PrivateRouteProps extends Omit<RouteProps, "component"> {
	component: React.ElementType;
}

const cleanPath = (pathx: string) => {
	if (pathx.includes('channels')) {
		return "/channels";
	} else if (pathx.includes('person')) {
		return "/person";
	} else if (pathx.includes('crm')) {
		return "/crm";
	} else if (pathx.includes('dashboard')) {
		return "/dashboard";
	} else if (pathx.includes('servicedesk')) {
		return "/servicedesk";
	} else if (pathx.includes('orders')) {
		return "/orders";
	}
	return pathx
}

// view: 0
// modify: 1
// insert: 2
// delete: 3

const ProtectRoute: FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
	const resValidateToken = useSelector(state => state.login.validateToken);
	const ignorePwdchangefirstloginValidation = useSelector(state => state.login.ignorePwdchangefirstloginValidation);
	const applications = resValidateToken?.user?.menu;
	const location = useLocation();
	const dispatch = useDispatch();
	const existToken = getAccessToken();

	React.useEffect(() => {
		if (existToken)
			dispatch(validateToken(localStorage.getItem("firstLoad") ?? ""));
	}, [])

	React.useEffect(() => {
		if (!resValidateToken.error && !resValidateToken.loading) {
			localStorage.setItem("title", resValidateToken.user?.corpdesc!!);
			localStorage.setItem("headeicon", resValidateToken.user?.iconurl!!);

			const link = document.createElement('link');
			link.rel = 'icon';
			link.href = resValidateToken.user?.iconurl || "/favicon.ico";
			document.head.appendChild(link);
			document.title = resValidateToken.user?.corpdesc || "Laraigo";

			const automaticConnection = localStorage.getItem("firstLoad") === "1";
			const fromChangeOrganization = localStorage.getItem("changeorganization") === "1";
			if (automaticConnection) {
				localStorage.removeItem("firstLoad")
			}
			if (fromChangeOrganization) {
				localStorage.removeItem("changeorganization")
			}
			
			dispatch(setDataUser({
				holdingBySupervisor: resValidateToken.user?.properties.holding_by_supervisor || "TODO",
				botBySupervisor: resValidateToken.user?.properties.bot_by_supervisor || "TODO",
				userGroup: resValidateToken.user?.groups || "",
				role: resValidateToken.user?.roledesc || "",
				channels: resValidateToken.user?.channels || ""
			}))

			const { userid, orgid, roledesc, ownervoxi, sitevoxi } = resValidateToken.user!!
			dispatch(wsConnect({ userid, orgid, usertype: 'PLATFORM', automaticConnection, fromLogin: (!fromChangeOrganization && automaticConnection), roledesc }));
			if (sitevoxi && ownervoxi) {
				dispatch(voximplantConnect({
					automaticConnection: automaticConnection || Boolean(localStorage.getItem("agentConnected")) || false,
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
	} else if (location.pathname !== "/" && !applications?.[cleanPath(location.pathname)]?.[0]) {
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
		<Router basename={import.meta.env.BASE_URL}>
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
					<Route exact path={paths.OPENPAY_PAYMENTORDER.path} render={() => <PaymentOrderOpenpay />} />
					<Route exact path={paths.OPENPAYCOLOMBIA_PAYMENTORDER.path} render={() => <PaymentOrderOpenpayColombia />} />
					<Route exact path={paths.IZIPAY_PAYMENTORDER.path} render={() => <PaymentOrderIzipay />} />
					<Route exact path={paths.EPAYCO_PAYMENTORDER.path} render={() => <PaymentOrderEpayco />} />
					<Route exact path={paths.PHONE_REDIRECT.path} render={() => <PhoneRedirect />} />
					<Route exact path={paths.PRIVACY} render={() => <Privacy />} />
					<Route exact path={paths.TERMSOFSERVICE} render={() => <TermsOfService />} />
					<Route exact path={paths.ACTIVATE_USER.path} render={() => <ActivateUser />} />
					<Route exact path={paths.RECOVER_PASSWORD.path} render={() => <RecoverPassword />} />
					<Route exact path={paths.CONVERSATION.path} render={() => <Conversation />} />
					<ProtectRoute exact path={paths.PRODUCTCATALOG} component={() => (<Layout mainClasses={classes.main}><ProductCatalog /></Layout>)} />
					<ProtectRoute exact path={paths.CATALOGMASTER} component={() => (<Layout mainClasses={classes.main}><CatalogMaster /></Layout>)} />
					<ProtectRoute exact path={paths.ORDERS} component={() => (<Layout mainClasses={classes.main}><Orders /></Layout>)} />
					<ProtectRoute exact path={paths.REPORTS} component={() => (<Layout mainClasses={classes.main}><Reports /></Layout>)} />
					<ProtectRoute exact path={paths.REPORTSCHEDULER} component={() => (<Layout mainClasses={classes.main}><ReportScheduler /></Layout>)} />
					<ProtectRoute exact path={paths.TICKETS} component={() => (<Layout mainClasses={classes.main}><Tickets /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_ANDROID.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddAndroid edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_APPSTORE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddAppStore edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_BLOGGER.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddBlogger edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_BUSINESS.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddBusiness edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_CHATWEB.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddChatWeb edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_EMAIL.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddEmail edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_FACEBOOK.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddFacebook edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_FACEBOOK_LEAD.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddFacebookLead edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_FACEBOOKDM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddFacebookDM edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_FACEBOOKWORKPLACE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddFacebookWorkplace edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_INSTAGRAM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddInstagram edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_INSTAGRAMDM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddInstagramDM edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_IOS.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddIos edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_LINKEDIN.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddLinkedIn edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_MESSENGER.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddMessenger edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_PHONE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddPhone edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_PLAYSTORE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddPlayStore edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_SMS.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddSMS edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_TEAMS.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTeams edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_TELEGRAM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTelegram edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_TIKTOK.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTikTok edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_TWITTER.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTwitter edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_TWITTERDM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTwitterDM edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_WEBFORM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddWebForm edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_WHATSAPP.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddWhatsapp edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_WHATSAPPONBOARDING.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddWhatsAppOnboarding edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD_YOUTUBE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddYouTube edit={false} /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_ADD} component={() => (<Layout mainClasses={classes.main}><ChannelAdd /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT.path} component={() => (<Layout mainClasses={classes.main}><ChannelEdit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_ANDROID.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddAndroid edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_APPSTORE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddAppStore edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_BLOGGER.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddBlogger edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_BUSINESS.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddBusiness edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_CHATWEB.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddChatWeb edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_EMAIL.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddEmail edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_FACEBOOK.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddFacebook edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_FACEBOOK_LEAD.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddFacebookLead edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_FACEBOOKDM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddFacebookDM edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_FACEBOOKWORKPLACE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddFacebookWorkplace edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_INSTAGRAM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddInstagram edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_INSTAGRAMDM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddInstagramDM edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_IOS.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddIos edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_LINKEDIN.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddLinkedIn edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_MESSENGER.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddMessenger edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_PHONE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddPhone edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_PLAYSTORE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddPlayStore edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_SMS.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddSMS edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_TEAMS.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTeams edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_TELEGRAM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTelegram edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_TIKTOK.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTikTok edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_TWITTER.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTwitter edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_TWITTERDM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddTwitterDM edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_WEBFORM.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddWebForm edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_WHATSAPP.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddWhatsapp edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_WHATSAPPONBOARDING.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddWhatsAppOnboarding edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS_EDIT_YOUTUBE.path} component={() => (<Layout mainClasses={classes.main}><ChannelAddYouTube edit /></Layout>)} />
					<ProtectRoute exact path={paths.CHANNELS} component={() => (<Layout mainClasses={classes.main}><Channels /></Layout>)} />
					<ProtectRoute exact path={paths.CORPORATIONS} component={() => (<Layout mainClasses={classes.main}><Corporations /></Layout>)} />
					<ProtectRoute exact path={paths.PARTNERS} component={() => (<Layout mainClasses={classes.main}><Partners /></Layout>)} />
					<ProtectRoute exact path={paths.ORGANIZATIONS} component={() => (<Layout mainClasses={classes.main}><Organizations /></Layout>)} />
					<ProtectRoute exact path={paths.CONFIGURATIONDELIVERY} component={() => (<Layout mainClasses={classes.main}><DeliveryConfiguration /></Layout>)} />
					<ProtectRoute exact path={paths.ORDERINSTORE} component={() => (<Layout mainClasses={classes.main}><StoreOrders /></Layout>)} />
					<ProtectRoute exact path={paths.ORDERSINATTENTION} component={() => (<Layout mainClasses={classes.main}><AttentionOrders /></Layout>)} />
					<ProtectRoute exact path={paths.STORECOVERAGE} component={() => (<Layout mainClasses={classes.main}><StoreCoverage /></Layout>)} />
					<ProtectRoute exact path={paths.ORDERLIST} component={() => (<Layout mainClasses={classes.main}><OrderList /></Layout>)} />
					<ProtectRoute exact path={paths.SUPERVISOR} component={() => (<Layout ><Supervisor /></Layout>)} />
					<ProtectRoute exact path={paths.BILLING_SETUPS} component={() => (<Layout mainClasses={classes.main}><BillingSetups /></Layout>)} />
					<ProtectRoute exact path={paths.TIMESHEET} component={() => (<Layout mainClasses={classes.main}><TimeSheet /></Layout>)} />
					<ProtectRoute exact path={paths.INVOICE} component={() => (<Layout mainClasses={classes.main}><Invoice /></Layout>)} />
					<ProtectRoute exact path={paths.MESSAGE_INBOX} component={() => (<Layout><MessageInbox /></Layout>)} />
					<ProtectRoute exact path={paths.PROPERTIES} component={() => <Layout mainClasses={classes.main}><Properties /></Layout>} />
					<ProtectRoute exact path={paths.DOCUMENTLIBRARY} component={() => <Layout mainClasses={classes.main}><DocumentLibrary /></Layout>} />
					<ProtectRoute exact path={paths.USERS} component={() => <Layout mainClasses={classes.main}><Users /></Layout>} />
					<ProtectRoute exact path={paths.QUICKREPLIES} component={() => <Layout mainClasses={classes.main}><Quickreplies /></Layout>} />
					<ProtectRoute exact path={paths.GROUPCONFIG} component={() => <Layout mainClasses={classes.main}><Groupconfig /></Layout>} />
					<ProtectRoute exact path={paths.USERSETTINGS} component={() => <Layout mainClasses={classes.main}><UserSettings /></Layout>} />
					<ProtectRoute exact path={paths.INAPPROPRIATEWORDS} component={() => <Layout mainClasses={classes.main}><InappropriateWords /></Layout>} />
					<ProtectRoute exact path={paths.REASSIGNMENTRULES} component={() => <Layout mainClasses={classes.main}><ReassignmentRules /></Layout>} />
					<ProtectRoute exact path={paths.INTELLIGENTMODELS} component={() => <Layout mainClasses={classes.main}><AiConnectors /></Layout>} />
					<ProtectRoute exact path={paths.SLA} component={() => <Layout mainClasses={classes.main}><SLA /></Layout>} />
					<ProtectRoute exact path={paths.TIPIFICATIONS} component={() => <Layout mainClasses={classes.main}><Tipifications /></Layout>} />
					<ProtectRoute exact path={paths.INPUTVALIDATION} component={() => <Layout mainClasses={classes.main}><InputValidation /></Layout>} />
					<ProtectRoute exact path={paths.DOMAINS} component={() => <Layout mainClasses={classes.main}><Domains /></Layout>} />
					<ProtectRoute exact path={paths.WHITELIST} component={() => <Layout mainClasses={classes.main}><Whitelist /></Layout>} />
					<ProtectRoute exact path={paths.PERSON} component={() => <Layout mainClasses={classes.main}><Person /></Layout>} />
					<ProtectRoute exact path={paths.PERSON_DETAIL.path} component={() => <Layout mainClasses={classes.main}><PersonDetail /></Layout>} />
					<ProtectRoute exact path={paths.METACHANNELS} component={() => <Layout mainClasses={classes.main}><MetaChannels /></Layout>} />
					<ProtectRoute exact path={paths.ADVANCEDTEMPLATESCAMPAIGNS} component={() => <Layout mainClasses={classes.main}><AdvancedTemplatesCampaigns /></Layout>} />
					<ProtectRoute exact path={paths.MESSAGETEMPLATE} component={() => <Layout mainClasses={classes.main}><MessageTemplatesOld /></Layout>} />
					<ProtectRoute exact path={paths.INTEGRATIONMANAGER} component={() => <Layout mainClasses={classes.main}><IntegrationManager /></Layout>} />
					<ProtectRoute exact path={paths.CAMPAIGN} component={() => <Layout mainClasses={classes.main}><CampaignOld /></Layout>} />
					<ProtectRoute exact path={paths.BOTDESIGNER} component={() => <Layout mainClasses={classes.main}><BotDesigner /></Layout>} />
					<ProtectRoute exact path={paths.VARIABLECONFIGURATION} component={() => <Layout mainClasses={classes.main}><VariableConfiguration /></Layout>} />
					<ProtectRoute exact path={paths.CUSTOMVARIABLE} component={() => <Layout mainClasses={classes.main}><CustomVariable /></Layout>} />
					<ProtectRoute exact path={paths.EMOJIS} component={() => <Layout mainClasses={classes.main}><Emojis /></Layout>} />
					<ProtectRoute exact path={paths.DASHBOARD} component={() => <Layout mainClasses={classes.main}><Dashboard /></Layout>} />
					<ProtectRoute exact path={paths.DASHBOARD_ADD} component={() => <Layout mainClasses={classes.main}><DashboardAdd /></Layout>} />
					<ProtectRoute exact path={paths.DASHBOARD_EDIT.path} component={() => <Layout mainClasses={classes.main}><DashboardAdd edit /></Layout>} />
					<ProtectRoute exact path={paths.DASHBOARD_COPY} component={() => <Layout mainClasses={classes.main}><DashboardAdd edit /></Layout>} />
					<ProtectRoute exact path={paths.DASHBOARD_LAYOUT.path} component={() => <Layout mainClasses={classes.main}><DashboardLayout /></Layout>} />
					<ProtectRoute exact path={paths.CONFIGURATION} component={() => <Layout mainClasses={classes.main}><Settings /></Layout>} />
					<ProtectRoute exact path={paths.AUTOMATIZATIONRULES} component={() => <Layout mainClasses={classes.main}><AutomatizationRules /></Layout>} />
					<ProtectRoute exact path={paths.CRM} component={() => <Layout mainClasses={classes.main}><CRM /></Layout>} />
					<ProtectRoute exact path={paths.SERVICE_DESK} component={() => <Layout mainClasses={classes.main}><ServiceDesk /></Layout>} />
					<ProtectRoute exact path={paths.CRM_ADD_LEAD} component={() => <Layout mainClasses={classes.main}><LeadForm /></Layout>} />
					<ProtectRoute exact path={paths.CRM_EDIT_LEAD.path} component={() => <Layout mainClasses={classes.main}><LeadForm edit /></Layout>} />
					<ProtectRoute exact path={paths.SERVICE_DESK_ADD_LEAD} component={() => <Layout mainClasses={classes.main}><ServiceDeskLeadForm /></Layout>} />
					<ProtectRoute exact path={paths.SERVICE_DESK_EDIT_LEAD.path} component={() => <Layout mainClasses={classes.main}><ServiceDeskLeadForm edit /></Layout>} />
					<ProtectRoute exact path={paths.KPIMANAGER} component={() => <Layout mainClasses={classes.main}><KPIManager /></Layout>} />
					<ProtectRoute exact path={paths.CALENDAR} component={() => <Layout mainClasses={classes.main}><Calendar /></Layout>} />
					<ProtectRoute exact path={paths.ASSISTANT} component={() => <Layout mainClasses={classes.main}><Assistant /></Layout>} />
					<ProtectRoute exact path={paths.SECURITYRULES} component={() => <Layout mainClasses={classes.main}><SecurityRules /></Layout>} />
					<ProtectRoute exact path={paths.EXTRASLOCATION} component={() => <Layout mainClasses={classes.main}><Location /></Layout>} />
					<ProtectRoute exact path={paths.POSTCREATOR} component={() => (<Layout mainClasses={classes.main}><PostCreator /></Layout>)} />
					<ProtectRoute exact path={paths.PRODUCTMASTER} component={() => (<Layout mainClasses={classes.main}><ProductMaster /></Layout>)} />
					<ProtectRoute exact path={paths.WAREHOUSE} component={() => (<Layout mainClasses={classes.main}><Warehouse /></Layout>)} />
					<ProtectRoute exact path={paths.IACONECTORS} component={() => (<Layout mainClasses={classes.main}><AiConnectors /></Layout>)} />
					<ProtectRoute exact path={paths.IACONFIGURATION} component={() => (<Layout mainClasses={classes.main}><IAConfiguration /></Layout>)} />
					<ProtectRoute exact path={paths.IATRAINING} component={() => (<Layout mainClasses={classes.main}><AITraining /></Layout>)} />
					<ProtectRoute exact path={paths.INVENTORY} component={() => (<Layout mainClasses={classes.main}><Inventory /></Layout>)} />
					<ProtectRoute exact path={paths.COMPANIES} component={() => (<Layout mainClasses={classes.main}><Company /></Layout>)} />
					<ProtectRoute exact path={paths.INVENTORYCONSUMPTION} component={() => (<Layout mainClasses={classes.main}><InventoryConsumption /></Layout>)} />
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
			</React.Suspense>
		</Router >
	);
};

export default RouterApp;