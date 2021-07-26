import callAPIMiddleware from 'middlewares/apiMiddleware';
import { applyMiddleware, createStore, combineReducers, Middleware } from 'redux';
import thunk from 'redux-thunk';

import ticketReducer, { IState as ITicketState } from './ticket/reducer';

export interface IRootState {
    ticket: ITicketState;
}

const rootReducer = combineReducers<IRootState>({
   ticket: ticketReducer,
});

export default function configureStore(preloadedState?: IRootState) {
    const middleware: Middleware[] = [callAPIMiddleware];
    const middlewareEnhancer = applyMiddleware(thunk, ...middleware);
    
    return createStore(rootReducer, preloadedState, middlewareEnhancer);
}
