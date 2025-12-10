import { Modal } from "react-bootstrap";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { warningToast } from "../../../../../../utils/ToastMessage";
import { BootstrapInput } from "../../../../../../utils/BootstrapInput";
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import {checkRTSPURL, getEnabledLocationList} from "../../_redux/DeployNowApi";
import {NativeSelect, Switch} from "@mui/material";
import Select from "react-select";

const CameraSchema = Yup.object().shape({
  cameraName: Yup.string().required("Camera name required"),
  cameraResolution: Yup.string().required("Camera Resolution required"),
  processFPS: Yup.number()
      .min(3, "Process FPS value must be greater than 2")
      .required("Process FPS is required"),
  cameraIP: Yup.string()
      .matches(
          /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
          "Please enter valid IP address"
      )
      .required("Camera IP required"),
});

const camera = {
  cameraName: "",
  cameraResolution: "640:640",
  processFPS: "",
  cameraLocation: "",
  cameraIP: "",
};

export default function AddCameraModal({
                                 setCameraDetailsBtn,
                                 cameraDetailsObj,
                                 show,
                                 setShow,
                                 job,
                                 setCameraDetails,
                                 setAddCamSuccess,
                               }) {
  const [rtspUrl, setRTSPUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [validateUrl, setValidateUrl] = React.useState({
    isTouched: false,
    isValid: false,
    msg: (
        <>
          Please enter <b>RTSP URL</b>
        </>
    ),
  });
  const [deploymentTypeOptions, setDeploymentTypeOptions] = React.useState([]);
  const [state, setState] = React.useState({
    cameraLocation: "Select Location",
  });
  const [checked2, setChecked2] = React.useState(false);
  const [loaderState, setLoaderState] = React.useState(false);

  const saveCameraDetails = async (camera) => {
    try {
      if (deploymentTypeOptions.length) {
        setLoading(true);

          setLoading(false);
          let obj = {
            rtsp_url: rtspUrl,
            camera_name: camera.cameraName,
            camera_resolution: camera.cameraResolution,
            process_fps: camera.processFPS,
            location_id: state.cameraLocation,
            camera_ip: camera.cameraIP,
            roi_type: checked2,
          };

          let isContainSameData = false;
          for (let i = 0; i < cameraDetailsObj.length; i++) {
            let cameraObj = cameraDetailsObj[i];
            if (JSON.stringify(cameraObj) === JSON.stringify(obj)) {
              isContainSameData = true;
              break;
            }
          }
          if (isContainSameData) {
            warningToast("Camera details already added");
          } else {
            cameraDetailsObj.push(obj);
            setCameraDetails(cameraDetailsObj);
            setAddCamSuccess(true);
            setShow(!show);
            setCameraDetailsBtn();
          }

      }
    } catch (error) {
      setAddCamSuccess(false);
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setState({ ...state, [e.target.name]: value });
  };

  const validateRTSPURL = async () => {
    setLoaderState(true);
    const { data, isSuccess } = await checkRTSPURL(rtspUrl);
    if (!isSuccess) {
      setLoaderState(false);
      warningToast("Something went wrong while validating rtsp url");
      setValidateUrl({
        isTouched: true,
        isValid: false,
        msg: "something went wrong while validating RTSP URL",
      });
      return false;
    } else if (!data) {
      setLoaderState(false);
      setValidateUrl({
        isTouched: true,
        isValid: false,
        msg: (
            <>
              Please enter valid <b>RTSP URL</b>
            </>
        ),
      });
      return false;
    } else {
      setLoaderState(false);
      setValidateUrl({
        isTouched: true,
        isValid: true,
        msg: (
            <>
              Entered <b>RTSP URL</b> is valid
            </>
        ),
      });
      return true;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoaderState(true);
        const { data, isSuccess } = await getEnabledLocationList();
        if (isSuccess) {
          setLoaderState(false);
          setDeploymentTypeOptions(data);
          setState({ ...state, cameraLocation: data[0].id });
        } else {
          setLoaderState(false);
          warningToast("Error getting deployment types");
        }
      } catch (error) {
        setLoaderState(false);
        if (error.detail) {
          warningToast("Please Add location Before Camera");
        } else {
          warningToast("Something went Wrong");
        }
      }
    })();
    // eslint-disable-next-line
  }, []);

  function handleChange2(check, e) {
    setChecked2((prev) => !prev);
    const value = e.target.value;
    setState({ ...state, [e.target.name]: value });
  }

  return (
      <Formik
          className=""
          enableReinitialize={true}
          initialValues={camera}
          validationSchema={CameraSchema}
          onSubmit={saveCameraDetails}
      >
        {({ handleSubmit }) => (
            <>
              <BlockUi tag="div" blocking={loaderState} color="#147b82">
                <Modal.Body className="overlay overlay-block cursor-default p-0">
                  {loading ? (
                      <>
                        <div className="overlay-layer bg-transparent">
                          <div className="spinner spinner-lg spinner-success" />
                        </div>
                        <div className="w-100 text-center">
                          <b className="d-block" style={{ paddingTop: 60 }}>
                            Adding camera details
                          </b>
                        </div>
                      </>
                  ) : (
                      <Form className="form form-label-right">
                        <div className="form-group row">
                          {/* RTSP URL */}
                          <div className="col-lg-12">
                            <label>Enter RTSP URL</label>
                            <input
                                type="text"
                                className={`form-control${
                                    validateUrl.isTouched && validateUrl.isValid
                                        ? " is-valid"
                                        : `${validateUrl.isTouched ? " is-invalid" : ""}`
                                }`}
                                style={{ height: '38px' }}
                                name="rtspUrl"
                                placeholder="Enter RTSP URL To Validate"
                                value={rtspUrl}
                                onChange={(e) => setRTSPUrl(e.target.value)}
                                onBlur={validateRTSPURL}
                            />
                            <div
                                className={`${
                                    validateUrl.isTouched && validateUrl.isValid
                                        ? " valid-feedback"
                                        : `${
                                            validateUrl.isTouched
                                                ? " invalid-feedback"
                                                : "feedback"
                                        }`
                                }`}
                            >
                              {validateUrl.msg}
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          {/* Camera Name */}
                          <div className="col-lg-4">
                            <Field
                                name="cameraName"
                                // component={Input}
                                placeholder="Camera Name"
                                label="Camera Name"
                                disabled={!validateUrl.isValid}
                                style={{ height: '38px' }}
                            />
                          </div>
                          {/* Camera Resolution */}
                          <div className="col-lg-4">
                            <Select
                                name="cameraResolution"
                                value={{ value: "640:640", label: "640:640" }}
                                options={[{ value: "640:640", label: "640:640" }]}
                                isDisabled={true}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '38px',
                                        height: '38px'
                                    })
                                }}
                            />
                          </div>
                          <div className="col-lg-4">
                            <Field
                                name="processFPS"
                                // component={Input}
                                placeholder="process FPS"
                                label="process FPS"
                                disabled={!validateUrl.isValid}
                                style={{ height: '38px' }}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-lg-4">
                            <label className="mb-2">Select Camera Location</label>
                            <NativeSelect
                                className={"mt-1"}
                                disabled={!validateUrl.isValid}
                                value={state.cameraLocation}
                                onChange={handleChange}
                                name="cameraLocation"
                                input={<BootstrapInput name="cameraLocation" style={{ height: '38px' }} />}
                            >
                              {deploymentTypeOptions?.length ? (
                                  deploymentTypeOptions.map((val) => (
                                      <option value={val.id}>{val.location_name}</option>
                                  ))
                              ) : (
                                  <option value={"Select Type"}>
                                    Select Camera Location
                                  </option>
                              )}
                            </NativeSelect>
                            {!deploymentTypeOptions?.length && (
                                <p style={{ color: "red", fontSize: "12px" }}>
                                  Please Add Location
                                </p>
                            )}
                          </div>
                          {/*Process IP*/}
                          <div className="col-lg-4">
                            <label className="mb-2">Camera IP</label>
                            <Field
                                name="cameraIP"
                                // component={Input}
                                placeholder="Camera IP"
                                label="Camera IP"
                                disabled={!validateUrl.isValid}
                                style={{ height: '38px' }}
                            />
                          </div>
                          {/* ROI_TYPE */}
                          <div className="col-lg-4">
                            <label className="mb-2">ROI Type (allow multiple)</label>
                            <div className="mt-2">
                              <Switch
                                  color="primary"
                                  checked={checked2}
                                  name="roi_type"
                                  onChange={(e) => handleChange2(checked2, e)}
                              />
                            </div>
                          </div>
                        </div>
                      </Form>
                  )}
                </Modal.Body>
              </BlockUi>
              {!loading && (
                  <Modal.Footer>
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="btn btn-light btn-elevate"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={() => handleSubmit()}
                        className="btn btn-primary btn-elevate"
                    >
                      Save
                    </button>
                  </Modal.Footer>
              )}
            </>
        )}
      </Formik>
  );
}
