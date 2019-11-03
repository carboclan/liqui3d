import React, {Component, ReactNode} from 'react';
import { Dispatch} from "redux";
import { connect } from 'react-redux';
import {
  Module,
  ModuleHeader,
  ModuleHeaderButton,
  ModuleContent,
} from "../../components/Module";
import {
  Table,
  TableHeaderRow,
  TableHeader,
  TableRow,
  TableCell,
} from "../../components/ui/Table";
import Pot from "../../components/ui/Pot";
import {REDUX_STATE} from "../../ducks";
import {ActionType} from "../../ducks/types";
import {BatchType, selectBatch} from "../../ducks/exchange";
import {AssetType} from "../../ducks/assets";
import {getHHMMSS} from "../../utils/date-util";
import {findQuantityOverPrice, findQuantityUnderPrice} from "../../utils/exchange-utils";
import {RewardType} from "../../ducks/user";

enum ListTab {
  batch = 'batch',
  order = 'order',
  pot = 'pot',
}

type StateProps = {
  batches: {
    [blockId: string]: BatchType
  }
  baseAsset?: AssetType
  quoteAsset?: AssetType
  rewards: {
    [assetId: string]: RewardType
  },
  assets: {
    [assetId: string]: AssetType
  }
}

type DispatchProps = {
  selectBatch: (blockId: string) => void
}

type PropTypes = StateProps & DispatchProps

type State = {
  currentTab: ListTab,
  batchLength: number,
  time: number
}

class List extends Component<PropTypes, State> {
  state = {
    currentTab: ListTab.batch,
    batchLength: 0,
    time: 0,
  };

  tickEvent = setInterval(() => {}, 10000000000);

  componentDidMount() {
    this.tickEvent = setInterval(this.tick, 1000);
  }

  componentDidUpdate() {
    let newLength = Object.keys(this.props.batches).length;
    if (newLength !== this.state.batchLength) {
      this.setState((prevState) => {
        let time = prevState.time + 30;
        if (time > 30) {
          time = 30;
        }
        return {
          batchLength: newLength,
          time: time
        }
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.tickEvent);
  }

  tick = () => {
    if (this.state.time === 0 || Object.keys(this.props.batches).length === 0) {
      return;
    }

    if (this.state.time === 1) {
      this.setState({time: 30});
      return;
    }

    this.setState((prevState) => {
      return {
        time: prevState.time - 1
      }
    })
  }

  render() {
    return (
      <Module className="exchange__list">
        <ModuleHeader>
          <ModuleHeaderButton
            active={this.state.currentTab === ListTab.batch}
            onClick={() => this.setState({ currentTab: ListTab.batch })}
          >
            Batch
          </ModuleHeaderButton>
          <ModuleHeaderButton
            active={this.state.currentTab === ListTab.pot}
            onClick={() => this.setState({ currentTab: ListTab.pot })}
          >
            Pot
          </ModuleHeaderButton>
        </ModuleHeader>
        <ModuleContent>
          { this.renderContent() }
        </ModuleContent>
      </Module>
    );
  }

  renderContent (): ReactNode {
    let rewards;
    if (this.props.rewards === undefined){
      rewards = 0;
    } else {
      for (let assetId in this.props.rewards) {
        const { decimals } = this.props.assets[assetId];
        const { balance } = this.props.rewards[assetId];
        rewards = balance.dividedBy(10 ** decimals).toFixed(4);
      }
    }
    switch (this.state.currentTab) {
      case ListTab.batch:
        return (
          <Table>
            <TableHeaderRow>
              <TableHeader>Price</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Time</TableHeader>
            </TableHeaderRow>
            <div className="exchange__list__table-content">
              {
                Object.entries(this.props.batches)
                .reverse()
                .map(([_, batch]) => {
                  return this.renderRow(batch);
                })
              }
            </div>
          </Table>
        );
      case ListTab.pot:
        return (
          <Pot
            type="inProgress"
            pot={52324}
            keys={5}
            earnings={rewards}
            time={this.state.time}
          />
        )
      default:
        return null;
    }
  }

  renderRow(batch: BatchType): React.ReactNode {
    const { baseAsset, quoteAsset, selectBatch} = this.props;

    if (!baseAsset || !quoteAsset) return null;

    const {
      blockId,
      clearingPrice,
      bids,
      asks,
      date,
    } = batch;

    const as = findQuantityUnderPrice(asks, clearingPrice);
    const ad = findQuantityOverPrice(bids, clearingPrice);

    const clearingQuantity = as.isLessThan(ad) ? as : ad;

    return (
      <TableRow
        key={blockId}
        onClick={() => selectBatch(blockId)}
        tabIndex={0}
      >
        <TableCell>
          {
            clearingPrice.div(10 ** quoteAsset.decimals)
              .toFixed(Math.min(quoteAsset.nativeDecimals, 4))
          }
        </TableCell>
        <TableCell>
          {
            clearingQuantity.div(10 ** baseAsset.decimals)
              .toFixed(Math.min(baseAsset.nativeDecimals, 6))
          }
        </TableCell>
        <TableCell>{getHHMMSS(date)}</TableCell>
      </TableRow>
    )
  }
}

function mapStateToProps(state: REDUX_STATE): StateProps {
  const {
    exchange: { selectedMarket, markets },
    assets: { assets, symbolToAssetId },
  } = state;
  const {
    batches = {},
    quoteSymbol = '',
    baseSymbol = '',
  } = markets[selectedMarket] || {};

  const baseAsset = assets[symbolToAssetId[baseSymbol]];
  const quoteAsset = assets[symbolToAssetId[quoteSymbol]];

  return {
    batches,
    baseAsset,
    quoteAsset,
    rewards: state.user.rewards,
    assets: state.assets.assets,
  }
}

function mapDispatchToProps(dispatch: Dispatch<ActionType<any>>): DispatchProps {
  return {
    selectBatch: (blockId: string) => dispatch(selectBatch(blockId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)