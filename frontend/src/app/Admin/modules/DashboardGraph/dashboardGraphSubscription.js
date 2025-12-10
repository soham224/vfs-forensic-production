import React, { Component } from "react";
import Highcharts from "highcharts";
import drilldown from "highcharts/modules/drilldown";
import HighchartsComponent from "./highchartSubsGraph";
const moment = require("moment-timezone");
drilldown(Highcharts);

class DashboardGraphSubscription extends Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line
    let max = 4;
    this.state = {
      data: props.data,
      graphData: props.graphData,
      piedata: props.piedata,
      options: {},
      mName: props.mName,
      xAxisData: [],
      yAxisData: [],
    };
  }

  componentDidMount() {
    let obj = this.state.graphData;
    let labels = [];
    let labelObj = obj[0];
    // eslint-disable-next-line
    Object.entries(labelObj).map(([key, value]) => {
      labels.push(key);
    });
    const index = labels.indexOf("time_slot");
    if (index > -1) {
      labels.splice(index, 1);
    }
    let series = [];
    for (let j = 0; j < labels.length; j++) {
      let datalabel = labels[j];
      series.push({ name: datalabel, data: [] });
    }
    let xAxis = [];
    for (let y = 0; y < obj.length; y++) {
      let graphObj = obj[y];
      xAxis.push(graphObj.time_slot); //xAxis data
    }
    for (let i = 0; i < labels.length; i++) {
      for (let p = 0; p < obj.length; p++) {
        let obj1 = obj[p];
        let data = obj1[labels[i]];
        for (let s in series) {
          if (labels[i] === series[s].name) {
            series[s].data.push({ name: labels[i], y: data, drilldown: false }); //yAxis data
          }
        }
      }
    }
    let x = xAxis;
    let yAxis = series;
    let pieData = [];
    // eslint-disable-next-line
    Object.entries(this.props.piedata).map(([key, value]) => {
      pieData.push({
        name: key,
        y: value,
      });
    });

    let arr = [];
    let arr2 = [];
    let local = [];
    // eslint-disable-next-line
    x.map((x) => {
      arr = x.split("-");
      let str = [];
      // eslint-disable-next-line
      arr.map((y) => {
        let utcTime = "2017-02-02 " + y + ":00:00";
        let local_date = moment.utc(utcTime).local().format("HH mm");
        local = local_date.split(" ");
        local[0]++;
        str.push(local[0]);
      });

      arr2.push(str[0] + "-" + str[1]);
    });
    this.setState(
      {
        xAxisData: arr2,
        yAxisData: yAxis,
        pieData: pieData,
      },
      () => {}
    );
  }

  render() {
    return (
      <div id={this.props.key}>
        {this.state.xAxisData.length > 0 && (
          <HighchartsComponent
            pieData={this.state.pieData}
            xAxisData={this.state.xAxisData}
            yAxisData={this.state.yAxisData}
            mName={this.state.mName}
            id={this.props.key}
          />
        )}
      </div>
    );
  }
}

export default DashboardGraphSubscription;
