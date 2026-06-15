import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout as storeLogout } from "../../features/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await authService.logout();
    dispatch(storeLogout());
  };

  return (
    <button
      className="inline-block px-1.5 py-1 duration-200 hover:bg-[#2e2e2e] rounded"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
