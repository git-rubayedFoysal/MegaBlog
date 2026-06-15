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
      className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 cursor-pointer"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
