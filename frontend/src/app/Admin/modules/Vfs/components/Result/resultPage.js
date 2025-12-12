import React, {useEffect, useRef, useState} from 'react';
import { SearchText } from "../../../../../../utils/SearchText";
import { Card, CardHeader, CardBody, CardFooter } from "reactstrap";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import AssignmentCard from "./ResultTableCard";
import {getCameras, getResultvfs} from "../../_redux/VFSAPI";
import {Col, Form, Row} from "react-bootstrap";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {customStyles} from "../../../../../../utils/CustomStyles";
import FormDateRangePicker from "../FormDateRangePicker";
import moment from "moment/moment";
import {getCurrentEndDate, getCurrentStartDate} from "../../../../../../utils/TimeZone";
import getSelectedDateTimeDefaultValue from "../../../../../../utils/dateRangePicker/dateFunctions";
import getSelectedDateTimeDefaultValueForRange from "../../../../../../utils/dateRangePicker/dateRangeFunctions";
import * as action from "../../../Locations/_redux/LocationAction";
import ResultModal from "./ResultModal";
import {Pagination} from "@mui/lab";

function ResultPage() {
    const dispatch = useDispatch();
    const searchInput = useRef("");
    const location = useLocation();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [modalShow, setModalShow] = useState(false);
    const [pageInfo, setPageInfo] = useState({
        page_number: 1,
        page_size: 10,
       }); // Added default total_page
    const [pictures, setPictures] = useState([]); // Added pictures state

    const [locationLoader, setLocationLoader] = useState(false);
    const [locationOptions, setLocationOptions] = useState([]);
    const [locationValue, setLocationValue] = useState([]);

    const [cameraLoader, setCameraLoader] = useState(false);
    const [cameraOptions, setCameraOptions] = useState([]);
    const [cameraValue, setCameraValue] = useState([]);
    const [modalData, setModalData] = useState([]);
    const [startDate, setStartDate] = useState(moment.utc(getCurrentStartDate()).format());
    const [endDate, setEndDate] = useState(moment.utc(getCurrentEndDate()).format());
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(12);

    // Get locations from the Redux state
    const {locationData} = useSelector(
        (state) => ({locationData: state.location}),
        shallowEqual
    );

    const getFormattedTitle = () => {
        const path = location?.pathname;
        if (!path) return 'Default Title';

        // Split the path into parts
        const parts = path.split('/').filter(Boolean); // Remove empty parts
        const secondLastPart = parts[parts.length - 2]; // Get second last part
        let pageTitle = '';

        if (secondLastPart === 'crowd') {
            pageTitle = 'Crowd Results';
        } else if (secondLastPart === 'occupancy') {
            pageTitle = 'Occupancy Results';
        } else if (secondLastPart === 'objectleftbehind') {
            pageTitle = 'Abandoned Object';
        } else if (secondLastPart === 'investingforensic') {
            pageTitle = 'Case Result';
        }else {
            pageTitle = secondLastPart
                .split(/(?=[A-Z])/) // Split camel case
                .join(' ')
                .replace(/^./, str => str.toUpperCase()); // Capitalize
        }

        return pageTitle || 'Default Title';
    };

    const   filterResult = (e) => {
        // const searchStr = e?.target?.value || searchInput.current.value;
    };

    const handleCardData = (data, i) => {
        setCurrentImageIndex(i);
        setModalData(data)
        setModalShow(true);
    };

    const handleNextPage = (event, value) => {
        // Update the page number in state
        setPageInfo((prev) => ({
            ...prev,
            page_number: value,
        }));

        // Trigger API call with updated pagination data
        const baseData = {
            "page_number": value, // Update with new page number
            "page_size": pageInfo?.page_size, // Use current page size
            "location_id": locationValue.map((item) => item.value),
            "camera_id": cameraValue.map((item) => item.value),
            "start_datetime": startDate,
            "end_datetime": endDate
        };

        const resultTypes = {
            "Case Result": 1,
            "Occupancy Results": 3,
            "Abandoned Object": 4,
            "Crowd Results": 2

        };

        const formattedTitle = getFormattedTitle();

        if (resultTypes[formattedTitle] !== undefined) {
            const data = {
                ...baseData,
                "result_type": resultTypes[formattedTitle]
            };
            getResult(data); // Fetch results for the new page
        }
    };


    const onchangePage =(event ,value) =>{
        setPageInfo((prev) => ({
            ...prev,
            page_size: event.value,
        }));

         // API call with updated pagination data
        const baseData = {
            "page_number": 1, // Update with new page number
            "page_size": event.value, // Use current page size
            "location_id": locationValue.map((item) => item.value),
            "camera_id": cameraValue.map((item) => item.value),
            "start_datetime": startDate,
            "end_datetime": endDate
        };

        const resultTypes = {
            "Case Result": 1,
            "Occupancy Results": 3,
            "Abandoned Object": 4,
            "Crowd Results": 2
        };

        const formattedTitle = getFormattedTitle();

        if (resultTypes[formattedTitle] !== undefined) {
            const data = {
                ...baseData,
                "result_type": resultTypes[formattedTitle]
            };
            getResult(data); // Fetch results for the new page
        }

    }

    useEffect(() => {
        dispatch(action.fetchLocation());


        const baseData = {
            "page_number": 1,
            "page_size": pageInfo?.page_size,
            "location_id": locationValue.map((item) => item.value),
            "camera_id": cameraValue.map(item => item.value),
            "start_datetime": startDate,
            "end_datetime": endDate
        };

        // Mapping titles to result types
        const resultTypes = {
            "Case Result": 1,
            "Occupancy Results": 3,
            "Abandoned Object": 4,
            "Crowd Results": 2
        };

        const formattedTitle = getFormattedTitle();
        if (resultTypes[formattedTitle] !== undefined) {
            const data = {
                ...baseData, // Spread base data
                "result_type": resultTypes[formattedTitle] // Set specific result type
            };
            getResult(data); // Pass data to getResult
        }

    }, []);

    const handleLocationChange = (selectedOption) => {
        setLocationValue(selectedOption); // Store the entire selected object
        const locationIds = selectedOption.map(option => option.value);
        const data = {
            location_id: locationIds,
        }
        getCamera(data)
    };

    const getCamera =(data)=>{
        getCameras(data).then((response) => {
            if(response?.data){
                if(response?.data?.length > 0){
                    if(response?.data){
                            const transformedCamera = response?.data.map(({camera_name, id}) => ({
                                label: camera_name,
                                value: id,
                            }));
                        setCameraOptions(transformedCamera);
                        }

                }else {
                    setCameraOptions([])
                }
            }
        })
    }

    const getResult =(data)=>{
        getResultvfs(data).then((response) => {
            if(response?.data){
                if(response?.data?.results.length > 0){
                    setPictures(response?.data?.results)
                    setPageInfo(response?.data?.pagination) // Set pageInfo
                }else {
                    setPictures([])
                }
            }


        })
    }

    const handleCameraChange = (selectedOption) => {
        setCameraValue(selectedOption); // Store the entire selected object
    };

    useEffect(() => {
        if(locationData){
            if (locationData?.entities) {
                const transformedLocations = locationData.entities.map(({location_name, id}) => ({
                    label: location_name,
                    value: id,
                }));
                setLocationOptions(transformedLocations);
            }
        }
        setLocationLoader(locationData?.listLoading);

    }, [locationData]);

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
        const baseData = {
            "page_number": 1,
            "page_size": pageInfo?.page_size,
            "location_id": locationValue.map((item) => item.value),
            "camera_id": cameraValue.map(item => item.value),
            "start_datetime": startDate,
            "end_datetime": endDate
        };

        // Mapping titles to result types
        const resultTypes = {
            "Case Result": 1,
            "Occupancy Results": 3,
            "Abandoned Object": 4,
            "Crowd Results": 2
        };

        const formattedTitle = getFormattedTitle();
        if (resultTypes[formattedTitle] !== undefined) {
            const data = {
                ...baseData, // Spread base data
                "result_type": resultTypes[formattedTitle] // Set specific result type
            };
            getResult(data); // Pass data to getResult
        }
    };
    const handleClose = () => {
        setModalShow(false);
    };
    return (
        <>
            <Card style={{ width: "100%", margin: "auto", height: "750px", display: "flex", flexDirection: "column" }}>
                <CardHeader style={{ fontSize: "1.5rem", display: "flex", justifyContent: "space-between", padding: "15px 20px" }}>
                    <div>{getFormattedTitle()}</div>
                    <div className="d-flex justify-content-between align-items-center">
                        <SearchText reference={searchInput} onChangeHandler={filterResult} />
                    </div>
                </CardHeader>
                <CardBody
                    style={{
                        paddingLeft: '20px',
                        overflowX: 'hidden',
                        overflowY: 'hidden'
                    }}
                >
                    <div>
                        <Row className={'mb-5'}>
                            <Col sm={3} className="mt-3">
                                <Form.Label>Select Location</Form.Label>
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
                                    isMulti={true}
                                    placeholder="Select Location"
                                    value={locationValue} // This should be the entire selected object
                                    isLoading={locationLoader}
                                    onChange={handleLocationChange}
                                    options={locationOptions}
                                    styles={customStyles}
                                />
                            </Col>
                            <Col sm={4} className="mt-3">
                                <Form.Label>Select Camera</Form.Label>
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
                                    isMulti={true}
                                    placeholder="Select Camera"
                                    value={cameraValue} // This should be the entire selected object
                                    isLoading={cameraLoader}
                                    onChange={handleCameraChange}
                                    options={cameraOptions}
                                    styles={customStyles}
                                />
                            </Col>
                            <Col sm={4} className="mt-3">
                                <Form.Label>Select Date</Form.Label>
                                <FormDateRangePicker
                                    rangeIndex={selectedIndex}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    startDate={startDate}
                                    endDate={endDate}
                                    changeDateTimeRange={dateTimeRangeChangeHandler}
                                    changeDateTimeRangeIndex={dateTimeRangeIndexChangeHandler}
                                />
                            </Col>
                            <Col sm={1} className="mt-3">
                                <div className={'mt-5 float-right'}>
                                    <button
                                        type="button"
                                        className="btn btn-primary mt-3 "
                                        onClick={handleApplied}
                                    >
                                        Applied
                                    </button>
                                </div>

                            </Col>
                        </Row>
                    </div>
                    <div
                        style={{
                            maxHeight: 'calc(70vh - 100px)', // Adjust height dynamically for header and footer
                            overflowY: 'auto',
                            paddingBottom: '10px',
                        }}
                    >
                        {pictures && pictures.length > 0 ? (
                            <>
                                <div className="tusk_result-card-container pt-5">
                                    {pictures.map((x, i) => (
                                        <AssignmentCard
                                            key={i}
                                            index={i}
                                            assignment={x}
                                            handleCardData={handleCardData}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={"d-flex tusk_result-card-container justify-content-around mt-5 h3"}>
                                    <div>No Data Found</div>
                                </div>
                            </>
                        )}
                    </div>
                </CardBody>

                <CardFooter style={{ height: "80px", padding: "10px 20px" }}>
                    <div className="d-flex justify-content-between">
                        {pictures && pictures.length > 0 && (
                            <>
                                <div className="d-flex align-items-center">
                                <span className={"mr-2"}>Items per page:</span>
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
                                        value={
                                            pageInfo.page_size
                                                ? { value: pageInfo.page_size, label: pageInfo.page_size.toString() } // If defined, use it
                                                : { value: 10, label: "10" } // Fallback default value
                                        }
                                        onChange={onchangePage}
                                        options={[
                                            { value: 10, label: "10" },
                                            { value: 25, label: "25" },
                                            { value: 50, label: "50" },
                                        ]}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                width: "auto",
                                                minWidth: "120px",
                                                maxWidth: "200px",
                                            }),
                                        }}
                                    />


                                </div>
                                <div>
                                <Pagination
                                    count={pageInfo?.total_page}
                                    page={pageInfo?.next_page-1}
                                    onChange={handleNextPage}
                                    color="primary"
                                    style={{marginLeft: "20px"}}
                                />
                                </div>
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>

            <ResultModal
                modalShow={modalShow}
                handleClose={handleClose}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
                modalData={modalData}
                pageInfo={pageInfo}
            />
        </>
    );
}

export default ResultPage;
