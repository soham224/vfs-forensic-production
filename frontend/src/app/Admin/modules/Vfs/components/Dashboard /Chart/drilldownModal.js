import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import DrillDownImagesControl from "./drilldownImagesControl";

function DrillDownResultModal({
                         modalShow,
                         handleClose,
                         modalData,
                         currentImageIndex, // This prop is now properly passed
                         handleNextClick, // Handler passed from parent
                         handlePrevClick, // Handler passed from parent
                         histogram,
                         resultDataLoading,
                     }) {
    const [transformedData, setTransformedData] = useState([]);

    useEffect(() => {
        const transformData = () => {
            let data = {};

            if (modalData && modalData[currentImageIndex]) {
            //     // Extract label data dynamically
                let labelInfo = "-";
                if (modalData[currentImageIndex]?.label_count && typeof modalData[currentImageIndex]?.label_count === "object") {
                    const labelKey = Object.keys(modalData[currentImageIndex].label_count)[0];
                    const labelValue = modalData[currentImageIndex].label_count[labelKey];
                    labelInfo = `${labelKey.replace(/_/g, " ")}: ${labelValue}`;
                }

                data = {
                    FileName: modalData[currentImageIndex]?.file_name || "",
                    Time: modalData[currentImageIndex]?.created_date
                        ? moment.utc(modalData[currentImageIndex]?.created_date).local().format("DD MMMM YYYY, HH:mm:ss")
                        : "-",
                    camera: modalData[currentImageIndex]?.cameras_rtsp?.camera_name || "",
                    Location: modalData[currentImageIndex]?.cameras_rtsp?.location?.location_name || "-",
                    label: labelInfo, // Updated label field
                };

            }
            //
            setTransformedData(data);
        };

        transformData();
    }, [modalData, currentImageIndex]);

    const propertiesToShow = ["Location", "camera", "label", "FileName", "Time"];

    return (
        <Modal
            show={modalShow}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="xl"
            style={{ maxHeight: "-webkit-fill-available" }}
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">Result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {transformedData && modalData && Object.keys(transformedData).length > 0 && Object.keys(modalData).length > 0 && (
                    <DrillDownImagesControl
                        src={
                            histogram
                                ? modalData[currentImageIndex]?.[0]?.media?.url
                                : modalData[currentImageIndex]?.media?.url
                        }
                        regions={
                            modalData[currentImageIndex]?.regions || []
                        }
                        propertiesToShow={propertiesToShow}
                        histogram={histogram}
                        modalLoading={false}
                        resultDataLoading={resultDataLoading}
                        modalData={modalData}
                        currentImageIndex={currentImageIndex}
                        transformedData={transformedData}
                    />
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={handlePrevClick} variant="secondary" size={"sm"} disabled={currentImageIndex === 0}>
                    Previous
                </Button>
                <Button onClick={handleNextClick} variant="secondary" size={"sm"} disabled={currentImageIndex === modalData.length - 1}>
                    Next
                </Button>
                <Button onClick={handleClose} variant="secondary" size={"sm"}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DrillDownResultModal;
