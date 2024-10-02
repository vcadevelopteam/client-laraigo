import callAPIMiddleware from 'middlewares/apiMiddleware';
import callWSMiddleware from 'middlewares/wsMiddleware';
import voximplantMiddleware from 'middlewares/voximplantMiddleware';
import { applyMiddleware, compose, createStore, combineReducers, Middleware } from 'redux';
import thunk from 'redux-thunk';
import channelReducer, { IState as IChannelState } from './channel/reducer';
import loginReducer, { IState as ILogin } from './login/reducer';
import mainReducer, { IState as IMain } from './main/reducer';
import popusReducer, { IState as IPopus } from './popus/reducer';
import inboxReducer, { IState as IInbox } from './inbox/reducer';
import integrationManagerReducer, { IState as IIntegrationManager } from './integrationmanager/reducer';
import botdesignerReducer, { IState as IBotDesigner } from './botdesigner/reducer';
import signupReducer, { IState as ISignUp } from './signup/reducer';
import personReducer, { IState as IPerson } from './person/reducer';
import settingReducer, { IState as ISetting } from './setting/reducer';
import activationUserReducer, { IState as IActivationUser } from './activationuser/reducer';
import leadReducer, { IState as ILead } from './lead/reducer';
import gptReducer, { IState as IGpt } from './gpt/reducer';
import llamaReducer, { IState as ILlama } from './llama/reducer';
import llama3Reducer, { IState as ILlama3 } from './llama3/reducer';
import servicedeskReducer, { IState as IServiceDesk } from './servicedesk/reducer';
import culqiReducer, { IState as ICulqi } from './culqi/reducer';
import dashboardReducer, { IState as IDashboard } from './dashboard/reducer';
import getlocationsReducer, { IState as IGetLocations } from './getlocations/reducer';
import getversionReducer, { IState as IGetVersion } from './getversion/reducer';
import subscriptionReducer, { IState as ISubscription } from './subscription/reducer';
import voximplantReducer, { IState as IVoximplant } from './voximplant/reducer';
import googleReducer, { IState as IGoogle } from './google/reducer';
import witaiReducer, { IState as IWitai } from './witia/reducer';
import productReducer, { IState as IProduct } from './product/reducer';
import calendarReducer, { IState as ICalendar } from './calendar/reducer';
import postHistoryReducer, { IState as IPostHistory } from './posthistory/reducer';
import catalogReducer, { IState as ICatalog } from './catalog/reducer';
import paymentReducer, { IState as IPayment } from './payment/reducer';
import rasaiaReducer, { IState as IRasaia } from './rasaia/reducer';
import conversationReducer, { IState as IConversation } from './conversation/reducer';
import corporationReducer, { IState as ICorporation } from './corp/reducer';
import deliveryReducer, { IState as IDelivery } from './delivery/reducer';
import ordersReducer, { IState as IOrders } from './orders/reducer';
import watsonReducer, { IState as IWatson } from './watsonx/reducer';

export interface IRootState {
    login: ILogin,
    main: IMain;
    popus: IPopus;
    inbox: IInbox;
    channel: IChannelState;
    integrationmanager: IIntegrationManager;
    botdesigner: IBotDesigner;
    signup: ISignUp;
    person: IPerson;
    setting: ISetting;
    activationuser: IActivationUser;
    lead: ILead;
    llama: ILlama;
    llama3: ILlama3;
    culqi: ICulqi;
    dashboard: IDashboard;
    delivery: IDelivery;
    getlocations: IGetLocations;
    getversion: IGetVersion;
    subscription: ISubscription;
    voximplant: IVoximplant;
    google: IGoogle;
    gpt: IGpt;
    witai: IWitai;
    calendar: ICalendar;
    product: IProduct;
    postHistory: IPostHistory;
    catalog: ICatalog;
    payment: IPayment;
    servicedesk: IServiceDesk;
    rasaia: IRasaia
    conversation: IConversation
    corporation: ICorporation
    orders: IOrders,
    watson: IWatson,
}

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const rootReducer = combineReducers<IRootState>({
    login: loginReducer,
    main: mainReducer,
    popus: popusReducer,
    inbox: inboxReducer,
    integrationmanager: integrationManagerReducer,
    channel: channelReducer,
    botdesigner: botdesignerReducer,
    signup: signupReducer,
    person: personReducer,
    setting: settingReducer,
    activationuser: activationUserReducer,
    lead: leadReducer,
    llama: llamaReducer,
    llama3: llama3Reducer,
    culqi: culqiReducer,
    dashboard: dashboardReducer,
    delivery: deliveryReducer,
    getlocations: getlocationsReducer,
    subscription: subscriptionReducer,
    voximplant: voximplantReducer,
    google: googleReducer,
    gpt: gptReducer,
    witai: witaiReducer,
    product: productReducer,
    postHistory: postHistoryReducer,
    getversion: getversionReducer,
    calendar: calendarReducer,
    catalog: catalogReducer,
    payment: paymentReducer,
    servicedesk: servicedeskReducer,
    rasaia: rasaiaReducer,
    conversation: conversationReducer,
    corporation: corporationReducer,
    orders: ordersReducer,
    watson: watsonReducer,
});

export default function configureStore(preloadedState?: IRootState) {
    const middleware: Middleware[] = [callAPIMiddleware, callWSMiddleware, voximplantMiddleware];

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const middlewareEnhancer = composeEnhancers(applyMiddleware(thunk, ...middleware));

    return createStore(rootReducer, preloadedState, middlewareEnhancer);
}
