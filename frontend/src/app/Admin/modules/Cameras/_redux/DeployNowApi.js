import { request } from "../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../enums/http.methods";
import {ADMIN_ROLE, SUPERVISOR_ROLE} from "../../../../../enums/constant";

const GET_ALL_DEPLOYMENT_TYPE = "/get_all_deployment_type";
const ADD_DEPLOYMENT_JOB = "/add_deployment_job";
const ADD_DEPLOYMENT_RTSP_JOB = "/add_deployment_rtsp_job";
const CHECK_RTSP_URL = "/check_rtsp_status";
const ADD_DEPLOYMENT_CAMERA = "/add_camera_rtsp";
const GET_DEPLOYMENT_RTSP_JOB_BY_ID = "/get_deployment_rtsp_job_by_id";
const DELETE_CAMERA = "/delete_deployment_cameras";
const GET_SUPERVISOR_ENABLED_LOCATIONS ="/get_supervisor_enabled_locations";
const GET_ENABLED_LOCATIONS = "/get_all_location";

export async function addDeploymentCamera(camera) {
  const cameraData = {
    rtsp_url: camera.rtsp_url,
    camera_name: camera.camera_name,
    camera_resolution: camera.camera_resolution,
    process_fps: camera.process_fps,
    location_id: camera.location_id,
    camera_ip: camera.camera_ip,
    deployment_job_rtsp_id: camera.deploymentJobId,
    is_active: true,
    is_tcp: true,
    roi_type: camera.roi_type,
    status: true,
    is_processing: true
  };

  return await request({
    endpoint: ADD_DEPLOYMENT_CAMERA,
    method: HttpRequest.POST,
    body: cameraData
  });
}

export async function checkRTSPURL(rtspURL) {
  return await request({
    endpoint: CHECK_RTSP_URL + "?rtsp_url=" + rtspURL.replace(/&/g, "%26"),
    method: HttpRequest.POST
  });
}

export async function deleteCamera(cameraId) {
  return await request({
    endpoint: DELETE_CAMERA + "?camera_id=" + cameraId,
    method: HttpRequest.POST
  });
}

export async function getEnabledLocationList(userRole) {
  let URL = "";
  if(userRole === ADMIN_ROLE){
    URL = GET_ENABLED_LOCATIONS
  }else if(userRole === SUPERVISOR_ROLE){
    URL = GET_SUPERVISOR_ENABLED_LOCATIONS
  }else{
    URL = GET_ENABLED_LOCATIONS
  }
  return await request({
    endpoint: URL,
    method: HttpRequest.GET,
  });
}