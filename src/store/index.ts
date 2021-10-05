import callAPIMiddleware from 'middlewares/apiMiddleware';
import callWSMiddleware from 'middlewares/wsMiddleware';
import { applyMiddleware, compose, createStore, combineReducers, Middleware } from 'redux';
import thunk from 'redux-thunk';
import ticketReducer, { IState as ITicketState } from './ticket/reducer';
import channelReducer, { IState as IChannelState } from './channel/reducer';
import loginReducer, { IState as ILogin } from './login/reducer';
import mainReducer, { IState as IMain } from './main/reducer';
import popusReducer, { IState as IPopus } from './popus/reducer';
import inboxReducer, { IState as IInbox } from './inbox/reducer';
import integrationManagerReducer, { IState as IIntegrationManager } from './integrationmanager/reducer';
import botdesignerReducer, { IState as IBotDesigner } from './botdesigner/reducer';
import signupReducer, { IState as ISignUp} from './signup/reducer';
import personReducer, { IState as IPerson } from './person/reducer';

export interface IRootState {
    ticket: ITicketState;
    login: ILogin,
    main: IMain;
    popus: IPopus;
    inbox: IInbox;
    channel: IChannelState;
    integrationmanager: IIntegrationManager;
    botdesigner: IBotDesigner;
    signup: ISignUp;
    person: IPerson;
}

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}   

const rootReducer = combineReducers<IRootState>({
    ticket: ticketReducer,
    login: loginReducer,
    main: mainReducer,
    popus: popusReducer,
    inbox: inboxReducer,
    integrationmanager: integrationManagerReducer,
    channel: channelReducer,
    botdesigner: botdesignerReducer,
    signup: signupReducer,
    person: personReducer,
});

export default function configureStore(preloadedState?: IRootState) {
    const middleware: Middleware[] = [callAPIMiddleware, callWSMiddleware];

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const middlewareEnhancer = composeEnhancers(applyMiddleware(thunk, ...middleware));

    return createStore(rootReducer, preloadedState, middlewareEnhancer);
}
