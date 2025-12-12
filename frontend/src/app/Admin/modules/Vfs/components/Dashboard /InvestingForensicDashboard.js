import React, {useEffect, useState} from 'react';
import {PieChartComponent} from "./Chart/PieChartComponent";
import {
    getCaseByIds,
    getCaseResult,
    getCaseStatusCount,
    getCaseStatusCountPercentage,
} from "../../_redux/VFSAPI";
import App from "./Chart/drillDown";
import FormDateRangePicker from "../FormDateRangePicker";
import moment from "moment/moment";
import {getCurrentEndDate, getCurrentStartDate} from "../../../../../../utils/TimeZone";
import getSelectedDateTimeDefaultValue from "../../../../../../utils/dateRangePicker/dateFunctions";
import getSelectedDateTimeDefaultValueForRange from "../../../../../../utils/dateRangePicker/dateRangeFunctions";
import {Grid} from "@mui/material";

function InvestingForensicDashboard() {
    const [caseStatusCount, setCaseStatusCount] = useState([]);
    const [startDate, setStartDate] = useState(moment.utc(getCurrentStartDate()).format());
    const [endDate, setEndDate] = useState(moment.utc(getCurrentEndDate()).format());
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(12);
    const [forensicTotalCaseDashboard, setForensicTotalCaseDashboard] = useState([]);
    const [forensicDashboard, setForensicDashboard] = useState([]);

    const [isCaseLoading, setIsCaseLoading] = useState(false);
    const [caseDataResponse, setCaseDataResponse] = useState(null);
    const [showCaseModal, setShowCaseModal] = useState(false);
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
        const data = {
            start_date: startDate,
            end_date: endDate
        };
        getCaseStatusCounts(data)
        getCaseStatusCountPercentages(data)
        const casedata = {
            start_date: startDate,
            end_date: endDate,
            case_status: "completed",
        };
        getCaseStatusTotalCountPercentages(casedata);

        const resultData = {
            start_date: startDate,
            end_date: endDate,
            label: ["case"],
            time_zone: "asia/kolkata",
            duration_type: "day",
            get_id: true
        };
        fetchResults(resultData, setIsCaseLoading, setCaseDataResponse);


    }, []);



    const getCaseStatusCountPercentages = (data)=>{
        getCaseStatusCountPercentage(data).then((response) => {
            if(response?.data){
                setForensicDashboard(response?.data?.data)
            }
        })
    }

    const getCaseStatusTotalCountPercentages = (data) => {
        getCaseStatusCountPercentage(data).then((response) => {
            if (response?.data) {
                setForensicTotalCaseDashboard(response.data.data);
            }
        });
        }



        const getCaseStatusCounts =(data)=>{
        getCaseStatusCount(data).then((response) => {
            if(response?.data){
                if(response?.data){
                    setCaseStatusCount(response?.data)
                }
            }
        })
    }

    const handleApplied = () => {
        const data = {
            "start_date": startDate,
            "end_date": endDate
        }
        getCaseStatusCounts(data)
        getCaseStatusCountPercentages(data)

        const resultData = {
            start_date: startDate,
            end_date: endDate,
            time_zone: "asia/kolkata",
            duration_type: "day",
            get_id: true
        };
        fetchResults(resultData, setIsCaseLoading, setCaseDataResponse);

    }

    const fetchResults = (data, setLoader, setResponse) => {
        setLoader(true);
        getCaseResult(data).then((response) => {
            setResponse(response?.data || null);
            setLoader(false);
        }).catch(() => {
            setLoader(false); // Stop the loader even if the API fails
        });
    };

    const onDrilldown = async (e) => {
        const {drilldown} = e?.point; // `name` is used for drilldown ID
        if (drilldown) {
            getCaseByIdsData(drilldown)
        }
    };

    const getCaseByIdsData = (data) => {
        getCaseByIds(data)
            .then((response) => {
                setModalData(response?.data || null);
                setShowCaseModal(true)
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


            {/* Card 1 (Clickable) */}
            <div className="row mt-5">
                {caseStatusCount && Object.entries(caseStatusCount).map(([key, value], index) => {
                    // Format the key for display
                    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();

                    return (
                        <div key={index} className="col-12 col-md-6 col-lg-2">
                            <div
                                className="card card-custom-vfs gutter-b"
                                style={{height: "130px", textDecoration: "none", cursor: "auto"}}
                            >
                                <div className="card-body-vfs">
                                    <div
                                        className={'font-weight-bold'}
                                        style={{color: '#2b2b2b', fontSize: '36px'}}
                                    >
                                        {value} {/* Display the value dynamically */}
                                    </div>
                                    <div className="lead font-weight-normal ">
                                        {formattedKey} {/* Display the key dynamically */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={'row'}>
                <div className="col-12 col-md-6 col-lg-6">
                    <PieChartComponent
                        title="Case Status"
                        salesData={forensicTotalCaseDashboard}
                        dropdown={true}
                        // details={""}
                        chartType={"pie"}
                        colorByPoint={true}
                        name={"Investing Forensic"}
                        chartLoading={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                    <PieChartComponent
                        title="Case Details"
                        salesData={forensicDashboard}
                        dropdown={true}
                        chartType={"pie"}
                        colorByPoint={true}
                        name={"Investing Forensic"}
                        chartLoading={false}
                    />

                </div>
                <div className="col-12 col-md-12 col-lg-12  mt-5">
                    <App
                        t title={'Case Graph By Time'}
                        count={''}
                        seriesData={caseDataResponse && caseDataResponse ? caseDataResponse : []}
                        chartType={"column"}
                        chartLoading={isCaseLoading}
                        noDataMessage={"No data found"}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        chartName={'case_detection'}
                        setIsOccupancyLoading={setIsCaseLoading}
                        setOccupancyDataResponse={setCaseDataResponse}
                        onDrilldown={onDrilldown}
                        showCaseModal={showCaseModal}
                        modalData={modalData}
                        setShowCaseModal={setShowCaseModal}
                    />
                </div>
            </div>
        </>
    );
}

export default InvestingForensicDashboard;