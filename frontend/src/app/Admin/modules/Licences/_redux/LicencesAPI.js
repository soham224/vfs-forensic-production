import { request } from "../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../enums/http.methods";

const GET_ALL_LOCATION = "/get_all_location";
const GET_LOCATION_BY_ID = "/get_location_by_id";
const ADD_LOCATION = "/add_location";
const UPDATE_LOCATION = "/update_location";
const UPDATE_LOCATION_STATUS="/update_location_status"
export async function getAllLocation() {
  return await request({
    endpoint: GET_ALL_LOCATION,
    method: HttpRequest.GET
  });
}

export async function getLocationById(locationId) {
  return await request({
    endpoint: GET_LOCATION_BY_ID + `?location_id=${locationId}`,
    method: HttpRequest.GET
  });
}

export async function addLocation(location) {
  return await request({
    endpoint: ADD_LOCATION,
    method: HttpRequest.POST,
    body: location
  });
}

export async function updateLocation(location) {
  return await request({
    endpoint: UPDATE_LOCATION,
    method: HttpRequest.POST,
    body: location
  });
}

export async function updateLocationStatus(location_id,location_status,updated_date) {
  return await request({
    endpoint: UPDATE_LOCATION_STATUS +`?location_id=${location_id}&location_status=${location_status}&updated_date=${updated_date}`,
    method: HttpRequest.POST,
  });
}
