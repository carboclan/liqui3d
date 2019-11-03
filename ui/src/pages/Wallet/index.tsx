import React, { Component } from 'react';
import SidePanel from "./SidePanel";
import WalletTable from "./WalletTable";
import {Route, Switch} from "react-router";
import {WALLET, TRANSFER, CLAIM} from "../../constants/routes";
import './style/wallet.scss';
import Transfer from "../Transfer";
import Claim from "../Claim";

class Wallet extends Component {
  render() {
    return (
      <div className="wallet">
        <SidePanel />
        <Switch>
          <Route path={WALLET} component={WalletTable} exact />
          <Route path={TRANSFER} component={Transfer} exact />
          <Route path={CLAIM} component={Claim} exact />
        </Switch>
      </div>
    )
  }
}

export default Wallet;
