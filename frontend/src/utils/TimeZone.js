const moment = require("moment-timezone");

export const getCurrentUserTimeZone = () => {
  return moment.tz.guess();
};

export const getGmtOffset = () => {
  var offset = new Date().getTimezoneOffset(),
    o = Math.abs(offset);
  return (
    (offset < 0 ? "+" : "-") +
    ("00" + Math.floor(o / 60)).slice(-2) +
    ":" +
    ("00" + (o % 60)).slice(-2)
  );
};

export const getCurrentDateAndTimeInUtc = () => {
  var start = moment.utc(getCurrentDateAndTimeInLocal()).format();
  return start;
};

export const getCurrentDateAndTimeInLocal = () => {
  var date = new Date();
  return date;
};

export const getCurrentDateAndTimeInIsoFormat = () => {
  return new Date().toISOString();
};

export const getCurrentDayStartDateWithTimeInUtc = () => {
  var start = moment
    .tz(moment.tz.guess())
    .startOf("day")
    .utc();
  return start.toISOString();
};

export const getCurrentDayEndDateWithTimeInUtc = () => {
  var end = moment
    .tz(moment.tz.guess())
    .endOf("day")
    .utc();
  return end.toISOString();
};

export const getAnyDayStartDateWithTimeInUtc = date => {
  var m = moment.tz(date, "YYYY-MM-DD", getCurrentUserTimeZone());
  var start = m
    .clone()
    .startOf("day")
    .utc();
  return start.toISOString();
};

export const getAnyDayEndDateWithTimeInUtc = date => {
  var m = moment.tz(date, "YYYY-MM-DD", getCurrentUserTimeZone());
  var end = m
    .clone()
    .endOf("day")
    .utc();
  return end.toISOString();
};

export const getUtcDateAndTimeFromCalendar = date_GMT => {
  let end_dateObj = new Date(date_GMT);
  // let end_dateISOObj = end_dateObj.toISOString();
  // let finale_end_date =
  //   end_dateISOObj.split("T")[0] + "T" + date_GMT.split(" ")[1] + ":00.000Z";
  // let utcEnd = new moment(finale_end_date, "YYYY-MM-DDTHH:mm").utc().format();
  let utcEnd = new moment(end_dateObj, "YYYY-MM-DDTHH:mm").utc().format();

  return utcEnd;
};

export const getIsoObjInZeroFormat = () => {
  let end_date = new Date();
  var timestamp = end_date.getTime() - end_date.getTimezoneOffset() * 60000;
  var correctDate = new Date(timestamp);
  correctDate.setUTCHours(0, 0, 0, 0); // uncomment this if you want to remove the time
  end_date = correctDate.toISOString();
  return end_date;
};

export const getCurrentStartDate = () => {
  const now = new Date();
  return moment(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  );
};

export const getCurrentEndDate = () => {
  // const now = new Date();
  return moment(getCurrentStartDate())
    .add(1, "days")
    .subtract(1, "seconds");
};
