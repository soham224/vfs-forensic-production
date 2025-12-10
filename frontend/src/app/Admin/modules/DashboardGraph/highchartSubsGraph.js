import React, { Component } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";
import stock from "highcharts/modules/stock";
import { Col, Row } from "reactstrap";
drilldown(Highcharts);
stock(Highcharts);

const drilldownData = [
  { x: "01/01/21", y: 90 },
  { x: "02/01/2021", y: 30 },
];

export default class HighchartsComponent extends Component {
  constructor(props) {
    super(props);
    let piedata = this.props.pieData;
    let max = 4;
    let scrollbarFlag = true;
    if (this.props.xAxisData.length > 3) {
      max = 2;
      scrollbarFlag = true;
    } else {
      max = this.props.xAxisData.length - 1;
      scrollbarFlag = false;
    }
    this.state = {
      pioptions: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
        },
        title: {
          text: "Ratio",
        },
        tooltip: {
          pointFormat: "<b>{point.y}</b>",
        },
        accessibility: {
          point: {
            valueSuffix: "",
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: [
          {
            name: "Employee",
            colorByPoint: true,
            data: piedata,
          },
        ],
      },
      options: {
        chart: {
          type: "column",
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: this.props.xAxisData, // x axis
          min: 0,
          max: max,
          scrollbar: {
            enabled: scrollbarFlag,
          },
        },
        yAxis: {
          title: {
            text: "Label detected",
          },
          min: 0,
        },
        title: {
          text: "",
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          series: {
            turboThreshold: 0,
            cursor: "pointer",
          },
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
        },
        tooltip: {
          pointFormat:
            '<span style="color:{point.color}">{point.y}</span><br/>',
        },
        series: this.props.yAxisData,
      },
    };
  }

  addDrilldownSeries(e) {
    let x = [];
    let y = [];
    drilldownData.map((obj) => {
      x.push(obj.x);
      y.push({ name: obj.x, y: obj.y, drilldown: false });
      return null;
    });
    let yAxis = [{ name: this.state.mName, data: y }];
    this.state.chartObj.addSeriesAsDrilldown(e.point, yAxis[0]);
    this.state.chartObj.xAxis[0].update({
      categories: x,
    });
  }

  addDrillUpSeries(e) {
    this.state.chartObj.xAxis[0].update({
      categories: this.props.xAxisData,
    });
  }

  chartCallback = (e) => {
    this.setState({
      chartObj: e,
    });
    Highcharts.Tick.prototype.drillable = function () {};
  };

  render() {
    return (
      <div>
        <h3 style={{ textAlign: "center" }}>
          {this.props.mName + "-analysis"}
        </h3>
        <hr />
        <Row>
          <Col xl={4} lg={4} md={4} sm={12} xs={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={this.state.pioptions}
            />
          </Col>
          <Col xl={8} lg={8} md={8} sm={12} xs={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={this.state.options}
              callback={this.chartCallback}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
