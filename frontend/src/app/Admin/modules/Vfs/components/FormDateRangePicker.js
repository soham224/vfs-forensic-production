import React from "react";
import moment from "moment";
import _ from "lodash";
import { connect } from "react-redux";
import DateTimeRangeContainer from "tusk-react-advanced-datetimerange-picker";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { InputAdornment, TextField } from "@mui/material";

class FormDateRangePicker extends React.Component {
  constructor(props) {
    super(props);
    let now = new Date();
    let start = moment(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    );
    let end = moment(start)
      .add(1, "days")
      .subtract(1, "seconds");
    let selectedStartDate = moment(new Date(this.props.startDate));
    let selectedEndDate = moment(new Date(this.props.endDate));

    if (selectedStartDate && selectedEndDate) {
      start = selectedStartDate;
      end = selectedEndDate;
    }

    let min = moment(new Date(this.props.minDate));
    let max = moment(new Date(this.props.maxDate));
    this.state = {
      start: start,
      end: end,
      min: min,
      max: max,
      rangeIndex: props.rangeIndex
    };
    this.applyCallback = this.applyCallback.bind(this);
  }

  getLastYearDate = isCurrentYear => {
    let startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);
    if (!isCurrentYear) {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    let endDate = new Date();
    endDate.setMonth(11);
    endDate.setDate(31);
    if (!isCurrentYear) {
      endDate.setFullYear(endDate.getFullYear() - 1);
    }
    let momentArray = [];
    momentArray.push(moment(startDate));
    momentArray.push(moment(endDate));
    return momentArray;
  };

  getLast12Month = () => {
    let endDate = new Date();
    let startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    let momentArray = [];
    momentArray.push(moment(startDate));
    momentArray.push(moment(endDate));
    return momentArray;
  };

  getLastQuaterDates = isCurrentQuarter => {
    let now = new Date();
    let quarter = Math.floor(now.getMonth() / 3);
    if (quarter !== 0 && !isCurrentQuarter) {
      quarter = quarter - 1;
    } else {
      // Request is for CurrentQuarter
    }
    let quarterFirstDate = new Date(now.getFullYear(), quarter * 3, 1);
    if (!isCurrentQuarter && quarter === 0) {
      //Last Quarter
      quarterFirstDate = new Date(now.getFullYear() - 1, 3 * 3, 1);
    } else {
      quarterFirstDate = new Date(now.getFullYear(), quarter * 3, 1);
    }
    let quarterEndDate = new Date(
      quarterFirstDate.getFullYear(),
      quarterFirstDate.getMonth() + 3,
      0
    );

    let momentArray = [];
    momentArray.push(moment(quarterFirstDate));
    momentArray.push(moment(quarterEndDate));
    return momentArray;
  };

  applyCallback(startDate, endDate) {
    this.setState({
      start: startDate,
      end: endDate
    });
    this.props.changeDateTimeRange(startDate, endDate);
  }

  rangeCallback = (index, value) => {
    this.props.changeDateTimeRangeIndex(index, value);
  };

  onClick() {
    let newStart = moment(this.state.start).subtract(3, "days");
    this.setState({ start: newStart });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (
      nextProps.rangeIndex !== null &&
      nextProps.rangeIndex !== undefined &&
      nextProps.rangeIndex > -1
    ) {
      this.setState({
        rangeIndex: nextProps.rangeIndex,
        min: moment(new Date(nextProps.minDate)),
        max: moment(new Date(nextProps.maxDate)),
        start: moment(new Date(nextProps.startDate)),
        end: moment(new Date(nextProps.endDate))
      });
    }
  }

  // render() {
  //   let now = new Date();
  //   //let now1 = new Date();
  //   let start = moment(
  //     new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  //   );
  //   let end = moment(start)
  //     .add(1, "days")
  //     .subtract(1, "seconds");
  //   let currentYearDate = this.getLastYearDate(true);
  //   let lastQuaterDate = this.getLastQuaterDates(false);
  //   let currentQuaterDate = this.getLastQuaterDates(true);
  //   let local = {
  //     format: "DD-MM-YYYY h:mm:ss a",
  //     sundayFirst: false
  //   };
  //   // let last12Month = this.getLast12Month();
  //
  //   let range = {
  //     Today: [moment(start), moment(end)],
  //     Yesterday: [
  //       moment(start).subtract(1, "days"),
  //       moment(end).subtract(1, "days")
  //     ],
  //     "Current Month": [
  //       moment(start).startOf("month"),
  //       moment(end).endOf("month")
  //     ],
  //     "Current Quarter": [currentQuaterDate[0], currentQuaterDate[1]],
  //     "Current Year": [currentYearDate[0], currentYearDate[1]],
  //     "Last 7 Days": [moment(start).subtract(6, "days"), moment(end)],
  //     "Last 30 Days": [moment(start).subtract(29, "days"), moment(end)],
  //
  //     "Last Month": [
  //       moment(start)
  //         .subtract(1, "month")
  //         .startOf("month"),
  //       moment(end)
  //         .subtract(1, "month")
  //         .endOf("month")
  //     ],
  //     "Last Quarter": [lastQuaterDate[0], lastQuaterDate[1]],
  //   };
  //
  //   let selectedRangeIndex = this.state.rangeIndex;
  //
  //   if (this.state.rangeIndex > -1 && this.state.rangeIndex < 13) {
  //     let selectedRangeKey = _.keys(range)[selectedRangeIndex];
  //     let selectedRangeValue = range[selectedRangeKey];
  //     if (selectedRangeValue) {
  //       start = selectedRangeValue[0];
  //       end = selectedRangeValue[1];
  //     }
  //   }
  //   if (this.state.rangeIndex && this.state.rangeIndex === 13) {
  //     start = this.state.start;
  //     end = this.state.end;
  //   }
  //   let value =
  //     moment(this.state.start).format("DD-MM-YYYY h:mm:ss a") +
  //     " - " +
  //     moment(this.state.end).format("DD-MM-YYYY h:mm:ss a");
  //   // const { startDate, endDate } = this.props;
  //   // let startFormatedDate = moment.utc(startDate).toDate();
  //   // let endFormatedDate = moment.utc(endDate).toDate();
  //
  //
  //   // let maxDate = moment(start)
  //   return (
  //       <DateTimeRangeContainer
  //           ranges={range}
  //           start={selectedRange.start}
  //           end={selectedRange.end}
  //           // start={start}
  //           // end={end}
  //           mode="portrait"
  //           // local={local}
  //           local={{ format: "DD-MM-YYYY h:mm:ss a", sundayFirst: false }}
  //           // maxDate={maxDate}
  //           applyCallback={this.applyCallback}
  //           rangeCallback={this.rangeCallback}
  //           noMobileMode={true}
  //           modalView
  //           smartMode
  //           centerMode
  //           style={{
  //             customRangeButtons: {
  //               color: "#147b82"
  //             },
  //             customRangeSelected: {
  //               backgroundColor: "#147b82",
  //               outline: "none"
  //             },
  //             fromDate: {
  //               backgroundColor: "#147b82",
  //               outline: "none"
  //             },
  //             toDate: {
  //               backgroundColor: "#147b82",
  //               outline: "none"
  //             },
  //             hoverCell: {
  //               backgroundColor: "#147b82",
  //               color: "#fff"
  //             }
  //           }}
  //       >
  //         <TextField
  //             className="form-control-customer cursor-pointer"
  //             disabled
  //             value={value}
  //             sx={{ width: "100%" }}
  //             InputProps={{
  //               startAdornment: (
  //                   <InputAdornment position="start">
  //                     <CalendarTodayOutlinedIcon />
  //                   </InputAdornment>
  //               )
  //             }}
  //
  //         />
  //       </DateTimeRangeContainer>
  //   );
  // }
  render() {
    let now = new Date();
    //let now1 = new Date();
    let start = moment(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    );
    let end = moment(start)
        .add(1, "days")
        .subtract(1, "seconds");

    let range = {
      Today: [moment(start), moment(end)],
      Yesterday: [moment(start).subtract(1, "days"), moment(end).subtract(1, "days")],
      "Current Month": [moment(start).startOf("month"), moment(end).endOf("month")],
      "Current Quarter": this.getLastQuaterDates(true),
      "Current Year": this.getLastYearDate(true),
      "Last 7 Days": [moment(start).subtract(6, "days"), moment(end)],
      "Last 30 Days": [moment(start).subtract(29, "days"), moment(end)],
      "Last Month": [moment(start).subtract(1, "month").startOf("month"), moment(end).subtract(1, "month").endOf("month")],
      "Last Quarter": this.getLastQuaterDates(false),

    };

    let selectedRangeIndex = this.state.rangeIndex;
    let selectedRange = { start: this.state.start, end: this.state.end };


    if (selectedRangeIndex > -1 && selectedRangeIndex < Object.keys(range).length) {
      const selectedRangeKey = _.keys(range)[selectedRangeIndex];
      const selectedRangeValue = range[selectedRangeKey];
      if (selectedRangeValue) {
        selectedRange = { start: selectedRangeValue[0], end: selectedRangeValue[1] };
      }
    }

    const value = `${moment(selectedRange.start).format("DD-MM-YYYY h:mm:ss a")} - ${moment(selectedRange.end).format("DD-MM-YYYY h:mm:ss a")}`;

    return (
        <DateTimeRangeContainer
            ranges={range}
            start={selectedRange.start}
            end={selectedRange.end}
            // start={start}
            // end={end}
            mode="portrait"
            // local={local}
            local={{ format: "DD-MM-YYYY h:mm:ss a", sundayFirst: false }}
            // maxDate={maxDate}
            applyCallback={this.applyCallback}
            rangeCallback={this.rangeCallback}
            noMobileMode={true}
            modalView
            smartMode
            centerMode
            style={{
              customRangeButtons: {
                color: "#147b82"
              },
              customRangeSelected: {
                backgroundColor: "#147b82",
                outline: "none"
              },
              fromDate: {
                backgroundColor: "#147b82",
                outline: "none"
              },
              toDate: {
                backgroundColor: "#147b82",
                outline: "none"
              },
              hoverCell: {
                backgroundColor: "#147b82",
                color: "#fff"
              }
            }}
        >
          <TextField
              className="form-control-customer cursor-pointer"
              disabled
              value={value}
              sx={{ width: "100%" }}
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayOutlinedIcon />
                    </InputAdornment>
                )
              }}

          />
        </DateTimeRangeContainer>

    );
  }
}

const mapStateToProp = state => ({
  // brandColor: state.CustomTheme.brandColor,
  // brandDarkColor: state.CustomTheme.brandDarkColor,
});

export default connect(mapStateToProp)(FormDateRangePicker);
