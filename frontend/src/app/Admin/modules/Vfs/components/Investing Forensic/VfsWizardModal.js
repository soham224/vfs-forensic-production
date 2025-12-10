import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Modal, Row} from 'react-bootstrap';

import CameraCardView from "./selectCamera";
import moment from "moment";
import {getCurrentEndDate, getCurrentStartDate} from "../../../../../../utils/TimeZone";
import {FaPen, FaPlus, FaTimesCircle} from "react-icons/fa";
import Select from "react-select";
import FormDateRangePicker from "../FormDateRangePicker";
import {customStyles} from "../../../../../../utils/CustomStyles";
import getSelectedDateTimeDefaultValue from "../../../../../../utils/dateRangePicker/dateFunctions";
import getSelectedDateTimeDefaultValueForRange from "../../../../../../utils/dateRangePicker/dateRangeFunctions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import * as action from "../../../Locations/_redux/LocationAction";
import * as actions from "../../../Cameras/_redux/CameraAction";
import {styled} from "@mui/styles";
import {FormControl, FormControlLabel, Radio, RadioGroup, Step, StepLabel, Stepper} from "@mui/material";
import {AiOutlineClose} from "react-icons/ai";

function VfsWizardModal({
                            caseModalShow,
                            caseModalOnHide,
                            caseModalSubmit,
                            caseData,
                            setCaseData,
                            suspects,
                            setSuspects,
                            selectedCameras,
                            setSelectedCameras,
                            setSelectedVideos,
                            selectedVideos
                        }) {
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [startDate, setStartDate] = useState(moment.utc(getCurrentStartDate()).format());
    const [endDate, setEndDate] = useState(moment.utc(getCurrentEndDate()).format());
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(12);
    const [locationOptions, setLocationOptions] = useState([]);
    const [locationLoader, setLocationLoader] = useState(false);
    const [locationValue, setLocationValue] = useState([]);
    const [cameraNameByLocationID, setCameraNameByLocationID] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedVideoTypeValue, setSelectedVideoTypeValue] = useState("video"); // Initial state
    const [videoAll, setVideoAll] = useState([]);


    const CustomStepper = styled(Stepper)({
        '& .MuiStepLabel-label': {
            color: '#147b82',
        },
        '& .MuiStepIcon-root.MuiStepIcon-active': {
            color: '#147b82', // Color for non-active and active step text
        },
        '& .MuiStepIcon-root.MuiStepIcon-completed': {
            color: '#147b82', // Color for non-active and active step text
        },
        '& .MuiStepLabel-label.Mui-active': {
            color: '#147b82', // Active step label color
            fontWeight: 'bold', // Optional: make active label bold
        },
        '& .MuiStepIcon-root': {
            backgroundColor: 'white', // White background for all step icons
        },
        '& .MuiStepIcon-root.Mui-active': {
            backgroundColor: 'white', // White background for active step icon
            color: '#147b82', // Color for active step icon
        },
        '& .MuiStepIcon-root.Mui-completed': {
            backgroundColor: 'white', // White background for completed step icon
            color: '#147b82', // Color for completed step icon
        },
        '& .MuiStepIcon-text': {
            fill: '#ffffff',
        },
    });

    // Fetch locations when component mounts
    useEffect(() => {
        if (caseModalShow) {
            dispatch(action.fetchLocation());
        }
    }, [dispatch ,caseModalShow]);


    // Get locations from the Redux state
    const {location} = useSelector(
        (state) => ({location: state.location}),
        shallowEqual
    );

    // Transform fetched locations into Select options
    useEffect(() => {
        setLocationLoader(location?.listLoading);

        if (location?.entities) {
            const transformedLocations = location.entities.map(({location_name, id}) => ({
                label: location_name,
                value: id,
            }));
            setLocationOptions(transformedLocations);
        }
    }, [location]);


    useEffect(() => {
        if (!caseModalShow) {
            setCaseData({
                caseId: '',
                caseName: '',
                caseDescription: '',
                startDate: moment().format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD'),
                cameras: [],
                uploadedImage: null,
            });
            setSuspects([{image: null, name: ''}]);
            setActiveStep(0);
            setErrors({});
        }
    }, [caseModalShow]);

    const handleNext = () => {
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };


    const handleFileUpload = (e, index) => {
        const file = e.target.files[0];

        if (file) {
            const fileType = file.type.split('/')[0]; // Get the file type (e.g., 'image')

            // Ensure it's an image type
            if (fileType === 'image') {
                const updatedSuspects = [...suspects];
                updatedSuspects[index].image = URL.createObjectURL(file); // Store the image URL
                setSuspects(updatedSuspects);

                e.target.value = null;
            } else {
                alert('Please upload a valid image file (JPG, PNG, GIF, etc.).');
            }
        }
    };


    const addSuspect = () => {
        if (suspects.length < 4) setSuspects([...suspects, {image: null, name: ''}]);
    };

    const removeSuspect = (index) => {
        if (suspects.length > 1) setSuspects(suspects.filter((_, i) => i !== index));
    };


    const handleChange = (e, index) => {
        const {value} = e.target;
        const updatedSuspects = [...suspects];
        updatedSuspects[index].name = value;
        setSuspects(updatedSuspects);
    };


    const handleRemoveImage = (index) => {
        const updatedSuspects = [...suspects];
        updatedSuspects[index].image = null;
        setSuspects(updatedSuspects);

        // Reset the file input value
        const fileInput = document.getElementById(`file-upload-${index}`);
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleLocationChange = (selectedOption) => {
        setLocationValue(selectedOption); // Store the entire selected object
    };

    const showCamera = () => {
        // Clear the camera list immediately to indicate loading/reset UI state
        setSelectedCameras([]);

        // Delay the API call by 1 second
        setTimeout(() => {
            const locationIds = locationValue.map((item) => item.value);
            const data = {
                location_id: locationIds
            }
            // Fetch cameras based on location IDs
            dispatch(actions.fetchCameraByLocationId(data))
                .then((response) => {
                    // Update the state with the fetched camera data
                    setCameraNameByLocationID(response);
                })
                .catch((error) => {
                    console.error("Error fetching cameras:", error);
                    // Optionally, handle errors and notify the user
                    setCameraNameByLocationID([]); // Clear state in case of failure
                });
        }, 1000); // 1000ms = 1 second
    };

    // Search handler for filtering cameras by name
    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase(); // Convert search text to lowercase
        setSearchText(value); // Update search text state
    };

    // Filter cameras based on search text
    const filteredCameras = cameraNameByLocationID.filter((camera) =>
        camera.camera_name.toLowerCase().includes(searchText)
    );

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedCameras(filteredCameras.map(camera => camera.id));
        } else {
            setSelectedCameras([]);
        }
    };

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

    const caseModalOnClose = () => {
        setLocationValue([])
        setSelectedCameras([])
        caseModalOnHide()
        setCameraNameByLocationID([])
    }

    const caseModalClose = () => {
        caseModalSubmit()
        setLocationValue([])
        setSelectedCameras([])
        setCameraNameByLocationID([])
    };


    const isStepOneValid = () => {
        return caseData.caseName.trim() !== '' && caseData.caseDescription.trim() !== '';
    };

    const isStepTwoValid = () => {
        return selectedCameras.length > 0 || selectedVideos.length > 0;
    };


    const isSuspectsValid = () => {
        return suspects.some(suspect => suspect.image && suspect.name.trim() !== '');
    };

    const handleChangeVideoType = (event) => {
        setSelectedVideoTypeValue(event.target.value);
    };

    const handleLocalVideo = () => {
        dispatch(actions.getAllVideo())
            .then((response) => {
                setVideoAll(response)
            })
            .catch((error) => {
                console.error("Error fetching cameras:", error);
                // Optionally, handle errors and notify the user
                setCameraNameByLocationID([]); // Clear state in case of failure
            });
    }


    const steps = ['Basic Information', "Select Video Type", 'Select Video', 'Upload Suspect'];
    return (
        <Modal size="xl" centered show={caseModalShow} onHide={caseModalOnClose}>
            <Modal.Header closeButton>
                <Modal.Title>New Case</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{display: 'flex', height: '70vh'}}>
                {/* Left Static Stepper */}
                <div style={{
                    width: '15%',

                    borderRight: '1px solid #ddd',
                    position: 'sticky',
                    top: 0,
                }}>
                    <CustomStepper activeStep={activeStep} orientation="vertical" style={{padding: "0px"}}>

                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </CustomStepper>

                </div>

                {/* Right Scrollable Content */}
                <div style={{
                    width: '85%',
                    paddingLeft: '20px',
                    overflowX: 'hidden',
                    overflowY: 'hidden'
                }}>
                    {activeStep === 0 && (
                        <Form>
                            <Row>
                                <Col sm={12}>
                                    <Form.Label>Case Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={caseData.caseName}
                                        onChange={(e) => setCaseData({...caseData, caseName: e.target.value})}
                                    />
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <Form.Label>Case Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={6}
                                        name="caseDescription"
                                        value={caseData.caseDescription}
                                        onChange={(e) => setCaseData({...caseData, caseDescription: e.target.value})}
                                    />
                                </Col>

                            </Row>
                        </Form>
                    )}

                    {activeStep === 1 &&
                        <>
                            <Row className={'mb-5'}>
                                <Col sm={6} className="mt-3">
                                    <FormControl>
                                        <Form.Label id="demo-radio-buttons-group-label">Select Video Type</Form.Label>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            name="radio-buttons-group"
                                            value={selectedVideoTypeValue}
                                            onChange={handleChangeVideoType} // Handle state update
                                        >
                                            <FormControlLabel value="video" control={<Radio/>} label="Video"/>
                                            {/*<FormControlLabel value="vms" control={<Radio/>} label="VMS"/>*/}
                                        </RadioGroup>
                                    </FormControl>
                                </Col>
                            </Row>
                        </>
                    }

                    {activeStep === 2 &&
                        <>
                            {selectedVideoTypeValue !== "video" ? (
                                <>
                                    <Row className={'mb-5'}>
                                        <Col sm={6} className="mt-3">
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


                                        <Col sm={6} className="mt-3">
                                            <Form.Label>Select Date</Form.Label>
                                            <FormDateRangePicker
                                                rangeIndex={selectedIndex}
                                                minDate={minDate}
                                                maxDate={maxDate}
                                                startDate={startDate}
                                                endDate={endDate}
                                                changeDateTimeRange={dateTimeRangeChangeHandler}
                                                changeDateTimeRangeIndex={dateTimeRangeIndexChangeHandler}
                                            />{errors.dateRange &&
                                            <small style={{color: 'red'}}>{errors.dateRange}</small>}
                                        </Col>
                                        <Col sm={12} className="mt-3">
                                            <Button
                                                variant="primary"
                                                onClick={() => showCamera()}
                                                className={'float-right btn-sm'}
                                            >
                                                Show Camera
                                            </Button>
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        {cameraNameByLocationID.length > 0 &&
                                            <Col sm={12} className={'d-flex justify-content-between'}>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedCameras.length === filteredCameras.length}
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                    label={'Select All'}
                                                />
                                                <div className="d-flex">
                                                    <input
                                                        type="search"
                                                        className="form-control form-control-sm"
                                                        name="searchText"
                                                        placeholder="Search For Name"
                                                        value={searchText}
                                                        onChange={handleSearchChange}
                                                    />
                                                    {/*<Button*/}
                                                    {/*    variant="primary"*/}
                                                    {/*    // onClick={() => removeSuspect()}*/}
                                                    {/*    className={'float-right btn-sm ml-3'}*/}
                                                    {/*>*/}
                                                    {/*    Add Camera*/}
                                                    {/*</Button>*/}
                                                </div>
                                            </Col>
                                        }
                                    </Row>

                                    <div
                                        style={{
                                            maxHeight: 'calc(70vh - 100px)', // Adjust height dynamically for header and footer
                                            overflowY: 'auto',
                                            paddingBottom: '10px',
                                        }}
                                    >

                                        <CameraCardView
                                            selectedCameras={selectedCameras}
                                            setSelectedCameras={setSelectedCameras}
                                            cameraNameByLocationID={cameraNameByLocationID}
                                            searchText={searchText}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                                            <Button onClick={handleLocalVideo} variant="primary">
                                                Show All Video
                                            </Button>
                                        </div>

                                        <div
                                            style={{
                                                // maxHeight: 'calc(70vh - 0px)', // Adjust height dynamically for header and footer
                                                overflowY: 'visible',
                                                paddingBottom: '10px',
                                            }}
                                        >
                                            <div>

                                                <Row className="g-4">

                                                    {videoAll.map((camera) => (
                                                        <Col key={camera.id}
                                                             xs={12}   // 1 per row on mobile
                                                             sm={12}    // 2 per row on small screens
                                                             md={6}    // 3 per row on medium screens
                                                             lg={4}    // 4 per row on large screens
                                                             xl={3}    // 4 per row on extra-large screens
                                                             xxl={3}   // 4 per row on wide desktops
                                                             className={'mt-3'}>
                                                            <Card style={{boxShadow: '2px 2px 5px 0px #835d5d'}}>
                                                                <div
                                                                    className="d-flex justify-content-between align-items-center mx-2 mt-2">
                                                                    <div className={'lead'}>
                                                                        {camera?.video_name}
                                                                    </div>
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id={`camera-check-${camera?.id}`}
                                                                        checked={selectedVideos.includes(camera?.id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedVideos([...selectedVideos, camera?.id]);
                                                                            } else {
                                                                                setSelectedVideos(selectedVideos.filter(id => id !== camera?.id));
                                                                            }
                                                                        }}
                                                                        aria-label={`Select camera ${camera?.video_name}`}
                                                                    />
                                                                </div>

                                                                <iframe
                                                                    style={{borderRadius: '5px'}}
                                                                    width="100%"
                                                                    height="200"
                                                                    src={camera?.destination_url}
                                                                    frameBorder="0"
                                                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                    title={camera?.video_name}
                                                                    className={'mt-2'}
                                                                ></iframe>
                                                            </Card>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </div>
                                        </div>
                                    </div>

                                </>

                            )}


                        </>
                    }

                    {activeStep === 3 && (
                        <>

                            <div
                                style={{
                                    maxHeight: 'calc(70vh - 100px)', // Adjust height dynamically for header and footer
                                    overflowY: 'auto',
                                    paddingBottom: '10px',
                                }}
                            >
                                {suspects.map((suspect, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        {/* Left side: Image Upload */}
                                        <div style={{position: 'relative', marginRight: '20px'}}>
                                            {suspect.image ? (
                                                <div
                                                    style={{
                                                        width: '180px',
                                                        height: '180px',
                                                        overflow: 'hidden',
                                                        marginBottom: '10px',
                                                        borderRadius: "10px"
                                                    }}
                                                >
                                                    <img
                                                        src={suspect.image}
                                                        alt="Profile"
                                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        width: '180px',
                                                        height: '180px',
                                                        backgroundColor: '#e0e0e0',
                                                        marginBottom: '10px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: '#fff',
                                                        fontSize: '16px',
                                                        borderRadius: "10px"
                                                    }}
                                                >
                                                    Upload Photo
                                                </div>
                                            )}

                                            {/* Remove Icon */}
                                            {suspect.image && (
                                                <FaTimesCircle
                                                    size={24}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '5px',
                                                        right: '5px',
                                                        backgroundColor: 'white',
                                                        color: 'red',
                                                        borderRadius: '50%',
                                                        padding: '5px',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => handleRemoveImage(index)}
                                                />
                                            )}
                                            {!suspect.image && (
                                                <label
                                                    htmlFor={`file-upload-${index}`}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '5px',
                                                        right: '5px',
                                                        backgroundColor: '#147b82',
                                                        color: 'white',
                                                        borderRadius: '50%',
                                                        padding: '5px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <FaPen/>
                                                </label>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`file-upload-${index}`}
                                                style={{display: 'none'}}
                                                onChange={(e) => handleFileUpload(e, index)}
                                            />
                                        </div>

                                        {/* Right side: Name Input */}
                                        <Col md={6}>
                                            <Form.Group as={Row}>
                                                <Col sm={12}>
                                                    <Form.Label>Suspect Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={suspect.name}
                                                        placeholder="Enter Suspect Name"
                                                        onChange={(e) => handleChange(e, index)}
                                                    />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Button
                                            variant="danger"
                                            onClick={() => removeSuspect(index)}
                                            disabled={suspects.length === 1}
                                        >
                                            <AiOutlineClose/> Remove
                                        </Button>
                                    </div>
                                ))}
                                {suspects.length < 4 && (
                                    <Button onClick={addSuspect} variant="primary">
                                        <FaPlus/> Add Suspect
                                    </Button>
                                )}
                            </div>

                            {/* Fixed Note Section */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    // backgroundColor: '#fff3cd',
                                    borderLeft: '5px solid #ffeeba',
                                    padding: '15px',
                                    fontSize: '14px',
                                    // color: '#856404',
                                    borderRadius: '4px',
                                    marginTop: '10px',
                                }}
                            >
                                <strong>Note:</strong> Uploading duplicate entries for a person or suspect may lead to
                                delayed processing and
                                inaccurate results. Please ensure each entry is unique.
                            </div>


                        </>
                    )}

                </div>
            </Modal.Body>


            <Modal.Footer style={{justifyContent: 'space-between'}}>
                {activeStep < steps.length - 1 ? (
                    <>
                        <div>
                            <Button onClick={handleBack} disabled={activeStep === 0} variant="secondary">
                                Previous
                            </Button>
                        </div>
                        <div>

                            <Button onClick={handleNext} variant="primary" disabled={
                                // eslint-disable-next-line no-mixed-operators
                                activeStep === 0 && !isStepOneValid() ||
                                // eslint-disable-next-line no-mixed-operators
                                activeStep === 2 && !isStepTwoValid()}>
                                Next
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <Button onClick={handleBack} disabled={activeStep === 0} variant="secondary">
                                Previous
                            </Button>
                        </div>
                        <div>
                            <Button onClick={caseModalClose} variant="primary" disabled={!isSuspectsValid()}>
                                Submit
                            </Button>
                        </div>
                    </>

                )}
            </Modal.Footer>
        </Modal>
    );
}

export default VfsWizardModal;

