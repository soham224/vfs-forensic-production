import { request } from "../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../enums/http.methods";

const GET_CASE = "/get_case";
const GET_CASE_BY_ID = "/get_case_by_id";
const ADD_CASE = "/add_case";
const UPDATE_CASE_STATUS = "/update_case_status";
const ADD_SUSPECT = "/add_suspect";
const GET_LICENSE_DETAILS = "/get_license_details";
const GET_RESULT = "/get_result";
const GET_CAMERAS_BY_LOCATION_ID = "/get_cameras_rtsp_by_location_id";
const GET_RESULT_TYPE_COUNT = "/result_type_count";
const GET_CASE_STATUS_COUNT = "/case_status_count";
const GET_CHAIR_OCCUPANCY_COUNT = "/chair_occupancy_count";
const GET_CASE_STATUS_COUNT_PERCENTAGE = "/case_status_count_percentage";
const GET_GRAPH_RESULT = "/get_graph_result";
const GET_GRAPH_RESULT_BY_ID = "/get_result_by_ids";
const GET_GRAPH_CASE_BY_ID = "/get_case_graph_details";
const GET_CASE_BY_IDS = "/get_cases_by_ids";
const CASE_SUSPECT_JOURNEY = "/case_suspect_journey";
const GENERATE_CASE_REPORT = "/generate_case_report";

export async function getAllCase(data) {
  return await request({
    endpoint: GET_CASE,
    method: HttpRequest.POST,
    body: data
  });
}

export async function getCaseById(caseId) {
  return await request({
    endpoint: GET_CASE_BY_ID + `?case_id=${caseId}`,
    method: HttpRequest.GET
  });
}

export async function addCase(casedata) {
  return await request({
    endpoint: ADD_CASE,
    method: HttpRequest.POST,
    body: casedata
  });
}
export async function updateCaseapi(casedata) {
  return await request({
    endpoint: UPDATE_CASE_STATUS,
    method: HttpRequest.PUT,
    body: casedata
  });
}
export async function getSuspectJourneyByCaseId(case_id) {
  return await request({
    endpoint: CASE_SUSPECT_JOURNEY + `?case_id=${case_id}`,
    method: HttpRequest.POST,
    // body: casedata
  });
}

export async function getGenerateCaseReportByCaseId(case_id) {
    return await request({
        endpoint: GENERATE_CASE_REPORT + `?case_id=${case_id}`,
        method: HttpRequest.GET,
        // body: casedata
    });
}
export async function addSuspect(data) {
  return await request({
    headers: { "Content-Type": "multipart/form-data" },
    endpoint: ADD_SUSPECT,
    method: HttpRequest.POST,
    body: data
  });
}


export async function getLicenseDetail() {
  return await request({
    endpoint: GET_LICENSE_DETAILS,
    method: HttpRequest.GET,
  });
}

export async function getResultvfs(data) {
  return await request({
    endpoint: GET_RESULT,
    method: HttpRequest.POST,
    body: data
  });
}
export async function getCameras(data) {
  return await request({
    endpoint: GET_CAMERAS_BY_LOCATION_ID,
    method: HttpRequest.POST,
    body: data
  });
}
export async function getResultTypeCount(data) {
  return await request({
    endpoint: GET_RESULT_TYPE_COUNT,
    method: HttpRequest.POST,
    body: data
  });
}
export async function getResult(data) {
  return await request({
    endpoint: GET_GRAPH_RESULT,
    method: HttpRequest.POST,
    body: data
  });
}

export async function getCaseResult(data) {
  return await request({
    endpoint: GET_GRAPH_CASE_BY_ID,
    method: HttpRequest.POST,
    body: data
  });
}
export async function getCaseByIds(data) {
  return await request({
    endpoint: GET_CASE_BY_IDS,
    method: HttpRequest.POST,
    body: data
  });
}

export async function getResultById(data) {
  return await request({
    endpoint: GET_GRAPH_RESULT_BY_ID ,
    method: HttpRequest.POST,
    body: data
  });
}
export async function getCaseStatusCount(data) {
  return await request({
    endpoint: GET_CASE_STATUS_COUNT,
    method: HttpRequest.POST,
    body: data
  });
}
export async function getChairOccupancyCount(data) {
  return await request({
    endpoint: GET_CHAIR_OCCUPANCY_COUNT,
    method: HttpRequest.POST,
    body: data
  });
}

export async function getCaseStatusCountPercentage(data) {
  const endpoint =  GET_CASE_STATUS_COUNT_PERCENTAGE;

  return await request({
    endpoint: endpoint,
    method: HttpRequest.POST,
    body: data
  });
}
