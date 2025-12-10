import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "../app/Admin/modules/Auth/_redux/authRedux";

import { LocationSlice } from "../app/Admin/modules/Locations/_redux/LocationSlice";

import userReducer from "./subscriptionReducer";

import {CameraSlice} from "../app/Admin/modules/Cameras/_redux/CameraSlice";
import {VFSSlice} from "../app/Admin/modules/Vfs/_redux/VFSSlice";


export const rootReducer = combineReducers({
  auth: auth.reducer,

  location: LocationSlice.reducer,
  camera: CameraSlice.reducer,
  vfs: VFSSlice.reducer,
  subscription: userReducer,
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
