import React, { Component, Fragment } from "react";
import DashboardGraphSubscription from "./dashboardGraphSubscription";
import { getResultOfGraphData } from "./_redux";
import { warningToast } from "../../../../utils/ToastMessage";
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { connect } from "react-redux";
import * as auth from "../Auth";
import { getIsoObjInZeroFormat } from "../../../../utils/TimeZone";
class DashboardGetSubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: [],
      data: [],
      mName: "",
      mRate: 0,
      blocking: false
    };
  }

  componentDidMount() {
    const { user } = this.props;
    let userRole = user.roles[0].role;
    this.setState(
      {
        userRole: userRole
      },
      () => {
        this.getSubscriptionData();
      }
    );
  }

  getSubscriptionData = () => {
    this.setState({
      blocking: true
    });
    getResultOfGraphData(getIsoObjInZeroFormat(), this.state.userRole)
      .then(response => {
        if (response && response.isSuccess) {
          let data1 = response.data;
          this.setState({
            data: data1,
            blocking: false
          });
        } else {
          this.setState({
            blocking: false
          });
          warningToast("No data found");
        }
      })
      .catch(error => {
        this.setState({
          blocking: false
        });
        if (error.detail) {
          warningToast(error.detail);
        } else {
          warningToast("Something went Wrong");
        }
      });
  };

  render() {
    return (
      <Fragment>
        <BlockUi tag="div" blocking={this.state.blocking} color="#147b82">
          <div>
            {this.state.data &&
              this.state.data.map((obj, key) => {
                return (
                  <div className={"row"}>
                    {obj.model_graph_data.length > 0 && (
                      <div className="col-xl-12">
                        <div
                          className={
                            "graph-dashboard-card card p-4 card-custom gutter-b bgi-no-repeat bgi-no-repeat bgi-size-cover"
                          }
                        >
                          <DashboardGraphSubscription
                            key={key}
                            data={this.state.data}
                            piedata={obj.model_pie_data}
                            graphData={obj.model_graph_data}
                            mName={obj.model_name}
                            mRate={obj.model_today_rate}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </BlockUi>
      </Fragment>
    );
  }
}
function mapStateToProps(state) {
  const { auth } = state;
  return { user: auth.user };
}

export default connect(mapStateToProps, auth.actions)(DashboardGetSubscription);
