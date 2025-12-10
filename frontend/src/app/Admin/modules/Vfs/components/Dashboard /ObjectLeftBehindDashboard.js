import React, {useEffect, useState} from 'react';
import FormDateRangePicker from "../FormDateRangePicker";
import moment from "moment";
import {getCurrentEndDate, getCurrentStartDate} from "../../../../../../utils/TimeZone";
import getSelectedDateTimeDefaultValue from "../../../../../../utils/dateRangePicker/dateFunctions";
import getSelectedDateTimeDefaultValueForRange from "../../../../../../utils/dateRangePicker/dateRangeFunctions";
import {getResult, getResultById} from "../../_redux/VFSAPI";
import App from "./Chart/drillDown";
import {Grid} from "@mui/material";

function ObjectLeftBehindDashboard(props) {
    const [startDate, setStartDate] = useState(moment.utc(getCurrentStartDate()).format());
    const [endDate, setEndDate] = useState(moment.utc(getCurrentEndDate()).format());
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(12);
    const [isObjectLoading, setIsObjectLoading] = useState(false);
    const [objectDataResponse, setObjectDataResponse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    const dateTimeRangeChangeHandler = (startDate, endDate) => {
        setStartDate(moment.utc(startDate).format());
        setEndDate(moment.utc(endDate).format());
    };

    const dateTimeRangeIndexChangeHandler = (rangeIndex, value) => {
        let dateVal = getSelectedDateTimeDefaultValue(value);
        let index = getSelectedDateTimeDefaultValueForRange(parseInt(dateVal, 10));
        let min = startDate;
        let max = endDate;
        let minDateNew = minDate;
        let maxDateNew = maxDate;
        if (parseInt(dateVal) === 12) {
            min = parseInt("defaultMin", 0);
            max = parseInt("defaultMax", 0);

            minDateNew = ["min"];
            maxDateNew = ["max"];
        }

        setSelectedIndex(index);
        setStartDate(min);
        setEndDate(max);
        setMinDate(minDateNew);
        setMaxDate(maxDateNew);
    };

    const handleApplied = () => {
        const resultData = {
            start_date: startDate,
            end_date: endDate,
            label: ["object_left_behind"],
            time_zone: "asia/kolkata",
            duration_type: "day",
            get_id: false
        };
        fetchResults(resultData, setIsObjectLoading, setObjectDataResponse);
    };

    useEffect(() => {
        const crowdResultData = {
            start_date: startDate,
            end_date: endDate,
            label: ["object_left_behind"],
            time_zone: "asia/kolkata",
            duration_type: "day",
            get_id: false,
        };
        fetchResults(crowdResultData, setIsObjectLoading, setObjectDataResponse);
    }, []);

    const fetchResults = (data, setLoader, setResponse) => {
        setLoader(true);
        getResult(data)
            .then((response) => {
                setResponse(response?.data || null);
            })
            .catch((error) => {
                // Log the error for debugging purposes
                console.error("Error in fetchResults:", error);
            })
            .finally(() => {
                // Ensure the loader stops in both success and failure cases
                setLoader(false);
            });
    };

    const onDrilldown = async (e) => {
        const {name} = e?.point; // `name` is used for drilldown ID
        if (name.includes("-")) {

            const newStartDate = moment.utc(name).startOf('day').format();
            const newEndDate = moment.utc(name).endOf('day').format();
            const resultData = {
                start_date: newStartDate,
                end_date: newEndDate,
                label: ["object_left_behind"],
                time_zone: "asia/kolkata",
                duration_type: "second",
                get_id: true,
            };

            const response = await getResult(resultData)


            const drilldownData = response.data.object_left_behind.map(item => ({
                name: item.name,
                y: item.y,
                id: item.id,
                drilldown: item.id, // Add drilldown property conditionally
            }));

            return {
                id: name, // Use `name` from drilldown point as the series ID
                data: drilldownData.map(d => ({
                    name: d.name,  // Category Name
                    y: d.y,        // Value
                    drilldown: d.drilldown // Drilldown ID
                })),

            };
        }else if (name.includes(":")) {
            getResultByIds(e?.point?.drilldown)
        }
    };

    const getResultByIds = (data) => {
        getResultById(data)
            .then((response) => {
                setModalData(response?.data || null);
                setShowModal(true)
            })
            .catch((error) => {
                console.error("Error in fetchResults:", error);
            })
            .finally(() => {
            });
    };



    return (
        <><Grid container spacing={2}>
            <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <FormDateRangePicker
                    rangeIndex={selectedIndex}
                    minDate={minDate}
                    maxDate={maxDate}
                    startDate={startDate}
                    endDate={endDate}
                    changeDateTimeRange={dateTimeRangeChangeHandler}
                    changeDateTimeRangeIndex={dateTimeRangeIndexChangeHandler}
                />
            </Grid>
            <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <div className={''}>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleApplied}
                    >
                        Applied
                    </button>
                </div>
            </Grid>
        </Grid>
            <Grid container spacing={2} mt={2}>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <App
                        title="Abandoned Object"
                        count={''}
                        seriesData={objectDataResponse && objectDataResponse?.object_left_behind ? objectDataResponse?.object_left_behind : []}
                        chartType={"column"}
                        chartLoading={isObjectLoading}
                        noDataMessage={"No data found"}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        chartName={'object_left_behind'}
                        setIsOccupancyLoading={setIsObjectLoading}
                        setOccupancyDataResponse={setObjectDataResponse}
                        onDrilldown={onDrilldown}
                        showModal={showModal}
                        modalData={modalData}
                        setShowModal={setShowModal}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default ObjectLeftBehindDashboard;