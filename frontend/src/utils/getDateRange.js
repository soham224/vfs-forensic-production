import moment from "moment";

export const getDateRange = option => {
  let now = new Date();

  let start = moment(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  );
  let end = moment(start)
      .add(1, "days")
      .subtract(1, "seconds");

  let startDate, endDate;

  switch (option) {
    case "Today":
      // Ensure 'Today' is always in UTC
      startDate = moment().startOf("day").utc().format();
      endDate = moment().endOf("day").utc().format();
      break;
    case "Yesterday":
      startDate = moment(start).subtract(1, "days").utc().format();
      endDate = moment(end).subtract(1, "days").utc().format();
      break;
    case "Last 7 Days":
      startDate = moment(start).subtract(6, "days").utc().format();
      endDate = moment(end).utc().format();
      break;
    case "Last 14 Days":
      startDate = moment(start).subtract(13, "days").utc().format();
      endDate = moment(end).utc().format();
      break;
    case "Current Month":
      startDate = moment(start).startOf("month").utc().format();
      endDate = moment(end).endOf("month").utc().format();
      break;
    case "Last 3 Month":
      startDate = moment(start).subtract(3, "months").utc().format();
      endDate = moment(start).utc().format();
      break;
    case "Last 6 Month":
      startDate = moment(start).subtract(6, "months").utc().format();
      endDate = moment(start).utc().format();
      break;
    default:
      startDate = moment().startOf("day").utc().format();
      endDate = moment().endOf("day").utc().format();
  }

  return { startDate, endDate };
};

export const getDurationType = option => {
  let Duration;
  switch (option) {
    case "Today":
    case "Last 7 Days":
    case "Last 14 Days" :
    case "Yesterday":
      Duration = "day";
      break;
    case "Current Month":
    case "Last 3 Month":
    case "Last 6 Month":
      Duration = "month";
      break;
    default:
      Duration = "day"
  }
  return Duration;
};

const convertToISO = (startDatePart, startTimePart) => {
  const startDateTimeString = `${startDatePart}T${startTimePart}:00`;
  const startDateTime = new Date(startDateTimeString);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

  const startISOString = startDateTime.toISOString();
  const endISOString = endDateTime.toISOString();

  return { startISOString, endISOString };
};

function DateGenerator(input) {
  const inputParts = input.split('-');

  if (inputParts.length === 3 && inputParts[2].length === 2) {
    // Format: YYYY-MM-DD
    const date = moment(input, 'YYYY-MM-DD');
    const startDate = date.clone().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const endDate = date.clone().set({ hour: 23, minute: 59, second: 59, millisecond: 999 });

    return {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      duration_type: "hour"
    };
  }

  if (inputParts.length === 2 && inputParts[1].length === 2) {
    // Format: YYYY-MM
    const year = parseInt(inputParts[0], 10);
    const month = parseInt(inputParts[1], 10); // month is zero-based

    const startDate = moment(`${year}-${month}`).startOf('month');
    const endDate = moment(`${year}-${month}`).endOf('month');

    return {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      duration_type: "day"
    };
  }

  if (inputParts.length === 3 && inputParts[2].includes(':')) {
    // Format: YYYY-MM-DD:HH:mm
    const [datePart, timePart] = input.split(':');
    const { startISOString, endISOString } = convertToISO(datePart, timePart);

    return {
      start_date: startISOString,
      end_date: endISOString,
      duration_type: "second"
    };
  }

  throw new Error("Invalid input format");
}

export default DateGenerator;


export const dataValue  = {
  "Forensic": "Total  Forensics cases",
  "Crowd": "Total Crowd Monitoring",
  "Occupancy":  "Total Occupancy",
  "Abandoned":  "Total Abandoned objects",
}

