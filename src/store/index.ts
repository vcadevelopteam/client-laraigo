import callAPIMiddleware from 'middlewares/apiMiddleware';
import { applyMiddleware, createStore, combineReducers, Middleware } from 'redux';
import thunk from 'redux-thunk';

import ticketReducer, { IState as ITicketState } from './ticket/reducer';
import loginReducer, { IState as ILogin } from './login/reducer';
import mainReducer, { IState as IMain } from './main/reducer';
import popusReducer, { IState as IPopus } from './popus/reducer';
import inboxReducer, { IState as IInbox } from './inbox/reducer';
import integrationManagerReducer, { IState as IIntegrationManager } from './integrationmanager/reducer';

export interface IRootState {
    ticket: ITicketState;
    login: ILogin,
    main: IMain;
    popus: IPopus;
    inbox: IInbox;
    integrationmanager: IIntegrationManager;
}

const rootReducer = combineReducers<IRootState>({
   ticket: ticketReducer,
   login: loginReducer,
   main: mainReducer,
   popus: popusReducer,
   inbox: inboxReducer,
   integrationmanager: integrationManagerReducer
});

export default function configureStore(preloadedState?: IRootState) {
    const middleware: Middleware[] = [callAPIMiddleware];
    const middlewareEnhancer = applyMiddleware(thunk, ...middleware);
    
    return createStore(rootReducer, preloadedState, middlewareEnhancer);
}
