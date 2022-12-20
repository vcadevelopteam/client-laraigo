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
import signupReducer, { IState as ISignUp} from './signup/reducer';
import personReducer, { IState as IPerson } from './person/reducer';
import settingReducer, { IState as ISetting } from './setting/reducer';
import activationUserReducer, { IState as IActivationUser } from './activationuser/reducer';
import leadReducer, { IState as ILead } from './lead/reducer';
import culqiReducer, { IState as ICulqi } from './culqi/reducer';
import dashboardReducer, { IState as IDashboard } from './dashboard/reducer';
import getlocationsReducer, { IState as IGetLocations } from './getlocations/reducer';
import getversionReducer, { IState as IGetVersion } from './getversion/reducer';
import subscriptionReducer, { IState as ISubscription } from './subscription/reducer';
import voximplantReducer, { IState as IVoximplant } from './voximplant/reducer';
import googleReducer, { IState as IGoogle } from './google/reducer';
import calendarReducer, { IState as ICalendar } from './calendar/reducer';

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
    culqi: ICulqi;
    dashboard: IDashboard;
    getlocations: IGetLocations;
    getversion: IGetVersion;
    subscription: ISubscription;
    voximplant: IVoximplant;
    google: IGoogle;
    calendar: ICalendar;
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
    culqi: culqiReducer,
    dashboard: dashboardReducer,
    getlocations: getlocationsReducer,
    subscription: subscriptionReducer,
    voximplant: voximplantReducer,
    google: googleReducer,
    getversion: getversionReducer,
    calendar: calendarReducer,
});

export default function configureStore(preloadedState?: IRootState) {
    const middleware: Middleware[] = [callAPIMiddleware, callWSMiddleware, voximplantMiddleware];

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const middlewareEnhancer = composeEnhancers(applyMiddleware(thunk, ...middleware));

    return createStore(rootReducer, preloadedState, middlewareEnhancer);
}
