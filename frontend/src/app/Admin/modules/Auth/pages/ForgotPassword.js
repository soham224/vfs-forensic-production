import React, {useState} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";
import {Link, Navigate} from "react-router-dom";
import * as Yup from "yup";
import {injectIntl} from "react-intl";
import * as auth from "../_redux/authRedux";
import {forgotPassword} from "../_redux/authCrud";
import {warningToast} from "../../../../../utils/ToastMessage";
import {FaClipboard} from "react-icons/fa";


function ForgotPassword(props) {
    const {intl} = props;
    const [isRequested, setIsRequested] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState("");

    const ForgotPasswordSchema = Yup.object().shape({
        email: Yup.string()
            .email("Wrong email format")
            .min(3, "Minimum 3 symbols")
            .max(50, "Maximum 50 symbols")
            .required(
                intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD",
                })
            ),
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


    const formik = useFormik({
        initialValues: ForgotPasswordSchema,
        // validationSchema: RegistrationCompanySchema,
        onSubmit: (values, {setStatus, setSubmitting}) => {
            setSubmitting(true)
            const data = {
                user_email: values.email,
                license_key: values.license_key
            }
            forgotPassword(data)
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
            {isRequested && <Navigate to="/auth"/>}
            {!isRequested && (
                <div className="login-form login-forgot" style={{display: "block"}}>
                    <div className="text-center mb-10 mb-lg-20">
                        <h3 className="font-size-h1">Forgotten Password ?</h3>
                        <div className="text-muted font-weight-bold">
                            Enter your email to reset your password
                        </div>
                    </div>
                    <form
                        onSubmit={formik.handleSubmit}
                        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
                    >
                        {formik.status && (
                            <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                                <div className="alert-text font-weight-bold">
                                    {formik.status}
                                </div>
                            </div>
                        )}
                        <div className="form-group fv-plugins-icon-container">
                            <input
                                placeholder="Enter your Email Id"
                                type="email"
                                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                                    "email"
                                )}`}
                                name="email"
                                {...formik.getFieldProps("email")}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">{formik.errors.email}</div>
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
                        <div className="form-group d-flex flex-wrap flex-center">
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
                                        <span className="ml-1"> Forgot Password...</span>
                                </span>
                                ) : (
                                    <span>Forgot Password</span>
                                )}
                            </button>
                            <Link to="/auth">
                                <button
                                    type="button"
                                    id="kt_login_forgot_cancel"
                                    className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                                >
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            )}

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
                                <strong> Note: </strong> Save this password securely; it won't be shown again and will be needed for your
                                next login.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default injectIntl(connect(null, auth.actions)(ForgotPassword));
