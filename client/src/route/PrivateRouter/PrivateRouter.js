import React from "react";
import { Redirect, Route } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        sessionStorage.getItem("user_Token") ? (
          <Component {...props} />
        ) : (
          <>
            {alert("로그인이 필요한 서비스입니다")}
            {
              <Redirect
                to={{
                  pathname: "/",
                  state: { from: props.location },
                }}
              />
            }
          </>
        )
      }
    />
  );
}

export default PrivateRoute;
