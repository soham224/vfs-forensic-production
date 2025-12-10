import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import moment from "moment";
import Select from "react-select";
import {customStyles} from "../../../../../../utils/CustomStyles";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import * as action from "../../../Locations/_redux/LocationAction";
import SelectCamera from "./SelectCamera";
import {styled} from "@mui/styles";
import {Step, StepLabel, Stepper} from "@mui/material";

function ImportCameraModal({
                            show,
                            caseModalOnHide,
                            caseModalSubmit,
                            caseData,
                            setCaseData,
                            suspects,
                            setSuspects,
                            selectedCameras,
                            setSelectedCameras
                        }) {
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [locationOptions, setLocationOptions] = useState([]);
    const [locationLoader, setLocationLoader] = useState(false);
    const [locationValue, setLocationValue] = useState([]);
    const [searchText, setSearchText] = useState("");


    const cameraNameByLocationID = [
        {
            "camera_name": "cam1-DE",
            "nvr_id": "111",
            "status": true,
            "deleted": false,
            "id": 1,
            "created_date": "2024-12-10T05:45:42",
            "updated_date": "2024-12-10T05:45:42",
            "locations": {
                "location_name": "New Delhi",
                "status": true,
                "id": 1,
                "created_date": "2024-12-10T05:37:23",
                "updated_date": "2024-12-10T05:37:23"
            }
        },
        {
            "camera_name": "cam2-DE",
            "nvr_id": "111",
            "status": true,
            "deleted": false,
            "id": 2,
            "created_date": "2024-12-10T05:45:42",
            "updated_date": "2024-12-10T05:45:42",
            "locations": {
                "location_name": "New Delhi",
                "status": true,
                "id": 1,
                "created_date": "2024-12-10T05:37:23",
                "updated_date": "2024-12-10T05:37:23"
            }
        },
        {
            "camera_name": "cam2-DE",
            "nvr_id": "111",
            "status": true,
            "deleted": false,
            "id": 3,
            "created_date": "2024-12-10T05:45:42",
            "updated_date": "2024-12-10T05:45:42",
            "locations": {
                "location_name": "New Delhi",
                "status": true,
                "id": 1,
                "created_date": "2024-12-10T05:37:23",
                "updated_date": "2024-12-10T05:37:23"
            }
        },
        {
            "camera_name": "cam4-DE",
            "nvr_id": "111",
            "status": true,
            "deleted": false,
            "id": 4,
            "created_date": "2024-12-10T05:45:42",
            "updated_date": "2024-12-10T05:45:42",
            "locations": {
                "location_name": "New Delhi",
                "status": true,
                "id": 1,
                "created_date": "2024-12-10T05:37:23",
                "updated_date": "2024-12-10T05:37:23"
            }
        },
        {
            "camera_name": "cam7-DE",
            "nvr_id": "111",
            "status": true,
            "deleted": false,
            "id": 5,
            "created_date": "2024-12-10T05:45:42",
            "updated_date": "2024-12-10T05:45:42",
            "locations": {
                "location_name": "New Delhi",
                "status": true,
                "id": 1,
                "created_date": "2024-12-10T05:37:23",
                "updated_date": "2024-12-10T05:37:23"
            }
        },
        {
            "camera_name": "cam5-DE",
            "nvr_id": "111",
            "status": true,
            "deleted": false,
            "id": 6,
            "created_date": "2024-12-10T05:45:42",
            "updated_date": "2024-12-10T05:45:42",
            "locations": {
                "location_name": "New Delhi",
                "status": true,
                "id": 1,
                "created_date": "2024-12-10T05:37:23",
                "updated_date": "2024-12-10T05:37:23"
            }
        },
        {
            "camera_name": "cam6-DE",
            "nvr_id": "111",
            "status": true,
            "deleted": false,
            "id": 7,
            "created_date": "2024-12-10T05:45:42",
            "updated_date": "2024-12-10T05:45:42",
            "locations": {
                "location_name": "New Delhi",
                "status": true,
                "id": 1,
                "created_date": "2024-12-10T05:37:23",
                "updated_date": "2024-12-10T05:37:23"
            }
        },
        {
            "camera_name": "string123",
            "nvr_id": "string",
            "status": true,
            "deleted": false,
            "id": 14,
            "created_date": "2024-12-10T13:02:19",
            "updated_date": "2024-12-10T13:02:19",
            "locations": {
                "location_name": "New Delhi",
                "status": true,
                "id": 1,
                "created_date": "2024-12-10T05:37:23",
                "updated_date": "2024-12-10T05:37:23"
            }
        },
        {
            "camera_name": "add_camera",
            "nvr_id": "1",
            "status": true,
            "deleted": false,
            "id": 15,
            "created_date": "2024-12-10T13:03:45",
            "updated_date": "2024-12-10T13:03:45",
            "locations": {
                "location_name": "New Delhi",
                "status": true,
                "id": 1,
                "created_date": "2024-12-10T05:37:23",
                "updated_date": "2024-12-10T05:37:23"
            }
        }
    ]

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
        if (show) {
            dispatch(action.fetchLocation());
        }
    }, [dispatch, show]);


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
        if (!show) {
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

        }
    }, [show]);

    const handleNext = () => {
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleLocationChange = (selectedOption) => {
        setLocationValue(selectedOption); // Store the entire selected object
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



    const steps = ['Enter Credential', 'Select Camera'];
    return (
        <Modal size="lg" centered show={show} onHide={caseModalOnHide}>
            <Modal.Header closeButton>
                <Modal.Title>Import Camera</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ height: '70vh'}}>
                <div>
                    <CustomStepper activeStep={activeStep} orientation="horizontal" style={{padding: "0px"}}>

                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </CustomStepper>

                </div>

                <div>
                    {activeStep === 0 && (
                        <Form>
                            <Row className={'mt-5'}>
                                <Col sm={12}>
                                    <Form.Label>Email Id</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={caseData.caseName}
                                        onChange={(e) => setCaseData({...caseData, caseName: e.target.value})}
                                    />
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={caseData.caseName}
                                        onChange={(e) => setCaseData({...caseData, caseName: e.target.value})}
                                    />
                                </Col>
                                <Col sm={12} className="mt-3">
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
                            </Row>
                        </Form>
                    )}

                    {activeStep === 1 &&
                        <>
                            <Form.Check
                                type="checkbox"
                                checked={selectedCameras.length === filteredCameras.length}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                label={'Select All'}
                            />
                            <Form.Label></Form.Label>
                            <div
                                style={{
                                    maxHeight: 'calc(70vh - 100px)', // Adjust height dynamically for header and footer
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    paddingBottom: '10px',
                                }}
                            >

                                <SelectCamera
                                    selectedCameras={selectedCameras}
                                    setSelectedCameras={setSelectedCameras}
                                    cameraNameByLocationID={cameraNameByLocationID}
                                    searchText={searchText}
                                />
                            </div>
                        </>
                    }

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
                            <Button onClick={handleNext} variant="primary">
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
                            <Button onClick={caseModalSubmit} variant="primary">
                                Submit
                            </Button>
                        </div>
                    </>

                )}
            </Modal.Footer>
        </Modal>
    );
}

export default ImportCameraModal;



