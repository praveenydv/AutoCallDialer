import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import 'antd/dist/antd.css';
import { BrowserRouter as Router,Route,Switch,withRouter } from 'react-router-dom';
import authReducer from './store/reducers/auth';
import navReducer from './store/reducers/nav';
import messageReducer from './store/reducers/message';
import Login from './containers/login'
import Register from './containers/register'
import ForgotPassword from './containers/ForgotPassword'
import ResetPassword from './containers/passwordReset'
import NotFound from "./containers/NotFound";
import Autodialer from "./containers/Autodialer";
import ContactView from "./containers/ContactView";
import PhonebookContactView from "./containers/PhonebookContactView";
import PhonebookView from "./containers/PhonebookView";
import 'materialize-css/dist/css/materialize.min.css';
import  './assets/css/style.css'
import  './assets/css/main.css'
import  './assets/css/util.css'
import  './assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css'

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose


function configureStore() {
    const rootReducer=combineReducers({
        auth:authReducer,
        message:messageReducer,
        nav: navReducer,
    });

    const store = createStore(rootReducer, composeEnhances(
        applyMiddleware(thunk)
    ));

    if (module.hot) {
      module.hot.accept('./store/reducers/auth', () => {
        const nextRootReducer = require('./store/reducers/auth');
        store.replaceReducer(nextRootReducer);
      });
    }

    return store;
}

const store = configureStore();


const app = (

    <Provider store={store}>
        <Router>
        <Switch>
            <Route exact path="/register" component={withRouter(Register)}/>
            <Route exact path="/forgot" component={ForgotPassword}/>

            <Route exact path="/password/reset/:uid/:key" component={ResetPassword}/>
            <Route exact path="/login" component={withRouter(Login)}/>

            <Route exact path={["/phonebook","/"]} component={withRouter(PhonebookView)}/>
            <Route exact path="/contacts" component={withRouter(ContactView)}/>
            <Route exact path="/phonebook/:pb_id" component={withRouter(PhonebookContactView)}/>
            <Route exact path="/autodialer" component={withRouter(Autodialer)}/>
            <Route path='*' exact={true} component={NotFound} />
        </Switch>
        </Router>
    </Provider>
)
ReactDOM.render(app, document.getElementById("app"));
