import { request } from "../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../enums/http.methods";

const GET_ALL_CAMERA = "/get_all_camera_rtsp";
const GET_CAMERA_BY_LOCATION_ID = "/get_cameras_rtsp_by_location_id";
const GET_ALL_VIDEOS="/get_all_videos"
const GET_RESULT_TYPE="/get_result_type"
const UPDATE_CAMERA_RESULT_TYPE="/update_camera_result_type"
const GET_CAMERA_RTSP_BY_ID="/get_camera_rtsp_by_id"
const GET_LATEST_FRAME_BY_RTSP="/get_latest_frame_by_rtsp"
const GET_CAMERA_ROI="/get_camera_roi"
const UPDATE_CAMERA_ROI="/update_camera_roi"
const CASE_DUPLICATE_CHECK="/case_duplicate_check"


export async function getAllCamera() {
  return await request({
    endpoint: GET_ALL_CAMERA,
    method: HttpRequest.GET
  });
}

export async function cameraByLocationID(location_id) {
  return await request({
    endpoint: GET_CAMERA_BY_LOCATION_ID,
    method: HttpRequest.POST,
    body: location_id
  });
}

export async function getAllVideos() {
  return await request({
    endpoint: GET_ALL_VIDEOS,
    method: HttpRequest.GET,
  });
}

export async function getAllUsecaseType() {
  return await request({
    endpoint: GET_RESULT_TYPE,
    method: HttpRequest.GET,
  });
}
export async function updateCameraUsecaseType(data) {
  return await request({
    endpoint: UPDATE_CAMERA_RESULT_TYPE,
    method: HttpRequest.POST,
    body: data,
  });
}
export async function getCameraRtspById(id) {
  return await request({
    endpoint: GET_CAMERA_RTSP_BY_ID + "?camera_rtsp_id=" + id,
    method: HttpRequest.GET,
  });
}

export async function getLatestFrameByRtsps(data) {
  return await request({
    endpoint: GET_LATEST_FRAME_BY_RTSP + "?rtsp_link=" + data,
    method: HttpRequest.POST,
  });
}
export async function getCameraRoi(data) {
  return await request({
    endpoint: GET_CAMERA_ROI,
    method: HttpRequest.POST,
    body: data,
  });
}
export async function updateCameraRoi(data) {
  return await request({
    endpoint: UPDATE_CAMERA_ROI,
    method: HttpRequest.POST,
    body: data,
  });
}
export async function checkCaseNameExist(data) {
  return await request({
    endpoint: CASE_DUPLICATE_CHECK,
    method: HttpRequest.POST,
    body: data,
  });
}

