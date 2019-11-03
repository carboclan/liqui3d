import './main.scss';

import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

import AppHeader from '../../components/AppHeader';
import AppSidebar from '../../components/AppSiderbar';
import { Spinner } from '../../components/ui/LoadingIndicator';
import {
  CONFIRM_SEEDPHRASE_BACKUP__SOFTWARE,
  CONNECT_WALLET,
  CONNECT_WALLET__SOFTWARE,
  CREATE_WALLET__SOFTWARE,
  EXCHANGE,
  WALLET
} from '../../constants/routes';
import { REDUX_STATE } from '../../ducks';
import { ActionType } from '../../ducks/types';
import { checkLogin, login } from '../../ducks/user';
import Exchange from '../Exchange';
import Login from '../Login';
import Wallet from '../Wallet';

type StateProps = {
  isLoggedIn?: boolean;
};

type DispatchProps = {
  login: () => void;
  checkLogin: () => void;
};

type PropsType = StateProps & DispatchProps;

class Main extends Component<PropsType> {
  componentWillMount() {
    this.props.checkLogin();
  }

  render() {
    const { isLoggedIn } = this.props;

    if (typeof isLoggedIn === 'undefined') {
      return (
        <div className="app app--loading">
          <Spinner />
        </div>
      );
    }

    return (
      <div className="app">
        <AppSidebar />
        <div className="app__body">
          <AppHeader />
          {isLoggedIn ? this.renderRoutes() : this.renderAuthRoutes()}
        </div>
      </div>
    );
  }

  renderAuthRoutes(): ReactNode {
    return (
      <div className="app__content">
        <Switch>
          <Route path={CONNECT_WALLET__SOFTWARE} component={Login} exact />
          <Redirect to={CONNECT_WALLET__SOFTWARE} />
        </Switch>
      </div>
    );
  }

  renderRoutes(): ReactNode {
    return (
      <div className="app__content">
        <Switch>
          <Route path={EXCHANGE} component={Exchange} exact />
          <Route path={WALLET} component={Wallet} />
          <Redirect to="/exchange" />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state: REDUX_STATE): StateProps {
  return {
    isLoggedIn: state.user.isLoggedIn
  };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<REDUX_STATE, any, ActionType<any>>
): DispatchProps {
  return {
    login: () => dispatch(login('username', 'password')),
    checkLogin: () => dispatch(checkLogin())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
