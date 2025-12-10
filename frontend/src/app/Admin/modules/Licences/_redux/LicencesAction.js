import { callTypes, LicencesSlice } from "./LicencesSlice";
import {
  getAllLocation,
  getLocationById,
  addLocation,
  updateLocation,
} from "./LicencesAPI";
import { successToast } from "../../../../../utils/ToastMessage";
import * as moment from "moment";

const { actions } = LicencesSlice;

export const fetchLocation = () => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  getAllLocation()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.locationFetched(response.data));
      } else {
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find locations";
      console.log("error:::" ,error)
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchLocationById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getLocationById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.locationFetchedById(response.data));
      } else {
        throw new Error("Error getting location details");
      }
    })
    .catch((error) => {
      console.log("error:::" ,error)
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createLocation = (locationData, user_id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    location_name: locationData.locationName,
  };

  return addLocation(data)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(actions.addNewLocation(data));

        let data1 = {
          notification_message: "Location Added : " + locationData.locationName,
          user_id: user_id,
          type_of_notification: "string",
          status: true,
          is_unread: true,
        };
      }
    })
    .catch((error) => {
      console.log("error:::" ,error)
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const locationUpdate = (locationData, user_id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    location_name: locationData.locationName || locationData.location_name,
    id: locationData.id,
    company_id: user_id,
    status: true,
    updated_date: moment().toISOString(),
  };

  return updateLocation(data)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(actions.updatedExistingLocation(data));
        successToast("Location Updated Successfully");
      }
    })
    .catch((error) => {
      console.log("error:::" ,error)
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
