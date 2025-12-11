
// Use relative paths when behind nginx proxy, or absolute when env vars provided
const protocol = window.location.protocol;
const host = window.location.host; // Includes port if present

// UI docs endpoint - use relative path through nginx
export const REACT_APP_IP_Config = process.env.REACT_APP_IP || 
  `${protocol}//${host}/docs`;

// API base endpoint - use relative path through nginx
export const REACT_APP_API_HOST_IP_Config = process.env.REACT_APP_API_HOST || 
  `${protocol}//${host}/api/v1`; 
  