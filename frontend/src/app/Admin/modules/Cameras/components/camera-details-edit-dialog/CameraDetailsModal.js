import React, {useState} from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { CameraDetailsTable } from "./CameraDetailsTable";
import SweetAlert from "react-bootstrap-sweetalert";
import { warningToast } from "../../../../../../utils/ToastMessage";
import { useDispatch} from "react-redux";
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import {addDeploymentCamera} from "../../_redux/DeployNowApi";
import AddCameraModal from "./AddCameraModal";
import * as actions from "../../_redux/CameraAction";
import {useNavigate} from "react-router-dom";


export default function CameraDetailsModal({ showCamera, setCamera, job }) {
  const dispatch = useDispatch();
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [cameraDetails, setCameraDetails] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cameraDetailsBtnFlag, setCameraDetailsBtnFlag] = useState(true);
  const [addCamSuccess, setAddCamSuccess] = useState(false);
  const [loaderState, setLoaderState] = useState(false);
  const navigate = useNavigate();
  const callAddCameraAPI = async () => {
    try {
      if (cameraDetails) {
        setLoaderState(true);
          let cameraAddedAPI = true;
          for (let i = 0; i < cameraDetails.length; i++) {
            let camera = cameraDetails[i];
            const res = await addDeploymentCamera(camera);
            if (res.isSuccess) {
              if (i === cameraDetails.length - 1) {
                if (cameraAddedAPI) {
                  setShowSuccess(true);
                  setLoaderState(false);
                  dispatch(actions.fetchCamera());
                  setCameraDetails([])
                  setShowSuccess(false)
                  setCamera(false);
                  setCameraDetailsBtn();
                }
              }
            } else {
              setLoaderState(false);
              cameraAddedAPI = false;
              setCameraDetails([])
              setShowSuccess(false)
              setCamera(false);
              throw Error("Something went wrong while adding a camera");
            }
          }

      }
    } catch (error) {
      setLoaderState(false);
      setAddCamSuccess(false);
      setCameraDetails([])
      setShowSuccess(false)
      setCamera(false);
      dispatch(actions.fetchCamera());
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
    } finally {
    }
  };

  function setCameraDetailsBtn() {
    if (cameraDetails && cameraDetails.length > 0) {
      setCameraDetailsBtnFlag(false);
    } else {
      setCameraDetailsBtnFlag(true);
    }
  }

  const removeCameraData = (data) => {
    let finalObj = [];
    for (let i = 0; i < cameraDetails.length; i++) {
      let obj = cameraDetails[i];
      if (JSON.stringify(obj) === JSON.stringify(data)) {
      } else {
        finalObj.push(obj);
      }
    }
    setCameraDetails(finalObj);
    setAddCamSuccess(false);
    if (finalObj && finalObj.length > 0) {
      setCameraDetailsBtnFlag(false);
    } else {
      setCameraDetailsBtnFlag(true);
    }
  };
  const handleHide = () => {
    setCamera(false);
    setCameraDetails([])
  };
  return (
      <>
        <Modal
            size="lg"
            className="mt-8"
            show={showCamera}
            onHide={() => {
              handleHide();
            }}
            backdrop="static"
            aria-labelledby="example-modal-sizes-title-lg"
        >
          <BlockUi tag="div" blocking={loaderState} color="#147b82">
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                {" "}
                Camera Details{" "}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {!showAddCamera && (
                  <Row className="mt-5">
                    <Col xl={6} xs={12} md={12} lg={12} sm={12}>
                      {!cameraDetails.length && !showAddCamera && (
                          <>
                            Click on <b>Add Camera</b> button to add new cameras
                          </>
                      )}
                    </Col>
                    <Col
                        xl={6}
                        xs={12}
                        md={12}
                        lg={12}
                        sm={12}
                        className="add-camera mb-2"
                    >
                      <button
                          type="submit"
                          onClick={() => setShowAddCamera(!showAddCamera)}
                          className="btn btn-primary btn-elevate"
                      >
                        Add Camera
                      </button>
                    </Col>
                  </Row>
              )}

              {showAddCamera ? (
                  <AddCameraModal
                      setCameraDetailsBtn={setCameraDetailsBtn}
                      cameraDetailsObj={cameraDetails}
                      show={showAddCamera}
                      setShow={setShowAddCamera}
                      job={job}
                      setCameraDetails={setCameraDetails}
                      setAddCamSuccess={setAddCamSuccess}
                  />
              ) : null}
              <CameraDetailsTable
                  removeCameraData={removeCameraData}
                  cameraDetails={cameraDetails}
                  setCameraDetails={setCameraDetails}
                  job={job}
              />
            </Modal.Body>
            {!showAddCamera ? (
                <Modal.Footer>
                  <button
                      disabled={cameraDetailsBtnFlag}
                      type="button"
                      onClick={() => {
                        if (addCamSuccess) {
                          callAddCameraAPI();
                        } else handleHide();
                      }}
                      className="btn btn-primary btn-elevate"
                  >
                    Finish
                  </button>
                </Modal.Footer>
            ) : null}
          </BlockUi>
          <SweetAlert
              success
              showConfirm
              closeOnClickOutside={false}
              confirmBtnText={"Okay"}
              confirmBtnBsStyle="primary"
              title={"Camera Added Successfully"}
              show={showSuccess && addCamSuccess}
              onConfirm={() => navigate("/camera")}
          />
        </Modal>
      </>
  );
}
