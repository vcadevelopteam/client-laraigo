import callAPIMiddleware from 'middlewares/apiMiddleware';
import { applyMiddleware, createStore, combineReducers, Middleware } from 'redux';
import thunk from 'redux-thunk';

import ticketReducer, { IState as ITicketState } from './ticket/reducer';
import loginReducer, { IState as ILogin } from './login/reducer';
import mainReducer, { IState as IMain } from './main/reducer';
import popusReducer, { IState as IPopus } from './popus/reducer';

export interface IRootState {
    ticket: ITicketState;
    login: ILogin,
    main: IMain;
    popus: IPopus;
}

const rootReducer = combineReducers<IRootState>({
   ticket: ticketReducer,
   login: loginReducer,
   main: mainReducer,
   popus: popusReducer
});

export default function configureStore(preloadedState?: IRootState) {
    const middleware: Middleware[] = [callAPIMiddleware];
    const middlewareEnhancer = applyMiddleware(thunk, ...middleware);
    
    return createStore(rootReducer, preloadedState, middlewareEnhancer);
}
