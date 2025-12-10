import React, { Component, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";
import stock from "highcharts/modules/stock";
import { getFilterGraphData } from "./_redux";
import { warningToast } from "../../../../utils/ToastMessage";
import { connect } from "react-redux";
import * as auth from "../Auth";
import moment from "moment";
import {
  getCurrentEndDate,
  getCurrentStartDate
} from "../../../../utils/TimeZone";

drilldown(Highcharts);
stock(Highcharts);

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const valueOfMonth = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
};

class DashboardGraph extends Component {
  constructor(props) {
    super(props);
    let xAis = [];
    let yAis = [];
    let mnthXaxis = [];
    if (this.props.parameters.duration_type !== "month") {
      mnthXaxis = this.props.xAxis;
    } else {
      for (let y = 0; y < this.props.xAxis.length; y++) {
        let xData = this.props.xAxis[y];
        let date = xData.split("-");
        let obj = monthNames[date[1] - 1] + "-" + date[0];
        mnthXaxis.push(obj);
      }
    }
    xAis.push(mnthXaxis);
    yAis.push(this.props.yAxis);
    let max = 4;
    if (mnthXaxis.length > 20) {
      max = 5;
    } else {
      max = mnthXaxis.length - 1;
    }
    this.state = {
      allowChartUpdate: true,
      xAxisData: xAis,
      yAxisData: yAis,
      drilldownCount: 0,
      options: {
        chart: {
          type: "column",
          events: {
            drilldown: this.addDrilldownSeries.bind(this),
            drillupall: this.addDrillUpSeries.bind(this)
          }
        },
        credits: {
          enabled: false
        },

        xAxis: {
          categories: mnthXaxis,
          min: 0,
          max: max,
          scrollbar: {
            enabled: true
          }
        },
        yAxis: {
          title: {
            text: "Total count "
          },
          min: 0
        },
        title: {
          text: this.props.title
        },
        legend: {
          enabled: true
        },
        plotOptions: {
          series: {
            turboThreshold: 0,
            cursor: "pointer",
            events: {
              legendItemClick: function(e) {
                e.preventDefault();
              }
            },
            point: {
              events: {
                click: this.displayTableOnLastDrilldown.bind(this)
              }
            }
          },
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },

        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat:
            '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
        },
        series: this.props.yAxis
      }
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { graphType: graphTypePrevProp } = prevProps;
    const { graphType: graphTypeCurrentProp } = this.props;
    const { chartObj: chartObjCurrentState } = this.state;
    const { dashboardGraphName: dashboardGraphName } = this.props;
    if (
      graphTypePrevProp !== graphTypeCurrentProp &&
      chartObjCurrentState !== undefined
    ) {
      let chartType = graphTypeCurrentProp;

      if (graphTypeCurrentProp === "stack") {
        chartType = "column";
        this.state.chartObj.update({
          chart: {
            type: chartType
          },
          plotOptions: {
            column: {
              stacking: "normal",
              grouping: false
            }
          }
        });
      } else {
        this.state.chartObj.update({
          chart: {
            type: chartType
          },
          plotOptions: {
            column: {
              grouping: true,
              stacking: false
            }
          }
        });
      }
    }
  }

  displayTableOnLastDrilldown = data => {
    this.props.displayDataTableFromBar(data.point.dataId , data.point.name);

  };

  addDrilldownSeries = e => {
    const { user } = this.props;
    let userRole = user.roles[0].role;
    this.state.chartObj.showLoading("Loading ...");
    this.setState({
      allowChartUpdate: false
    });

    let year = new Date().getFullYear();
    let startDate = "",
      endDate = "";
    let params = {};

    // this if is used for drill if month and year are same
    if (this.props.parameters.duration_type === "day") {
      if (this.state.xAxisData.length === 1) {
        // let date = e.point.category.split("-");
        // let date_GMT =
        //   date[0].toLocaleString("en-US", {
        //     minimumIntegerDigits: 2,
        //     useGrouping: false,
        //   }) +
        //   "-" +
        //   date[1].toLocaleString("en-US", {
        //     minimumIntegerDigits: 2,
        //     useGrouping: false,
        //   }) +
        //   "-" +
        //   date[2].toLocaleString("en-US", {
        //     minimumIntegerDigits: 2,
        //     useGrouping: false,
        //   });
        let count = this.state.drilldownCount + 1;
        this.setState({
          drilldownCount: count
        });

        if (
          this.props.parameters.start_date &&
          moment(this.props.parameters.start_date).isValid()
        ) {
          startDate = new Date(this.props.parameters.start_date);
        } else {
          startDate = getCurrentStartDate();
        }

        if (
          this.props.parameters.end_date &&
          moment(this.props.parameters.end_date).isValid()
        ) {
          endDate = new Date(this.props.parameters.end_date);
        } else {
          endDate = getCurrentEndDate();
        }

        // startDate = getCurrentDayStartDateWithTimeInUtc(date_GMT);
        // endDate = getCurrentDayEndDateWithTimeInUtc(date_GMT);
      }

      // let location_list = []
      // if(this.props.location_id){
      //   this.props.location_id.map((item, index) => {
      //
      //     location_list.push(item.value);
      //     return null;
      //   });
      // }

      params.start_date = startDate;
      params.end_date = endDate;
      this.props.dashboardGraphName === "Label"
        ? (params.selected_model_labels_list = e.point.name)
        : (params.selected_event_list = e.point.name);
      params.duration_type = "hour";
      params.camera_id = this.props?.parameters?.camera_id;
      params.location_id = this.props.locationId;
      // params.selected_model_labels_list = this.props.selected_model_labels_list;
      if (this.state.xAxisData && this.state.xAxisData.length !== 2) {
        getFilterGraphData(params, userRole, this.props.dashboardGraphName)
          .then(response => {
            if (response.data.length > 0) {
              let obj = response.data;
              let labels = [];
              let labelObj = obj[0];
              // eslint-disable-next-line
              Object.entries(labelObj).map(([key, value]) => {
                labels.push(key);
              });
              if (params.duration_type === "hour") {
                let local_time_arr = [];
                let sortObj = obj;
                obj.map((item, index) => {
                  sortObj[index]["_id"] = this.convertDateFromUTCToLocal(
                    item._id
                  );
                  local_time_arr.push(sortObj[index]["_id"]);
                  return null;
                });
                // sortObj.sort((a, b) => this.convertDateObj(a._id) - this.convertDateObj(b._id));
                // sortObj.sort((a, b) => this.convertDateObj(a._id) - this.convertDateObj(b._id));
                local_time_arr.sort(function(a, b) {
                  return (
                    new Date("1970/01/01 " + a) - new Date("1970/01/01 " + b)
                  );
                });
                sortObj.sort(
                  (a, b) =>
                    new Date("1970/01/01 " + a._id) -
                    new Date("1970/01/01 " + b._id)
                );
                obj = sortObj;
              }
              const index = labels.indexOf("_id");
              if (index > -1) {
                labels.splice(index, 1);
              }
              const index2 = labels.indexOf("id");
              if (index2 > -1) {
                labels.splice(index2, 1);
              }
              let series = [];
              for (let j = 0; j < labels.length; j++) {
                let datalabel = labels[j];
                series.push({ name: datalabel, data: [] });
              }
              let xAxis = [];
              for (let y = 0; y < obj.length; y++) {
                let graphObj = obj[y];
                // let convertedTime = this.convertDateFromUTCToLocal(graphObj._id);
                xAxis.push(graphObj._id);
              }
              for (let i = 0; i < labels.length; i++) {
                for (let p = 0; p < obj.length; p++) {
                  let obj1 = obj[p];
                  let data = obj1[labels[i]];
                  for (let s in series) {
                    if (labels[i] === series[s].name) {
                      series[s].data.push({
                        name: labels[i],
                        y: data,
                        drilldown: false,
                        dataId: obj1.id
                      });
                    }
                  }
                }
              }

              let xAxisData = this.state.xAxisData;
              xAxisData.push(xAxis);
              let yAxisData = this.state.yAxisData;
              yAxisData.push(series);
              this.setState(
                {
                  xAxisData: xAxisData,
                  yAxisData: yAxisData
                },
                () => {}
              );
              let max = 4;
              if (xAxis.length > 20) {
                max = 5;
              } else {
                max = xAxis.length - 1;
              }
              this.props.setXAxisYAxisAfterDrilldown(xAxis, series[0], true);
              this.state.chartObj.addSeriesAsDrilldown(e.point, series[0]);
              this.state.chartObj.xAxis[0].update({
                categories: xAxis,
                max: max
              });

              this.state.chartObj.hideLoading();
            } else {
              this.state.chartObj.hideLoading();
              warningToast("No Data Found");
              this.setState({
                graphMessage: "No Data Found"
              });
            }
          })
          .catch(error => {
            this.state.chartObj.hideLoading();
            if (error.detail) {
              warningToast(error.detail);
            } else {
              warningToast("Something went Wrong");
            }
          });
      }
    } // code to drilldown different months
    else {
      //on different months filter all days are coming yyyy-mm-dd
      if (this.state.xAxisData.length === 1) {
        //from filter apply month drill down
        let start_date;
        let end_date;
        if (this.props.parameters.selected_model_labels_list) {
          if (
            this.props.parameters.start_date &&
            moment(this.props.parameters.start_date).isValid()
          ) {
            let splitDate = e.point.category.split("-");
            let splitDateStartDateTime = this.props.parameters.start_date.split(
              "T"
            );
            let splitDateStartMonth = splitDateStartDateTime[0].split("-");

            if (Number(splitDateStartMonth[1]) === valueOfMonth[splitDate[0]]) {
              start_date = new Date(this.props.parameters.start_date);
            } else {
              let splitDate = e.point.category.split("-");
              let startTimeStemp1 = moment(
                new Date(splitDate.join("-"))
              ).subtract(1, "days");
              let startDateNew1 = startTimeStemp1.format("YYYY-MM-DD");
              start_date = startDateNew1 + "T18:30:00.000Z";
            }
          } else {
            let splitDate = e.point.category.split("-");
            let startTimeStemp1 = moment(
              new Date(splitDate.join("-"))
            ).subtract(1, "days");
            let startDateNew1 = startTimeStemp1.format("YYYY-MM-DD");
            start_date = startDateNew1 + "T18:30:00.000Z";
            // start_date = getCurrentStartDate();
          }

          if (
            this.props.parameters.end_date &&
            moment(this.props.parameters.end_date).isValid()
          ) {
            let splitDate = e.point.category.split("-");
            let splitDateEndDateTime = this.props.parameters.end_date.split(
              "T"
            );
            let splitDateEndMonth = splitDateEndDateTime[0].split("-");
            if (Number(splitDateEndMonth[1]) === valueOfMonth[splitDate[0]]) {
              end_date = new Date(this.props.parameters.end_date);
            } else {
              let splitDate = e.point.category.split("-");
              let year = splitDate[1];
              let monthValue = valueOfMonth[splitDate[0]];
              let endDateNew = new Date(year, monthValue, 0);
              end_date =
                moment(new Date(endDateNew)).format("YYYY-MM-DD") +
                "T18:29:59.000Z";
            }
          } else {
            let splitDate = e.point.category.split("-");
            let year = splitDate[1];
            let monthValue = valueOfMonth[splitDate[0]];
            let endDateNew = new Date(year, monthValue, 0);
            end_date =
              moment(new Date(endDateNew)).format("YYYY-MM-DD") +
              "T18:29:59.000Z";
            // end_date = getCurrentEndDate();
          }

          // if (
          //   Number(this.props.parameters.start_date.split("-")[0]) ===
          //     Number(year) &&
          //   Number(this.props.parameters.start_date.split("-")[1]) ===
          //     Number(monthValue)
          // ) {
          //   start_date = this.props.parameters.start_date;
          // } else {
          //   start_date = year + "-" + monthValue + "-" + 1 + "T00:00:00.000Z";
          // }
          // if (
          //   Number(this.props.parameters.end_date.split("-")[0]) ===
          //     Number(year) &&
          //   Number(this.props.parameters.end_date.split("-")[1]) ===
          //     Number(monthValue)
          // ) {
          //   end_date = this.props.parameters.end_date;
          // } else {
          //   end_date = new Date(year, monthValue, 0);
          //   let timestamp =
          //     end_date.getTime() - end_date.getTimezoneOffset() * 60000;
          //   let correctDate = new Date(timestamp);
          //   correctDate.setUTCHours(23, 59, 59, 59); // uncomment this if you want to remove the time
          //   end_date = correctDate.toISOString();
          // }
          this.props.dashboardGraphName === "Label"
            ? (params.selected_model_labels_list = e.point.name)
            : (params.selected_event_list = e.point.name);
          let count = this.state.drilldownCount + 1;
          this.setState({
            drilldownCount: count
          });
          startDate = start_date;
          endDate = end_date;
          params.duration_type = "day";
        } else {
          //from loadAll data month drill down
          // let splitDate = e.point.category.split("-");
          // year = splitDate[1];
          // let monthValue = valueOfMonth[splitDate[0]];
          // let start_date = year + "-" + monthValue + "-" + 1 + "T00:00:00.000Z";
          // let end_date = new Date(year, monthValue, 0);
          // let timestamp =
          //   end_date.getTime() - end_date.getTimezoneOffset() * 60000;
          // let correctDate = new Date(timestamp);
          // correctDate.setUTCHours(23, 59, 59, 59); // uncomment this if you want to remove the time
          let start_date;
          let correctDate;
          if (
            this.props.parameters.start_date &&
            moment(this.props.parameters.start_date).isValid()
          ) {
            let splitDate = e.point.category.split("-");
            let splitDateStartDateTime = this.props.parameters.start_date.split(
              "T"
            );
            let splitDateStartMonth = splitDateStartDateTime[0].split("-");
            if (Number(splitDateStartMonth[1]) === valueOfMonth[splitDate[0]]) {
              start_date = new Date(this.props.parameters.start_date);
            } else {
              let splitDate = e.point.category.split("-");
              let startTimeStemp1 = moment(
                new Date(splitDate.join("-"))
              ).subtract(1, "days");
              let startDateNew1 = startTimeStemp1.format("YYYY-MM-DD");
              start_date = startDateNew1 + "T18:30:00.000Z";
            }
          } else {
            let splitDate = e.point.category.split("-");
            let startTimeStemp1 = moment(
              new Date(splitDate.join("-"))
            ).subtract(1, "days");
            let startDateNew1 = startTimeStemp1.format("YYYY-MM-DD");
            start_date = startDateNew1 + "T18:30:00.000Z";
            // start_date = getCurrentStartDate();
          }

          if (
            this.props.parameters.end_date &&
            moment(this.props.parameters.end_date).isValid()
          ) {
            let splitDate = e.point.category.split("-");
            let splitDateEndDateTime = this.props.parameters.end_date.split(
              "T"
            );
            let splitDateEndMonth = splitDateEndDateTime[0].split("-");

            if (Number(splitDateEndMonth[1]) === valueOfMonth[splitDate[0]]) {
              correctDate = new Date(this.props.parameters.end_date);
            } else {
              let splitDate = e.point.category.split("-");
              let year = splitDate[1];
              let monthValue = valueOfMonth[splitDate[0]];
              let endDateNew = new Date(year, monthValue, 0);
              correctDate =
                moment(new Date(endDateNew)).format("YYYY-MM-DD") +
                "T18:29:59.000Z";
            }
          } else {
            let splitDate = e.point.category.split("-");
            let year = splitDate[1];
            let monthValue = valueOfMonth[splitDate[0]];
            let endDateNew = new Date(year, monthValue, 0);
            correctDate =
              moment(new Date(endDateNew)).format("YYYY-MM-DD") +
              "T18:29:59.000Z";
            // correctDate = getCurrentEndDate();
          }

          if (!moment(start_date).isValid() && !moment(correctDate).isValid()) {
            let splitDate = e.point.category.split("-");
            let startTimeStemp1 = moment(
              new Date(splitDate.join("-"))
            ).subtract(1, "days");
            let startDateNew1 = startTimeStemp1.format("YYYY-MM-DD");
            year = splitDate[1];
            let monthValue = valueOfMonth[splitDate[0]];
            start_date = startDateNew1 + "T18:30:00.000Z";
            let endDateNew = new Date(year, monthValue, 0);
            correctDate =
              moment(new Date(endDateNew)).format("YYYY-MM-DD") +
              "T18:29:59.000Z";
          }

          this.props.dashboardGraphName === "Label"
            ? (params.selected_model_labels_list = e.point.name)
            : (params.selected_event_list = e.point.name);
          let count = this.state.drilldownCount + 1;
          this.setState({
            drilldownCount: count
          });

          startDate = start_date;
          endDate = correctDate;
          params.duration_type = "day";
        }
      } else if (this.state.xAxisData.length === 2) {
        // let date = e.point.category.split("-");
        // let date_GMT =
        //   date[0].toLocaleString("en-US", {
        //     minimumIntegerDigits: 2,
        //     useGrouping: false,
        //   }) +
        //   "-" +
        //   date[1].toLocaleString("en-US", {
        //     minimumIntegerDigits: 2,
        //     useGrouping: false,
        //   }) +
        //   "-" +
        //   date[2].toLocaleString("en-US", {
        //     minimumIntegerDigits: 2,
        //     useGrouping: false,
        //   });
        // let count = this.state.drilldownCount + 1;
        // this.setState({
        //   drilldownCount: count,
        // });
        // startDate = getAnyDayStartDateWithTimeInUtc(date_GMT);
        // endDate = getAnyDayEndDateWithTimeInUtc(date_GMT);
        // params.duration_type = "hour";

        let start_date;
        let end_date;
        if (this.props.parameters.selected_model_labels_list) {
          let splitDate = e.point.category.split("-");

          let startTimeStemp = moment(new Date(splitDate.join("-"))).subtract(
            1,
            "days"
          );
          let endTimeStemp = moment(new Date(splitDate.join("-")));

          let startDateNew = startTimeStemp.format("YYYY-MM-DD");
          let endDateNew = endTimeStemp.format("YYYY-MM-DD");

          let splitDateStartDate = this.props.parameters.start_date.split("T");
          if (splitDateStartDate[0] === endDateNew) {
            start_date = new Date(this.props.parameters.start_date);
          } else {
            start_date = startDateNew + "T18:30:00.000Z";
          }

          let splitDateEndDate = this.props.parameters.end_date.split("T");
          if (splitDateEndDate[0] === endDateNew) {
            end_date = new Date(this.props.parameters.end_date);
          } else {
            end_date = endDateNew + "T18:29:59.000Z";
          }

          // if(!moment(start_date).isValid() && !moment(end_date).isValid()){
          //
          //   let splitDate = e.point.category.split("-");
          //   year = splitDate[1];
          //   let monthValue = valueOfMonth[splitDate[0]];
          //   start_date = year + "-" + monthValue + "-" + 1 + "T00:00:00.000Z";
          //   end_date = new Date(year, monthValue, 0);
          // }

          this.props.dashboardGraphName === "Label"
            ? (params.selected_model_labels_list = e.point.name)
            : (params.selected_event_list = e.point.name);
          let count = this.state.drilldownCount + 1;
          this.setState({
            drilldownCount: count
          });
          startDate = start_date;
          endDate = end_date;
          params.duration_type = "hour";
        } else {
          //from loadAll data month drill down
          // let splitDate = e.point.category.split("-");
          // year = splitDate[1];
          // let monthValue = valueOfMonth[splitDate[0]];
          // let start_date = year + "-" + monthValue + "-" + 1 + "T00:00:00.000Z";
          // let end_date = new Date(year, monthValue, 0);
          // let timestamp =
          //     end_date.getTime() - end_date.getTimezoneOffset() * 60000;
          // let correctDate = new Date(timestamp);
          // correctDate.setUTCHours(23, 59, 59, 59); // uncomment this if you want to remove the time
          // this.props.dashboardGraphName === "Label"
          //     ? (params.selected_model_labels_list = e.point.name)
          //     : (params.selected_event_list = e.point.name);
          // let count = this.state.drilldownCount + 1;
          // this.setState({
          //   drilldownCount: count,
          // });

          // let date = e.point.category.split("-");
          //   let date_GMT =
          //     date[0].toLocaleString("en-US", {
          //       minimumIntegerDigits: 2,
          //       useGrouping: false,
          //     }) +
          //     "-" +
          //     date[1].toLocaleString("en-US", {
          //       minimumIntegerDigits: 2,
          //       useGrouping: false,
          //     }) +
          //     "-" +
          //     date[2].toLocaleString("en-US", {
          //       minimumIntegerDigits: 2,
          //       useGrouping: false,
          //     });
          //
          //
          //
          //   let count = this.state.drilldownCount + 1;
          //   this.setState({
          //     drilldownCount: count,
          //   });
          //   startDate = getAnyDayStartDateWithTimeInUtc(date_GMT);
          //   endDate = getAnyDayEndDateWithTimeInUtc(date_GMT);
          //   params.duration_type = "hour";
          let start_date;
          let end_date;
          if (
            this.props.parameters.start_date &&
            moment(this.props.parameters.start_date).isValid()
          ) {
            // start_date = new Date(this.props.parameters.start_date);

            let splitDate = e.point.category.split("-");
            let splitDateStartDateTime = this.props.parameters.start_date.split(
              "T"
            );
            let splitDateStartMonth = splitDateStartDateTime[0].split("-");

            if (Number(splitDateStartMonth[1]) === valueOfMonth[splitDate[0]]) {
              start_date = new Date(this.props.parameters.start_date);
            } else {
              let splitDate = e.point.category.split("-");
              let startTimeStemp1 = moment(
                new Date(splitDate.join("-"))
              ).subtract(1, "days");
              let startDateNew1 = startTimeStemp1.format("YYYY-MM-DD");
              start_date = startDateNew1 + "T18:30:00.000Z";
            }
          } else {
            let splitDate = e.point.category.split("-");
            let startTimeStemp1 = moment(
              new Date(splitDate.join("-"))
            ).subtract(1, "days");
            let startDateNew1 = startTimeStemp1.format("YYYY-MM-DD");
            start_date = startDateNew1 + "T18:30:00.000Z";
            // start_date = getCurrentStartDate();
          }

          if (
            this.props.parameters.end_date &&
            moment(this.props.parameters.end_date).isValid()
          ) {
            let splitDate = e.point.category.split("-");
            let splitDateEndDateTime = this.props.parameters.end_date.split(
              "T"
            );
            let splitDateEndMonth = splitDateEndDateTime[0].split("-");

            if (Number(splitDateEndMonth[1]) === valueOfMonth[splitDate[0]]) {
              end_date = new Date(this.props.parameters.end_date);
            } else {
              let splitDate = e.point.category.split("-");
              let endTimeStemp1 = moment(new Date(splitDate.join("-")));
              let endDateNew1 = endTimeStemp1.format("YYYY-MM-DD");
              end_date = endDateNew1 + "T18:29:59.000Z";
            }
          } else {
            let splitDate = e.point.category.split("-");
            let endTimeStemp1 = moment(new Date(splitDate.join("-")));
            let endDateNew1 = endTimeStemp1.format("YYYY-MM-DD");
            end_date = endDateNew1 + "T18:29:59.000Z";
            // end_date = getCurrentEndDate();
          }

          if (!moment(start_date).isValid() && !moment(end_date).isValid()) {
            let splitDate = e.point.category.split("-");
            // let year = splitDate[0];
            // let monthValue;
            // let startNewDate;
            // if(splitDate[2] === '01'){
            //
            //    monthValue = splitDate[1]-1;
            //    startNewDate = splitDate[2]-1;
            //
            // }
            // else{
            //    monthValue = splitDate[1];
            //  let  startNewDate1 = splitDate[2]-1;
            let startTimeStemp = moment(new Date(splitDate.join("-"))).subtract(
              1,
              "days"
            );
            let endTimeStemp = moment(new Date(splitDate.join("-")));
            let startDateNew = startTimeStemp.format("YYYY-MM-DD");
            let endDateNew = endTimeStemp.format("YYYY-MM-DD");
            start_date = startDateNew + "T18:30:00.000Z";
            end_date = endDateNew + "T18:29:59.000Z";
          }
          this.props.dashboardGraphName === "Label"
            ? (params.selected_model_labels_list = e.point.name)
            : (params.selected_event_list = e.point.name);
          let count = this.state.drilldownCount + 1;
          this.setState({
            drilldownCount: count
          });
          startDate = start_date;
          endDate = end_date;
          params.duration_type = "hour";
        }
      }

      // let location_list = []
      // if(this.props.location_id){
      //   this.props.location_id.map((item, index) => {
      //
      //     location_list.push(item.value);
      //     return null;
      //   });
      // }

      params.start_date = startDate;
      params.end_date = endDate;
      params.camera_id = this.props.cameraId;
      params.location_id = this.props.locationId;
      params.selected_model_labels_list = this.props.selected_model_labels_list;
      this.props.dashboardGraphName === "Label"
        ? (params.selected_model_labels_list = e.point.name)
        : (params.selected_event_list = e.point.name);
      if (this.state.xAxisData && this.state.xAxisData.length !== 3) {
        getFilterGraphData(params, userRole, this.props.dashboardGraphName)
          .then(response => {
            if (response.data.length > 0) {
              let obj = response.data;
              let local_time_arr = [];
              if (params.duration_type === "hour") {
                let sortObj = obj;
                obj.map((item, index) => {
                  sortObj[index]["_id"] = this.convertDateFromUTCToLocal(
                    item._id
                  );
                  local_time_arr.push(sortObj[index]["_id"]);
                  return null;
                });
                // sortObj.sort((a, b) => this.convertDateObj(a._id) - this.convertDateObj(b._id));
                // sortObj.sort((a, b) => this.convertDateObj(a._id) - this.convertDateObj(b._id));
                local_time_arr.sort(function(a, b) {
                  return (
                    new Date("1970/01/01 " + a) - new Date("1970/01/01 " + b)
                  );
                });
                sortObj.sort(
                  (a, b) =>
                    new Date("1970/01/01 " + a._id) -
                    new Date("1970/01/01 " + b._id)
                );
                obj = sortObj;
              }

              let labels = [];
              let labelObj = obj[0];
              // eslint-disable-next-line
              Object.entries(labelObj).map(([key, value]) => {
                labels.push(key);
              });
              const index = labels.indexOf("_id");
              if (index > -1) {
                labels.splice(index, 1);
              }
              if (params.duration_type === "hour") {
                const index2 = labels.indexOf("id");
                if (index2 > -1) {
                  labels.splice(index2, 1);
                }
              }
              let series = [];
              for (let j = 0; j < labels.length; j++) {
                let datalabel = labels[j];
                series.push({ name: datalabel, data: [] });
              }
              let xAxis = [];
              for (let y = 0; y < obj.length; y++) {
                let graphObj = obj[y];
                if (params.duration_type === "hour") {
                  let convertedTime = this.convertDateFromUTCToLocal(
                    graphObj._id
                  );
                  let sortObj = convertedTime;
                  convertedTime = sortObj;
                  xAxis.push(graphObj._id);
                } else {
                  xAxis.push(graphObj._id);
                }
              }
              for (let i = 0; i < labels.length; i++) {
                for (let p = 0; p < obj.length; p++) {
                  let obj1 = obj[p];
                  let data = obj1[labels[i]];
                  for (let s in series) {
                    if (params.duration_type === "hour") {
                      if (labels[i] === series[s].name) {
                        series[s].data.push({
                          name: labels[i],
                          y: data,
                          drilldown: false,
                          dataId: obj1.id
                        });
                      }
                    } else if (params.duration_type === "day") {
                      if (labels[i] === series[s].name) {
                        series[s].data.push({
                          name: labels[i],
                          y: data,
                          drilldown: true
                        });
                      }
                    }
                  }
                }
              }

              let xAxisData = this.state.xAxisData;
              xAxisData.push(xAxis);
              let yAxisData = this.state.yAxisData;
              yAxisData.push(series);
              this.setState(
                {
                  xAxisData: xAxisData,
                  yAxisData: yAxisData
                },
                () => {}
              );
              let max = 4;
              if (xAxis.length > 20) {
                max = 5;
              } else {
                max = xAxis.length - 1;
              }
              this.props.setXAxisYAxisAfterDrilldown(xAxis, series[0], true);
              this.state.chartObj.addSeriesAsDrilldown(e.point, series[0]);
              this.state.chartObj.xAxis[0].update({
                categories: xAxis,
                max: max
              });

              this.state.chartObj.hideLoading();
            } else {
              this.state.chartObj.hideLoading();
              warningToast("No Data Found");
              this.setState({
                graphMessage: "No Data Found"
              });
            }
          })
          .catch(error => {
            this.state.chartObj.hideLoading();
            if (error.detail) {
              warningToast(error.detail);
            } else {
              warningToast("Something went Wrong");
            }
          });
      }
    } // end of if - else statement
  };

  convertDateObj = hhmmss => {
    let obj = new Date(); //creates a Date Object using the clients current time
    let [hours, minutes, seconds] = hhmmss.split(":");
    obj.setHours(+hours); // set the hours, using implicit type coercion
    obj.setMinutes(minutes); //you can pass Number or String, it doesn't really matter
    obj.setSeconds(seconds);
    return obj;
  };

  convertDateFromUTCToLocal = utcTime => {
    // let utcText = moment(utcTime,'HH:mm').format("HH:mm");

    let local = moment
      .utc(utcTime, "HH:mm:ss")
      .local()
      .format("hh:mm:ss a");
    return local; //setting local time
  };

  addDrillUpSeries = e => {
    this.props.displayDataTableFromBar(null);
    let count = this.state.drilldownCount - 1;
    this.setState({
      drilldownCount: count
    });
    let xAxis = this.state.xAxisData;

    let yAxis = this.state.yAxisData;

    this.state.chartObj.xAxis[0].update({
      categories: xAxis[count]
    });
    xAxis.splice(count + 1, 1);
    yAxis.splice(count + 1, 1);

    let drilldown = true;
    if (count === 0) {
      drilldown = false;
    }
    this.props.setXAxisYAxisAfterDrilldown(
      xAxis[count],
      yAxis[count],
      drilldown
    );
    let max = 4;
    if (xAxis[count]?.length > 20) {
      max = 5;
    } else {
      max = xAxis[count]?.length - 1;
    }

    this.state.chartObj.xAxis[0].update({
      max: max
    });

    this.setState({
      xAxisData: xAxis,
      yAxisData: yAxis
    });
  };

  chartCallback = e => {
    this.setState({
      chartObj: e
    });
    Highcharts.Tick.prototype.drillable = function() {};
  };

  render() {
    return (
      <Fragment>
        <Row>
          <Col xl={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={this.state.options}
              callback={this.chartCallback}
              allowChartUpdate={this.state.allowChartUpdate}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { auth } = state;
  return { user: auth.user };
}

export default connect(mapStateToProps, auth.actions)(DashboardGraph);
