
const host = window.location.hostname;

// UI docs endpoint (fallback to local 8000/docs when env not provided)
export const REACT_APP_IP_Config =
  process.env.REACT_APP_IP || `http://${host}:8000/docs`;

// API base endpoint (fallback to local 8000/api/v1 when env not provided)
export const REACT_APP_API_HOST_IP_Config =
  process.env.REACT_APP_API_HOST || `http://${host}:8000/api/v1`;