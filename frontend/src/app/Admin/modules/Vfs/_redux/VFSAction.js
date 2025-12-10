import { callTypes, VFSSlice } from "./VFSSlice";
import {
    getCaseById, getAllCase, addCase, addSuspect, getLicenseDetail, updateCaseapi, getSuspectJourneyByCaseId,
    getGenerateCaseReportByCaseId,
} from "./VFSAPI";
import { warningToast } from "../../../../../utils/ToastMessage";

const { actions } = VFSSlice;

export const fetchCase = (data) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  getAllCase(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.caseFetched(response.data));
      } else {
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find cases";
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchCaseById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getCaseById(id)
    .then((response) => {
        return  response.data;
    })
    .catch((error) => {
      // warningToast("Something went wrong");
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createCase = (caseData, user_id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return addCase(caseData)
    .then((response) => {
      if (response && response.isSuccess) {
        return  response.data;
      }
    })
    .catch((error) => {
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("something went wrong");
      }
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateCase = (caseData, user_id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
      return updateCaseapi(caseData)
      .then((response) => {
          return  response.data;
      })
      .catch((error) => {
        if (error.detail) {
          warningToast(error.detail);
        }
      })
}


export const getSuspectJourneyByCaseIds = (case_id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return getSuspectJourneyByCaseId(case_id)
        .then((response) => {
            return  response.data;
        })
        .catch((error) => {
            if (error.detail) {
                warningToast(error.detail);
            }
        })
}

export const getGenerateCaseReportByCaseIds = (case_id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return getGenerateCaseReportByCaseId(case_id)
        .then((response) => {
            return  response.data;
        })
        .catch((error) => {
            if (error.detail) {
                warningToast(error.detail);
            }
        })
}

export const addSuspects = (caseData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return addSuspect(caseData)
      .then((response) => {
          return  response.data;
      })
      .catch((error) => {
        if (error.detail) {
          warningToast(error.detail);
        } else {
          warningToast("something went wrong");
        }
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
};



export const getLicenseDetails = () => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  getLicenseDetail()
      .then((response) => {
        if (response && response.isSuccess) {
          dispatch(actions.licenseDetail(response.data));
        } else {
        }
      })
      .catch((error) => {
        error.clientMessage = "Can't find cases";
        if (error.detail) {
          warningToast(error.detail);
        } else {
          warningToast("Something went Wrong");
        }
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
};

