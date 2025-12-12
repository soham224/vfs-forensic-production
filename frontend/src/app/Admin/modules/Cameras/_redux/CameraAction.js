import { callTypes, CameraSlice } from "./CameraSlice";
import {
    getAllCamera,
    cameraByLocationID,
    getAllVideos,
    getAllUsecaseType,
    updateCameraUsecaseType, getCameraRtspById, getLatestFrameByRtsps, getCameraRoi, updateCameraRoi, checkCaseNameExist
} from "./CameraAPI";

const { actions } = CameraSlice;

export const fetchCamera = () => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  getAllCamera()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.cameraFetched(response.data));
      } else {
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find cameras";
      console.log("error:::", error)
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};


export const updateCameraUsecaseTypes = (data) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
    updateCameraUsecaseType(data)
    .then((response) => {
      if (response && response.isSuccess) {
          return response.data
      } else {
          throw new Error("Error getting camera details");
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find cameras";
      console.log("error:::", error)
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchCameraByLocationId = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return cameraByLocationID(id)
    .then((response) => {
      if (response && response.isSuccess) {
        return response.data
      } else {
        throw new Error("Error getting camera details");
      }
    })
    .catch((error) => {
      console.log("error:::", error)
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
export const fetchCameraRtspById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getCameraRtspById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        return response.data
      } else {
        throw new Error("Error getting camera details");
      }
    })
    .catch((error) => {
      console.log("error:::", error)
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
export const getLatestFrameByRtsp = (data) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getLatestFrameByRtsps(data)
    .then((response) => {
      if (response && response.isSuccess) {
        return response.data
      } else {
        throw new Error("Error getting camera details");
      }
    })
    .catch((error) => {
      console.log("error:::", error)
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const getAllVideo = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getAllVideos()
      .then((response) => {
        if (response && response.isSuccess) {
          return response.data
        } else {
          throw new Error("Error getting camera details");
        }
      })
      .catch((error) => {
        console.log("error:::", error)
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
};

export const getAllUsecaseTypes = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getAllUsecaseType()
      .then((response) => {
        if (response && response.isSuccess) {
          return response.data
        } else {
          throw new Error("Error getting Usecase type");
        }
      })
      .catch((error) => {
        console.log("error:::", error)
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
};
export const getCameraRois = (data) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return getCameraRoi(data)
        .then((response) => {
            if (response && response.isSuccess) {
                return response.data
            } else {
                throw new Error("Error getting camera details");
            }
        })
        .catch((error) => {
            console.log("error:::", error)
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};
export const updateCameraRois = (data) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return updateCameraRoi(data)
        .then((response) => {
            if (response && response.isSuccess) {
                return response.data
            } else {
                throw new Error("Error getting camera details");
            }
        })
        .catch((error) => {
            console.log("error:::", error)
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};


export const checkCaseNameExists = (name) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return checkCaseNameExist(name)
        .then((response) => {
            if (response && response.isSuccess) {
                return response.data
            } else {
                throw new Error("Error getting camera details");
            }
        })
        .catch((error) => {
            console.log("error:::", error)
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};
