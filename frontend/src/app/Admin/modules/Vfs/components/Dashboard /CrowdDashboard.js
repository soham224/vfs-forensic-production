import React, {useEffect, useState} from 'react';
import FormDateRangePicker from "../FormDateRangePicker";
import moment from "moment/moment";
import {getCurrentEndDate, getCurrentStartDate} from "../../../../../../utils/TimeZone";
import getSelectedDateTimeDefaultValue from "../../../../../../utils/dateRangePicker/dateFunctions";
import getSelectedDateTimeDefaultValueForRange from "../../../../../../utils/dateRangePicker/dateRangeFunctions";
import {getResult, getResultById} from "../../_redux/VFSAPI";
import App from "./Chart/drillDown";
import {Grid} from "@mui/material";

function CrowdDashboard(props) {
    const [startDate, setStartDate] = useState(moment.utc(getCurrentStartDate()).format());
    const [endDate, setEndDate] = useState(moment.utc(getCurrentEndDate()).format());
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(12);
    const [isCrowdLoading, setIsCrowdLoading] = useState(false);
    const [crowdDataResponse, setCrowdDataResponse] = useState([]);
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

    useEffect(() => {
        const crowdResultData = {
            start_date: startDate,
            end_date: endDate,
            label: ["crowd_detection"],
            time_zone: "asia/kolkata",
            duration_type: "day",
            get_id: false,
        };
        fetchResults(crowdResultData, setIsCrowdLoading, setCrowdDataResponse);
    }, []);

    const handleApplied = () => {
        const crowdResultData = {
            start_date: startDate,
            end_date: endDate,
            label: ["crowd_detection"],
            time_zone: "asia/kolkata",
            duration_type: "day",
            get_id: false,
        };
        fetchResults(crowdResultData, setIsCrowdLoading, setCrowdDataResponse);
    };

    const fetchResults = (data, setLoader, setResponse) => {
        setLoader(true);
        getResult(data)
            .then((response) => {
                if (response?.data && Object.keys(response?.data).length > 0) {
                    setResponse(response?.data || null);
                    setLoader(false);
                } else {
                    setResponse(null);
                    setLoader(false);
                }
            })
            .catch(() => {
                setLoader(false); // Stop the loader even if the API fails
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
                label: ["crowd_detection"],
                time_zone: "asia/kolkata",
                duration_type: "second",
                get_id: true,
            };

            const response = await getResult(resultData)


            const drilldownData = response.data.crowd_detection.map(item => ({
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
        <>
            <Grid container spacing={2}>
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
                    <div>
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
            <Grid container spacing={2}>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} mt={2}>
                    <App
                        title="Crowd"
                        count={''}
                        seriesData={crowdDataResponse && crowdDataResponse?.crowd_detection ? crowdDataResponse?.crowd_detection : []}
                        chartType={"column"}
                        chartLoading={isCrowdLoading}
                        noDataMessage={"No data found"}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        chartName={'crowd_detection'}
                        setIsOccupancyLoading={setIsCrowdLoading}
                        setOccupancyDataResponse={setCrowdDataResponse}
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

export default CrowdDashboard;
