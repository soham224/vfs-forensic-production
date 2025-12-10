import React, {Component} from "react";
import {connect} from "react-redux";
import {LayoutSplashScreen} from "../../../../../_metronic/layout";
import * as auth from "../_redux/authRedux";
import Cookies from "universal-cookie";
import {ACCESS_TOKEN, TOKEN_TYPE} from "../../../../../enums/auth.enums";
import {Navigate} from "react-router-dom";


class Logout extends Component {
  componentDidMount() {
    this.props.logout();
    const cookies = new Cookies();
    /*cookies.set('access_token', '', {httpOnly: false,path: "/"});
    cookies.set('token_type', '', {httpOnly: false,path: "/"});*/
    cookies.remove(ACCESS_TOKEN, {httpOnly: false});
    cookies.remove(TOKEN_TYPE, {httpOnly: false});
  }

  render() {
    const { hasAuthToken } = this.props;
    return hasAuthToken ? <LayoutSplashScreen /> : <Navigate to="/auth/login"  />;
  }
}

export default connect(
  ({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }),
  auth.actions
)(Logout);
