import React, { useState } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import * as auth from "../_redux/authRedux";
import { FaClipboard } from "react-icons/fa";
import {registerUser} from "../_redux/authCrud";
import {warningToast} from "../../../../../utils/ToastMessage"; // Importing the copy icon from react-icons

const initialCompanyValues = {
    user_email: "",
    license_key: "",
};

function Registration(props) {
    const { intl } = props;

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState("");

    const RegistrationCompanySchema = Yup.object().shape({
       
        user_email: Yup.string()
            .email("Wrong email format")
            .min(3, "Minimum 3 symbols")
            .max(50, "Maximum 50 symbols")
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
        license_key: Yup.string()
            // .matches(/^[0-9]{10,11}$/, "Please enter valid license key")
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
    });

    const formik = useFormik({
        initialValues: initialCompanyValues,
        validationSchema: RegistrationCompanySchema,
        onSubmit: (values, { setStatus, setSubmitting }) => {
            setSubmitting(true)
            registerUser(values)
                .then(response => {
                    setGeneratedPassword(response.data?.user_password);
                    setIsPopupOpen(true);
                    setSubmitting(false); // Stop loading

                })
                .catch(error => {
                    console.log("error:::", error)
                    setSubmitting(false); // Stop loading even if there's an error
                    if (error.detail) {
                        warningToast(error.detail);
                    }
                })
        },
    });

    const getInputClasses = (fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }

        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }

        return "";
    };

    const handlePopupOk = () => {
        setIsPopupOpen(false);
        window.location.href = "#/auth/login";
    };

    const handleCopyPassword = () => {
        const tempInput = document.createElement("input");
        tempInput.value = generatedPassword;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand("copy");
            handlePopupOk();
        } catch (err) {
            warningToast("Failed to copy the password. Please copy it manually.");
        }
        document.body.removeChild(tempInput);
    };


    return (
        <>
            <div
                className="login-form login-signin"
                style={{ display: "block", overflow: "auto" }}
            >
                <div className="text-center mb-10 mb-lg-20">
                    <h3 className="font-size-h1">
                        <FormattedMessage id="AUTH.REGISTER.TITLE" />
                    </h3>
                    <p className="text-muted font-weight-bold">
                        Enter your Email and License Key
                    </p>
                </div>

                <form
                    id="kt_login_signin_form"
                    className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
                    onSubmit={formik.handleSubmit}
                >
                    {formik.status && (
                        <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                            <div className="alert-text font-weight-bold">{formik.status}</div>
                        </div>
                    )}


                    <div className="form-group fv-plugins-icon-container">
                        <input
                            placeholder="Enter your Email Id"
                            type="text"
                            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                                "user_email"
                            )}`}
                            name="user_email"
                            {...formik.getFieldProps("user_email")}
                        />
                        {formik.touched.user_email && formik.errors.user_email ? (
                            <div className="fv-plugins-message-container">
                                <div className="fv-help-block">{formik.errors.user_email}</div>
                            </div>
                        ) : null}
                    </div>

                    <div className="form-group fv-plugins-icon-container">
                        <input
                            placeholder="Enter your License Key"
                            type="text"
                            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                                "license_key"
                            )}`}
                            name="license_key"
                            {...formik.getFieldProps("license_key")}
                        />
                        {formik.touched.license_key && formik.errors.license_key ? (
                            <div className="fv-plugins-message-container">
                                <div className="fv-help-block">{formik.errors.license_key}</div>
                            </div>
                        ) : null}
                    </div>
                    <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
                        <button
                            id="kt_login_signin_submit"
                            type="submit"
                            disabled={formik.isSubmitting}  // Disable button when submitting
                            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
                        >
                            {formik.isSubmitting ? ( // Show a loading spinner when submitting
                                <span>
                                    <span className="spinner-border spinner-border-sm ml-2" role="status"
                                          aria-hidden="true"></span>
                                        <span className="ml-1"> Signing Up...</span>
                                </span>
                            ) : (
                                <span>Sign Up</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h4>Your Password</h4>
                        <div className="">
                            <span>{generatedPassword}</span>
                            <FaClipboard
                                style={{cursor: 'pointer', marginLeft: '10px'}}
                                onClick={handleCopyPassword}
                            />
                        </div>
                        <div>
                            <p style={{marginBottom: "20px", fontSize: "14px", color: "#555"}}>
                                <strong>Note:</strong>  Save this password securely; it won't be shown again and will be needed for your next login.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default injectIntl(connect(null, auth.actions)(Registration));
