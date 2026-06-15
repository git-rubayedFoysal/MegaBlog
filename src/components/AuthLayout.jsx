import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, requireAuth = true }) {
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (requireAuth) {
      // protected page: require logged-in user
      if (!authStatus) navigate("/login");
    } else {
      // guest-only page: redirect signed-in users away
      if (authStatus) navigate("/");
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoader(false);
  }, [authStatus, navigate, requireAuth]);

  return loader ? <h1>Loading....</h1> : <>{children}</>;
}

export default ProtectedRoute;
