import React, {Component, Fragment} from "react";
import "./pot.scss";


export default class Pot extends Component {
    renderContent = () => {
        let {time} = this.props;
        switch(this.props.type) {
            case "inProgress":
                return (
                    <Fragment>
                        <h2>Contract will drain in</h2>
                        <h3>{parseInt(time/60)}:{time%60}</h3>
                        <p>
                            <span>
                                Active Pot:
                            </span>
                            <span>
                                {this.props.pot}ETH
                            </span>
                        </p>
                        <hr />
                        <p>
                            <span>
                                Your keys:
                            </span>
                            <span>
                                {this.props.keys}
                            </span>
                        </p>
                        <hr />
                        <p>
                            <span>
                                Your earnings:
                            </span>
                            <span>
                                {this.props.earnings}
                            </span>
                        </p>
                        <hr />
                    </Fragment>
                    );
            case "notJoined":
                return ("You didn't participate! : ( Loser");
        }
    }

    render() {
        return (
            <div className={`pot`}>
                {this.renderContent()}
            </div>
        )
    }
}