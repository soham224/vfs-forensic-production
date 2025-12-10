import { Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function showToast(msg) {
  return toast(msg, {
    transition: Slide,
    closeButton: true,
    autoClose: 5000,
    position: "top-right",
    //toast.POSITION.TOP_CENTER
  });
}

export function warningToast(msg) {
  return toast.error(msg, {
    transition: Slide,
    closeButton: true,
    autoClose: 2000,
    position: "top-right",
  });
}

export function successToast(msg) {
  return toast.success(msg, {
    transition: Slide,
    closeButton: true,
    autoClose: 2000,
    position: "top-right",
  });
}

export function infoToast(msg) {
  return toast.warn(msg, {
    transition: Slide,
    closeButton: true,
    autoClose: 2000,
    position: "top-right",
  });
}
