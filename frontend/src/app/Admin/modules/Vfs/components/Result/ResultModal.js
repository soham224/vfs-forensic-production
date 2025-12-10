import React, {useEffect,  useState} from "react";
import {Button, Modal} from "react-bootstrap";
import ImagesControl from "./ImagesControl";
import moment from "moment";


function ResultModal({
                       flag,
                       modalShow,
                       handleClose,
                       currentImageIndex,
                       modalData,
                     histogram,resultDataLoading
                     }) {
    const [transformedData, setTransformedData] = useState([]);



    useEffect(() => {
        const transformData = () => {
            let data = [];

            if (modalData) {
                // Extract label data dynamically
                let labelInfo = "-";
                if (modalData?.label_count && typeof modalData?.label_count === "object") {
                    const labelKey = Object.keys(modalData.label_count)[0]; // Get the key (e.g., 'object_left_behind')
                    const labelValue = modalData.label_count[labelKey] // Get the key (e.g., 'object_left_behind')
                     labelInfo = `${labelKey.replace(/_/g, " ")}: ${labelValue}`; // Replace underscores with spaces
                }

                data = {
                    FileName: modalData?.file_name || "",
                    Time: modalData?.created_date
                        ? moment.utc(modalData?.created_date).local().format("DD MMMM YYYY, HH:mm:ss")
                        : "-",
                    camera: modalData?.cameras_rtsp?.camera_name || "",
                    Location: modalData?.cameras_rtsp?.location?.location_name || "-",
                    label: labelInfo, // Updated label field
                };
            }


            if(Object.keys(data).length > 0 && Object.keys(modalData).length > 0){
                setTransformedData(data);
            }
        };

        transformData();
    }, [modalData]);

    const propertiesToShow =  [
        "Location",
        "camera",
        "label",
        "FileName", "Time",

    ];

  return (
      <>
        <Modal
            show={modalShow}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            scrollable={false}
            size="xl"
            style={{ maxHeight: "-webkit-fill-available" }}
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">{"Result"}</Modal.Title>
            </Modal.Header>
          <Modal.Body>

              {transformedData &&
                  modalData &&
                  Object.keys(transformedData).length > 0 &&
                  Object.keys(modalData).length > 0 && (
                      <>
                          <ImagesControl
                              src={
                                  flag === "media" && histogram
                                      ? modalData?.url
                                      : flag === "result" && histogram
                                          ? modalData?.[0]?.media?.url
                                          : modalData?.[currentImageIndex]?.media?.url
                              }
                              regions={
                                  histogram
                                      ? modalData?.[0]?.regions || []
                                      : modalData?.[currentImageIndex]?.regions || []
                              }
                              propertiesToShow={propertiesToShow}
                              histogram={histogram}
                              modalLoading={false}
                              resultDataLoading={resultDataLoading}
                              modalData={modalData}
                              currentImageIndex={currentImageIndex}
                              transformedData={transformedData}
                          />
                      </>
                  )}

          </Modal.Body>

          <Modal.Footer>
              <Button onClick={handleClose} variant="secondary" size={'sm'}>
                  Close
              </Button>
          </Modal.Footer>
        </Modal>
      </>
  );
}

export default ResultModal;

