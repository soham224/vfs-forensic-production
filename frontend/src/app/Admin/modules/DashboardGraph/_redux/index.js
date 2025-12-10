import { HttpRequest } from "../../../../../enums/http.methods";
import { request } from "../../../../../utils/APIRequestService";
import { ADMIN_ROLE, SUPERVISOR_ROLE } from "../../../../../enums/constant";

const GET_MODAL_DATA_ADMIN = "/get_filter_data_of_current_user";
const GET_MODAL_DATA_SUPERVISOR = "/get_filter_data_of_supervisor";
const GET_FILTER_GRAPH_DATA_ADMIN = "/get_filter_result_of_admin";
const GET_FILTER_GRAPH_DATA_SUPERVISOR = "/get_filter_result_of_supervisor";
const GET_WIDGETS_DATA_ADMIN = "/get_admin_widgets";
const GET_WIDGETS_DATA_SUPERVISOR = "/get_supervisor_widgets";
const GET_TABLE_DATA_FROM_ID = "/get_filter_result_of_last_graph_step";
const GET_RESULT_OF_GRAPH_DATA_FOR_ADMIN =
    "/get_result_of_graph_data_for_admin";
const GET_RESULT_OF_GRAPH_DATA_FOR_SUPERVISOR =
    "/get_result_of_graph_data_for_supervisor";
const GET_ALL_DEPLOYED_RTSP_JOBS = "/get_rtsp_deployed_jobs_for_current_user";
const GET_FILTER_EVENT_OF_ADMIN = "/get_filter_event_of_admin";
const GET_FILTER_EVENT_OF_SUPERVISOR = "/get_filter_event_of_supervisor";
const GET_FILTER_EVENT_OF_LAST_GRAPH_STEP =
    "/get_filter_event_of_last_graph_step";
const GET_EVENT_TYPE_BY_CAMERA_ID = "/get_event_type_by_camera_id";
const GET_CURRENT_USER_TOTAL_CAMERAS_BY_LOCATION_ID ="/get_current_user_total_cameras_by_location_id";
const GET_FILTER_RESULT_OF_ADMIN_PERCENTAGE ="/get_filter_result_of_admin_percentage";
const GET_DATA_OF_LAST_GRAPH_STEP_LIST ="/get_data_of_last_graph_step_list_topspin";


export async function getFilterModalData(userRole) {
  let DATA_URL = "";
  if (userRole === ADMIN_ROLE) {
    DATA_URL = GET_MODAL_DATA_ADMIN;
  } else {
    DATA_URL = GET_MODAL_DATA_SUPERVISOR;
  }

  return await request({
    endpoint: DATA_URL,
    method: HttpRequest.GET,
  });
}

export async function getWidgetsDataForAdmin(data) {
  return await request({
    endpoint: GET_WIDGETS_DATA_ADMIN,
    method: HttpRequest.POST,
    body: data,
  });
}

export async function getWidgetsDataForSupervisor(data) {
  return await request({
    endpoint: GET_WIDGETS_DATA_SUPERVISOR,
    method: HttpRequest.POST,
    body: data,
  });
}

export async function getFilterGraphData(data, userRole, name) {
  let DATA_URL = "";
  if (userRole === ADMIN_ROLE && name === "Label") {
    DATA_URL = GET_FILTER_GRAPH_DATA_ADMIN;
  } else if (userRole === ADMIN_ROLE && name === "Event") {
    DATA_URL = GET_FILTER_EVENT_OF_ADMIN;
  } else if (userRole === SUPERVISOR_ROLE && name === "Label") {
    DATA_URL = GET_FILTER_GRAPH_DATA_SUPERVISOR;
  } else if (userRole === SUPERVISOR_ROLE && name === "Event") {
    DATA_URL = GET_FILTER_EVENT_OF_SUPERVISOR;
  }

  return await request({
    endpoint: DATA_URL,
    method: HttpRequest.POST,
    body: data,
  });
}

export async function getFilterResultOfAdminPercentage(data) {
  return await request({
    endpoint: GET_FILTER_RESULT_OF_ADMIN_PERCENTAGE,
    method: HttpRequest.POST,
    body: data,
  });
}

export async function getDataOfLastGraphStepList(data) {
  return await request({
    endpoint: GET_DATA_OF_LAST_GRAPH_STEP_LIST,
    method: HttpRequest.POST,
    body: data,
  });
}



export async function getOneTableDataFromBar(uniqueId, labelName, name) {
  const baseURL = name === "Label" ? GET_TABLE_DATA_FROM_ID : GET_FILTER_EVENT_OF_LAST_GRAPH_STEP;

  // Construct the URL parameters
  const params = new URLSearchParams({ data_id: uniqueId });
  if (labelName) {
    params.append('label', labelName);
  }

  return await request({
    endpoint: `${baseURL}?${params.toString()}`,
    method: HttpRequest.GET,
  });
}

export async function getResultOfGraphData(dateTime, userRole) {
  let DATA_URL = "";
  if (userRole === ADMIN_ROLE) {
    DATA_URL = GET_RESULT_OF_GRAPH_DATA_FOR_ADMIN;
  } else {
    DATA_URL = GET_RESULT_OF_GRAPH_DATA_FOR_SUPERVISOR;
  }

  return await request({
    endpoint: DATA_URL + "?user_datetime=" + dateTime,
    method: HttpRequest.GET,
  });
}

export async function getAllDeployedRTSPJobsDetails() {
  return await request({
    endpoint: GET_ALL_DEPLOYED_RTSP_JOBS,
    method: HttpRequest.GET,
  });
}

export async function getDiffEventsByCameraId(body) {
  return await request({
    endpoint: GET_EVENT_TYPE_BY_CAMERA_ID,
    method: HttpRequest.POST,
    body: JSON.stringify(body),
  });
}

export async function getTotalCamerasByLocationId(data) {
  return await request({
    endpoint: GET_CURRENT_USER_TOTAL_CAMERAS_BY_LOCATION_ID,
    method: "POST",
    body: JSON.stringify(data),
  });
}