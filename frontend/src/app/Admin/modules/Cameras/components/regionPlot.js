import React, {Component, createRef, Fragment} from "react";
import { Button } from "reactstrap";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {successToast, warningToast} from "../../../../../utils/ToastMessage";
import {Col, Form, Row} from "react-bootstrap";
import Select from "react-select";
import {customStyles} from "../../../../../utils/CustomStyles";
import {updateCameraRoi} from "../_redux/CameraAPI";
import {Switch} from "@mui/material";

class RegionPlot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewRegionPlotModal: props.viewRegionPlotModal,
            isDown: false,
            previousPointX: "",
            previousPointY: "",
            coordinates: [],
            roi_coordinates: [],
            updatedCoordinates: [],
            imagePath: props.imagePath,
            regionContainsPlot: false,
            blockUI: false,
            disableSaveBtn: true,
            disableUpdateBtn: true,
            showAllploted: false,
            checkboxShowAllROI: false,
            crop: { width:100 },
            originalSize : { width: 0, height: 0 },


            usecaseValue : [],
            usecaseLoader :false,
            usercaseOptions :[
                {label : 'face' , value : 1},
                {label : 'person' , value : 2},

            ],
        };
        this.imgRef = createRef();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!nextProps.viewRegionPlotModal) {
            this.setState({
                coordinates: [],
                crop: {  width: 100 }, // Reset crop
            });
        }
        this.setState({
            viewRegionPlotModal: nextProps.viewRegionPlotModal
        });
    }

    componentDidUpdate(prevProps) {
        const {imagePath, cameraParam} = this.props;

        if (prevProps.imagePath !== imagePath) {
            this.setState({imagePath});

        if (cameraParam && cameraParam.coordinates) {
                this.setState({canvas: imagePath}, () => {
                    const image = new Image();
                    image.src = imagePath;

                });
        }
        }
    }


    drawROI = (coordinates,naturalWidth, naturalHeight ,event) => {
        if (coordinates && coordinates.length > 0) {
            this.setState(
                {
                    regionContainsPlot: true,
                    imageHasPlotPoint: true,
                    roiCoordinatesObjFromAPI: coordinates
                },
                () => {
                    let btn = document.getElementById("0button");
                    if (btn) {
                        btn.click();
                    }

                }
            );

            if (coordinates) {
                let cor = coordinates;
                let initalPoint = cor[0];
                let thirdPoint = cor[2];


                let x = initalPoint[0];
                let y = initalPoint[1];
                let w = Math.abs(thirdPoint[0] - initalPoint[0]);
                let h = Math.abs(thirdPoint[1] - initalPoint[1]);

                const scaleX = naturalWidth / event.width;
                const scaleY = naturalHeight  / event.height;


                const adjustedCrop = {
                    x: x / scaleX,
                    y: y / scaleY,
                    width: w / scaleX,
                    height: h / scaleY,
                    unit: "px",
                };

                this.setState({
                    crop: adjustedCrop,
                    blockUI: false,
                    coordinateId: this.props.cameraParam.id
                });

            } else {
                this.setState({
                    crop: [],
                    regionContainsPlot: false,
                    imageHasPlotPoint: false,
                    blockUI: false
                });
            }
        }

    };

    cropUpdateImage = () => {
        let coordinate = this.state.coordinates;
        if (coordinate.length > 0) {
            this.setState({ blockUI: true });

            setTimeout(() => {
                let param = {
                    roi: coordinate, // Pass new coordinates
                    id: this.props.cameraParam?.id
                };

                updateCameraRoi(param).then(response => {
                    if (response && response.isSuccess) {
                        this.setState(
                            {
                                imageHasPlotPoint: true,
                                blockUI: false,
                                disableSaveBtn: true,
                                disableUpdateBtn: true
                            },
                            () => {
                                successToast("Co-ordinates saved ");
                            }
                        );
                    }
                });
            }, 500);
        } else {
            warningToast("Please select region");
        }
    };

    handleCrop = crop => {
        this.setState({
            crop: crop
        });
    };

     onImageLoad = (event) => {
        const { naturalWidth, naturalHeight } = event.target;

        this.setState({originalSize : { width: naturalWidth, height: naturalHeight }})

        this.imgRef.current = event.target;
        if(this.props.cameraParam?.coordinates && this.props.cameraParam?.coordinates.length > 0){
            this.drawROI(this.props.cameraParam?.coordinates,naturalWidth, naturalHeight ,event.target);
        }

    };


    onCropComplete = (crop) => {
        let coordinate = [];

        const { originalSize } = this.state;
        if (!this.imgRef.current) return;

        const scaleX = originalSize?.width / this.imgRef.current.width;
        const scaleY = originalSize?.height / this.imgRef.current.height;

        const croppedData = {
            x: crop.x * scaleX,
            y: crop.y * scaleY,
            width: crop.width * scaleX,
            height: crop.height * scaleY,
        };

        let x1 = croppedData.x;
        let y1 = croppedData.y;
        let w = croppedData.width;
        let h = croppedData.height;


        let z1 = [x1, y1];
        let z2 = [x1 + w, y1];
        let z3 = [x1 + w, y1 + h];
        let z4 = [x1, y1 + h];
        coordinate = [z1, z2, z3, z4];

        this.setState({
            coordinates: coordinate, // Store new ROI
            disableUpdateBtn: false,
            disableSaveBtn: false
        });

        this.makeClientCrop(crop); // Save cropped image preview
    };


    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                "newFile.jpeg"
            );
            this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = this.state.canvas;
        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                blob => {
                    if (!blob) {
                        //reject(new Error('Canvas is empty'));
                        return;
                    }
                    blob.name = fileName;
                    window.URL.revokeObjectURL(this.fileUrl);
                    this.fileUrl = window.URL.createObjectURL(blob);
                    resolve(this.fileUrl);
                },
                "image/jpeg",
                1
            );
        });
    }

    plotSpecificCoordinate = (e, key) => {
        this.setState({
            coordinateId: key.id,
            specificCoordinates: key.coordinates,
            regionContainsPlot: true
        });

        this.setState(
            {
                coordinates: [],
                finalCoordinates: [],
                roi_coordinates: []
            }
        );
        // },1000)
    };
    onShowAllPlotPoints = showAllploted => {
        this.setState({
            showAllploted: showAllploted.target.checked
        });
        if (showAllploted.target.checked) {
            this.setState({
                checkboxShowAllROI: showAllploted.target.checked
            });
            let allPlots = this.state.roiCoordinatesObjFromAPI;
            for (let i = 0; i < allPlots.length; i++) {
                let coordinates = allPlots[i].coordinates;

                if (coordinates) {
                    const canvas = this.state.canvas;
                    let ctx = canvas.getContext("2d");
                    // ctx.fillStyle = '#f00';
                    ctx.beginPath();
                }
            }
        } else {
            // this.getCameraROIById(this.props.cameraParam.id);
            this.setState({
                checkboxShowAllROI: false
            });
        }
    };
    deleteUpdateCoordinate2 = () => {
        this.setState({
            disableSaveBtn: true,
            disableUpdateBtn: true,
            coordinates: [], // Clear coordinates
            imagePath: this.props.imagePath,
            crop: { width: 100 }, // Reset crop
            imageHasPlotPoint: false,
        });
    };

    onSave = () => {
        let coordinate = this.state.coordinates;
        if (coordinate.length > 0) {
            this.setState({ blockUI: true });

            setTimeout(() => {
                let cameraCor = coordinate;
                let param = {
                    roi: coordinate,
                    id: this.props.cameraParam?.id, // Convert ID to string
                };

                updateCameraRoi(param).then(response => {
                    if (response && response.isSuccess) {
                        this.setState(
                            {
                                imageHasPlotPoint: true,
                                blockUI: false,
                                disableSaveBtn: true,
                                disableUpdateBtn: true
                            },
                            () => {
                                successToast("Co-ordinates saved ");
                            }
                        );
                    }
                });
            }, 500);
        } else {
            warningToast("Please select region");
        }
    };

    handleUsecaseChange = (data) => {
        this.setState({
            usecaseValue: data
        })
    }

    //
    render() {
        return (
            <>
                <Row>
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
                            isLoading={this.state.usecaseLoader}
                            isSearchable={false}
                            isMulti={false}
                            placeholder="Select Usecase"
                            className="select-react-dropdown"
                            value={this.state.usecaseValue}
                            onChange={this.handleUsecaseChange}
                            options={this.state.usercaseOptions}
                        />
                    </Col>
                </Row>

                {this.state.usecaseValue && Object.keys(this.state.usecaseValue).length > 0 && (
                    <div>
                        {!this.state.checkboxShowAllROI && (
                            <div className="align-left">
                                {this.state.roiCoordinatesObjFromAPI &&
                                    this.state.roiCoordinatesObjFromAPI.map((key, value) => (
                                        <Button
                                            className="mr-1 ml-1"
                                            id={value + "button"}
                                            onClick={(e) => this.plotSpecificCoordinate(e, key)}
                                        >
                                            Co-ordinates {value}
                                        </Button>
                                    ))}
                            </div>
                        )}

                        <p className="align-left">
                            Show all plotted points{" "}
                            <Switch
                                checked={this.state.showAllploted}
                                onChange={this.onShowAllPlotPoints}
                                color="primary"
                                name="showAllploted"
                            />
                        </p>
                    </div>
                )}

                {this.state.usecaseValue && Object.keys(this.state.usecaseValue).length > 0 &&
                <div style={{ textAlign: "center" }}>
                    <h2>Image Crop</h2>
                    <div style={{ marginTop: "20px" }}>
                        <ReactCrop
                            crop={this.state.crop}
                            onChange={(newCrop) => this.handleCrop(newCrop)}
                            onComplete={this.onCropComplete}
                        >
                            <img
                                src={this.props.imagePath}
                                alt="Crop me"
                                onLoad={this.onImageLoad}
                            />
                        </ReactCrop>
                    </div>

                    <div id="imageId" style={{ marginTop: "20px", textAlign: "center" }}>
                        {!this.state.imageHasPlotPoint ? (
                            <>
                                <Button
                                    style={{ marginRight: "5px" }}
                                    disabled={this.state.disableSaveBtn}
                                    onClick={this.onSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    style={{ marginRight: "5px" }}
                                    onClick={this.deleteUpdateCoordinate2}
                                >
                                    Reset Canvas
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    style={{ marginRight: "5px" }}
                                    disabled={this.state.disableUpdateBtn}
                                    onClick={this.cropUpdateImage}
                                >
                                    Update
                                </Button>
                                <Button
                                    style={{ marginRight: "5px" }}
                                    onClick={this.deleteUpdateCoordinate2}
                                >
                                    Reset Canvas
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                }
            </>


        );
    }
}

export default RegionPlot;
