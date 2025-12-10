import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import Select from "react-select";
import {customStyles} from "../../../../../utils/CustomStyles";
import {useDispatch} from "react-redux";
import * as actions from "../_redux/CameraAction";

function CameraUseCasemapping({usecaseShowModal ,usecaseLoader,
                                  usercaseOptions,onHide ,camera}) {
    const dispatch = useDispatch();
    const [usecaseValue ,setUsecaseValue] = useState([]);

    const handleUsecaseChange = (value) => {
        setUsecaseValue(value);
    }

    const close = () =>{
        setUsecaseValue([])
        onHide();
    }
    const onSubmit= () =>{
        const result_type = usecaseValue && usecaseValue.length > 0 ? usecaseValue.map((item) => item.value)  : [];

        const data = {
            id: camera?.id,
            result_types: result_type || []
        }

        dispatch(actions.updateCameraUsecaseTypes(data))
            .then((response) => {
                dispatch(actions.fetchCamera());
                close();
            })
            .catch((error) => {
                console.error("Error fetching cameras:", error);
                close();
            });
    }

    useEffect(() => {
        if(usecaseShowModal){


            dispatch(actions.fetchCameraRtspById(camera?.id)).then((response) => {
                const formattedOptions = response?.result_types.map((item) => ({
                    label: item.result_type, // Usecase name as label
                    value: item.id,         // Usecase ID as value
                }));
                setUsecaseValue(formattedOptions);
            })
        }
    }, [usecaseShowModal]);


    return (
        <>
            <Modal size="sm" show={usecaseShowModal} onHide={close} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{camera?.camera_name}</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12} >
                                <Form.Label>Select Usecase</Form.Label>
                                <Select
                                    theme={theme => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                            ...theme.colors,
                                            primary25: "#5DBFC4",
                                            primary: "#147b82"
                                        }
                                    })}
                                    styles={customStyles}
                                    isLoading={usecaseLoader}
                                    isSearchable={false}
                                    isMulti={true}
                                    placeholder="Select Usecase"
                                    className="select-react-dropdown"
                                    value={usecaseValue}
                                    onChange={handleUsecaseChange}
                                    options={usercaseOptions}
                                />
                            </Col>

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={close}
                            className="btn ">Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={onSubmit}
                            className="btn ">Submit</Button>

                    </Modal.Footer>
            </Modal>
        </>
    );
}

export default CameraUseCasemapping;