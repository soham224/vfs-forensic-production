import React, {useEffect, useState} from "react";
import {Button, Col, Form, Modal} from "react-bootstrap";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {CameraSlice} from "../_redux/CameraSlice";
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Select from "react-select";
import {customStyles} from "../../../../../utils/CustomStyles";
import {warningToast} from "../../../../../utils/ToastMessage";
import * as action from "../_redux/CameraAction";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";

import {ButtonGroup} from "reactstrap";
import {DeleteOutline, Redo, Refresh, Undo} from "@mui/icons-material";
import {RegionSelect} from "../../../../../utils/Region_Lib/RegionSelect";



const { actions } = CameraSlice;

export default function CameraRoiDialog({ roiShowModal,onHide,camera }) {
    const dispatch = useDispatch();
    const [usercaseOptions , setUsercaseOptions] = useState([]);
    const [usecaseValue , setUsercaseValue] = useState([]);
    const [cameraRtsp , setCameraRtsp] = useState('');
    const [regions, setRegions] = useState([]);
    const [regionsStoreData, setRegionsStoreData] = useState([]);
    const [curReg, setCurReg] = useState(-1);
    const [scale, setScale] = useState(1);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [imageLoader, setImageLoader] = useState(false);

    const { actionsLoading,cameraFetchedById} = useSelector(
        (state) => ({
            actionsLoading: state.camera.actionsLoading,
            // cameraFetchedById:state.camera.cameraFetchedById
        }),
        shallowEqual
    );

    const [imagePath, setImagePath] = useState('');

    useEffect(() => {
        if (camera && camera?.result_types?.length > 0) {
            const formattedOptions = camera.result_types.map((item) => ({
                label: item.result_type, // Usecase name as label
                value: item.id,         // Usecase ID as value
            }));

            setUsercaseOptions(formattedOptions);
            setCameraRtsp(camera?.rtsp_url);

            // Set the first option as default selected value
            if (formattedOptions.length > 0) {
                setUsercaseValue(formattedOptions[0]);
            }
        }
    }, [camera]);


    useEffect(() => {
        setImagePath('')
        if (cameraRtsp && roiShowModal) {
            setImageLoader(true)
            dispatch(action.getLatestFrameByRtsp(cameraRtsp))
                .then((response) => {
                    if (response) {
                        setImagePath(`data:image/png;base64,${response}`);
                        setImageLoader(false)
                    }else {

                        setImagePath("");
                        setImageLoader(false)
                    }
                })
                .catch((error) => {
                    setImageLoader(false)
                        console.error("Error fetching latest frame:", error);
                        warningToast(error?.detail || "Something went Wrong");
                });
        } else {
            setImagePath("");
        }

    }, [cameraRtsp, roiShowModal]);  // Removed cameraFetchedById.rtsp to avoid extra calls

    useEffect(() => {
        if (usecaseValue?.value && camera?.id && imagePath && imagePath.length > 0) {
            const data = {
                camera_id: camera.id,
                result_type_id: usecaseValue.value
            };
            const img = new Image();
            img.src = imagePath;

            setRegions([])
            setRegionsStoreData([])
            img.onload = () => {
                const OriginalWidth = img.naturalWidth;
                const OriginalHeight = img.naturalHeight;

                dispatch(action.getCameraRois(data))
                    .then((response) => {
                        if (response?.length > 0) {

                            let formattedRegions = response.map((region, index) => {
                                if (!Array.isArray(region) || region.length !== 4) {
                                    return { x: 0, y: 0, width: 0, height: 0, new: false, data: { index }, isChanging: false };
                                }

                                let x1 = region[0][0]; // First point x1
                                let y1 = region[0][1]; // First point y1
                                let x2 = region[1][0]; // Second point x2
                                let y2 = region[2][1]; // Third point y2

                                return {
                                    x: (x1 / OriginalWidth) * 100 || 0,
                                    y: (y1 / OriginalHeight) * 100 || 0,
                                    width: ((x2 - x1) / OriginalWidth) * 100 || 0,
                                    height: ((y2 - y1) / OriginalHeight) * 100 || 0,
                                    new: false,
                                    data: { index },
                                    isChanging: false
                                };
                            });

                            setRegions(formattedRegions);

                        } else {
                            setRegions([]);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching latest frame:", error);
                        warningToast(error?.detail || "Something went wrong");
                    });
            };
        }
    }, [usecaseValue?.value, imagePath, camera?.id]);


    const close = () =>{
        setImagePath('')
        setRegions([])
        setRegionsStoreData([])
        dispatch(actions.clearCameraById());
        onHide()
    }
    const submit = () => {
        const data={
            camera_id: camera?.id,
            result_type_id: usecaseValue?.value,
            roi_list: regionsStoreData
        }

        dispatch(action.updateCameraRois(data))
            .then((response) => {
                if (response) {
                    close();
                }
            })
            .catch((error) => {
                close();
                console.error("Error fetching latest frame:", error);
                warningToast(error?.detail || "Something went Wrong");
            });
    }

    const handleUsecaseChange = (data) =>{
        setUsercaseValue(data)
    }

    const resetRegions = () => {
        setRegions([]);
        setRegionsStoreData([]);
        setUndoStack([]);
        setRedoStack([]);
    };

    const undoRegion = () => {
        const lastState = undoStack.pop();
        if (lastState) {
            setRedoStack(prev => [...prev, {regions, regionsStoreData}]);
            setRegions(lastState.regions);
            setRegionsStoreData(lastState.regionsStoreData);
        }
    };

    const redoRegion = () => {
        const redoState = redoStack.pop();
        if (redoState) {
            setUndoStack(prev => [...prev, {regions, regionsStoreData}]);
            setRegions(redoState.regions);
            setRegionsStoreData(redoState.regionsStoreData);
        }
    };

    const deleteAllRegions = () => {
        setRegions([]);
        setRegionsStoreData([]);
    };

    const handleZoom = event => {
        setScale(event.scale);
    };

    const handleRegionClick = (event, index) => {
        setCurReg(index);
    };

    const onChange = (reg = []) => { // Default to empty array
        if (!Array.isArray(reg)) {
            console.error("onChange received invalid regions data", reg);
            return;
        }

        const img = new Image();
        img.src = imagePath;

        img.onload = () => {
            const OrignalWidth = img.width;
            const OrignalHeight = img.height;

            let detection_data = reg.map(region => {
                if (
                    region.x == null || region.y == null ||
                    region.width == null || region.height == null
                ) {
                    return [null, null, null, null]; // Handle invalid cases
                }

                let x1 = region.x * (OrignalWidth / 100);
                let y1 = region.y * (OrignalHeight / 100);
                let x2 = (region.x + region.width) * (OrignalWidth / 100);
                let y2 = (region.y + region.height) * (OrignalHeight / 100);
                return [[x1, y1],[x2,y1],[x2, y2],[x1,y2] ];
            });


            setRegions(reg);
            setRegionsStoreData(detection_data);
            setUndoStack(prev => [...prev, { regions: reg, regionsStoreData: detection_data }]);
            setRedoStack([]);
        };
    };



    return (
        <>
            <Modal size="lg" show={roiShowModal} onHide={close}
                   // className={processingCameraModal ? "lower-z-index" : ""}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Roi Camera</Modal.Title>
                </Modal.Header>
                <BlockUi tag="div" blocking={false} color="#147b82">
                    <Modal.Body>

                        <Col sm={12} lg={6}>
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
                                isLoading={false}
                                isSearchable={false}
                                isMulti={false}
                                placeholder="Select Usecase"
                                className="select-react-dropdown"
                                value={usecaseValue}
                                onChange={handleUsecaseChange}
                                options={usercaseOptions}
                            />
                        </Col>

                        <BlockUi tag="div" blocking={imageLoader} color="#014f9f">
                        <Col xl={12} xs={12} md={12} lg={12} sm={12}>
                            <div className={'d-flex mt-3'}>
                                <ButtonGroup
                                    size="small"
                                    aria-label="Small outlined button group"
                                    className={"mb-3"}
                                >
                                    <Button color="secondary" onClick={resetRegions}><Refresh/></Button>
                                    <Button color="secondary" onClick={undoRegion}><Undo/></Button>
                                    <Button color="secondary" onClick={redoRegion}><Redo/></Button>
                                    <Button color="secondary" onClick={deleteAllRegions}><DeleteOutline/></Button>
                                </ButtonGroup>
                            </div>


                            <TransformWrapper
                                defaultScale={1}
                                defaultPositionX={200}
                                defaultPositionY={100}
                                initialScale={1}
                                onZoomChange={handleZoom}
                                pan={{disabled: true}}
                                wheel={{limitsOnWheel: true}}
                                options={{
                                    centerContent: true,
                                    limitToBounds: true,
                                    // maxScale: 2
                                }}
                            >
                                {({zoomIn, zoomOut, resetTransform, ...rest}) => (
                                    <React.Fragment>
                                        <div className="boundimage-full w-100" style={{margin: "0 auto"}}>
                                            <TransformComponent>
                                                <RegionSelect
                                                    regions={Array.isArray(regions) ? regions : []}
                                                    constraint
                                                    onChange={onChange}
                                                    onClick={handleRegionClick}
                                                    scale={scale}
                                                >
                                                    <img
                                                        style={{
                                                            maxWidth: "100%",
                                                            maxHeight: "90vh",
                                                            margin: "auto",
                                                            width: 752,
                                                            height: 470
                                                        }}
                                                        src={imagePath}
                                                        draggable={false}
                                                        width="100%"
                                                        height="100%"
                                                        alt=""
                                                    />
                                                </RegionSelect>
                                            </TransformComponent>
                                        </div>
                                    </React.Fragment>
                                )}
                            </TransformWrapper>
                        </Col>
                        </BlockUi>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={close}
                                className="btn btn-light btn-elevate">Cancel</Button>
                        <Button onClick={submit}
                                // disabled={processingCameraModal}
                                className="btn btn-primary btn-elevate">Submit</Button>
                    </Modal.Footer>
                </BlockUi>
            </Modal>

        </>
    );
}
