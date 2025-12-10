import React, {useEffect, useMemo, useState} from 'react';

import {PieChartComponent} from "./Chart/PieChartComponent";
import TrendChart from "./Chart/spilchart";
import {getCaseStatusCountPercentage, getChairOccupancyCount, getResult, getResultTypeCount} from "../../_redux/VFSAPI";
import Select from "react-select";
import {customStyles} from "../../../../../../utils/CustomStyles";
import {DashboardDateOptions} from "../../../../../../utils/date";
import {dataValue, getDateRange, getDurationType} from "../../../../../../utils/getDateRange";
import {Grid} from "@mui/material";

function Dashboard() {
    const [resultTypeCount, setResultTypeCount] = useState([]);
    const [forensicDashboard, setForensicDashboard] = useState([]);
    const [occupancyDashboard, setOccupancyDashboard] = useState([]);
    const [dateRangeValue, setDateRangeValue] = useState(DashboardDateOptions[2]);

    const [crowdDataResponse, setCrowdDataResponse] = useState(null);

    const [abandonedDataResponse, setAbandonedDataResponse] = useState(null);

    const {startDate, endDate} = useMemo(() => getDateRange(dateRangeValue?.value), [dateRangeValue]);
    const duration = useMemo(() => getDurationType(dateRangeValue), [dateRangeValue]);

    useEffect(() => {
        const data = {
            start_date: startDate,
            end_date: endDate
        };
        getResultTypeCounts(data);
        const casedata = {
            start_date: startDate,
            end_date: endDate,
            case_status: "completed",
        };
        getCaseStatusCountPercentages(casedata);
        getChairOccupancyCounts(data);

        const crowdResultData = {
            start_date: startDate,
            end_date: endDate,
            label: ["crowd_detection"],
            time_zone: "asia/kolkata",
            duration_type: "day",
            get_id: false
        };
        fetchResults(crowdResultData,  setCrowdDataResponse);

        const abandonedResultData = {
            start_date: startDate,
            end_date: endDate,
            label: ["object_left_behind"],
            time_zone: "asia/kolkata",
            duration_type: "day",
            get_id: false
        };
        fetchResults(abandonedResultData, setAbandonedDataResponse);
    }, []);

    const getResultTypeCounts = (data) => {
        getResultTypeCount(data).then((response) => {
            if (response?.data?.result_type_counts) {
                setResultTypeCount(response.data.result_type_counts);
            }
        });
    };

    const getCaseStatusCountPercentages = (data) => {
        getCaseStatusCountPercentage(data).then((response) => {
            if (response?.data) {
                setForensicDashboard(response.data.data);
            }
        });
    };
    const getChairOccupancyCounts = (data) => {
        getChairOccupancyCount(data).then((response) => {
            if (response?.data) {
                setOccupancyDashboard(response.data);
            }
        });
    };

    const fetchResults = (data,  setResponse) => {
        getResult(data).then((response) => {
            setResponse(response?.data || null);

        }).catch((error) => {
           console.log("error:::" , error)
        });
    };

    const handleDateRangeChange = (event) => {
        setDateRangeValue(event);
    };

    const handleApplied = () => {
        const data = {
            start_date: startDate,
            end_date: endDate
        };
        getResultTypeCounts(data);
        const casedata = {
            start_date: startDate,
            end_date: endDate,
            case_status: "completed",
        };
        getCaseStatusCountPercentages(casedata);
        getChairOccupancyCounts(data);

        const crowdResultData = {
            start_date: startDate,
            end_date: endDate,
            label: ["crowd_detection"],
            time_zone: "asia/kolkata",
            duration_type: "day",
            get_id: false
        };
        fetchResults(crowdResultData, setCrowdDataResponse);

        const abandonedResultData = {
            start_date: startDate,
            end_date: endDate,
            label: ["object_left_behind"],
            time_zone: "asia/kolkata",
            duration_type: "day",
            get_id: false
        };
        fetchResults(abandonedResultData,  setAbandonedDataResponse);
    };

    return (
        <>
            <div className="row">
                <div className="col-3 mb-5">
                    <Select
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            cursor: "pointer",
                            colors: {
                                ...theme.colors,
                                primary25: "#5DBFC4",
                                primary: "#147b82",
                            },
                        })}
                        isMulti={false}
                        placeholder="Date Range Filter"
                        options={DashboardDateOptions}
                        onChange={handleDateRangeChange}
                        styles={customStyles}
                        value={dateRangeValue}
                    />
                </div>
                <div className="col-3 mb-5">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleApplied}
                    >
                        Apply
                    </button>
                </div>
            </div>

            <div className="row">
                {/* Card 1 (Clickable) */}
                {resultTypeCount.length > 0 && resultTypeCount.map((item, index) => {
                    if (index !== 0) return null; // Skip all except first

                    // Extract key and value dynamically
                    const key = Object.keys(item)[0]; // Get the key (e.g., "Crowd")
                    const value = item[key];          // Get the value (e.g., 48)

                    return (
                        <div key={index} className="col-12 col-md-6 col-lg-3">
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
                                        {dataValue[key]} {/* Display the key dynamically */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>

            <Grid container spacing={2} >
                <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                    <PieChartComponent
                        title="Investigation Forensics"
                        salesData={forensicDashboard}
                        dropdown={true}
                        // details={""}
                        chartType={"pie"}
                        colorByPoint={true}
                        name={"Investing Forensic"}
                        chartLoading={false}
                    />
                </Grid>
                {/*<Grid item xl={6} lg={6} md={6} sm={12} xs={12}>*/}
                {/*    <TrendChart*/}
                {/*        title="Crowd Monitoring"*/}
                {/*        salesData={crowdDataResponse || {}}*/}
                {/*        color="rgba(20,125,130,0.8)"*/}
                {/*    />*/}
                {/*</Grid>*/}
                {/*<Grid item xl={6} lg={6} md={6} sm={12} xs={12}>*/}
                {/*    <PieChartComponent*/}
                {/*        title="Occupancy Analysis"*/}
                {/*        salesData={occupancyDashboard}*/}
                {/*        dropdown={true}*/}
                {/*        chartType={"pie"}*/}
                {/*        colorByPoint={true}*/}
                {/*        chartLoading={false}*/}
                {/*    />*/}
                {/*</Grid>*/}
                {/*<Grid item xl={6} lg={6} md={6} sm={12} xs={12}>*/}
                {/*    <TrendChart*/}
                {/*        title="Abandoned Object"*/}
                {/*        salesData={abandonedDataResponse || {}}*/}
                {/*        color="rgba(255,99,132,0.8)"*/}
                {/*    />*/}
                {/*</Grid>*/}
            </Grid>

        </>
    );
}

export default Dashboard;
