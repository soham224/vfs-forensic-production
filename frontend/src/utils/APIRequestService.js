import Cookies from "universal-cookie";
import { ACCESS_TOKEN, TOKEN_TYPE } from "../enums/auth.enums";
import { appConfigs } from "./AppConfigs";
import axios from "axios";


export function request(options) {
  const cookies = new Cookies();

  // Create headers object (empty by default)
  const headers = options["headers"] || {};


  // If body is NOT FormData, set JSON content-type
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Set Authorization header if available
  if (cookies.get("access_token") && cookies.get("token_type")) {
    headers["Authorization"] =
        cookies.get("token_type", { httpOnly: false }) +
        " " +
        cookies.get("access_token", { httpOnly: false });
  }

  const config = {
    headers,
    url: options["url"] || appConfigs.API_HOST + options["endpoint"],
    method: options["method"],
    data: options["body"],
  };

  return axios.request(config)
      .then((response) => {
        if (response.status === 200) {
          return { data: response.data, isSuccess: true };
        }
        return { data: null, isSuccess: false };
      })
      .catch((error) => {
        if (error.response) {
          const { status, data } = error.response;
          console.error("🛑 API Error:", JSON.stringify(data, null, 2));
          if (status === 404) return { error: "No data found", status };
          if (status === 401 || status === 403) {
            cookies.remove(ACCESS_TOKEN);
            cookies.remove(TOKEN_TYPE);
            window.location.href = "#/auth/login";
          }
          throw data || error;
        }
        console.error("❌ Unknown Error:", error);
        throw error;
      });
}
