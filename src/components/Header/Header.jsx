import { Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItem = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-700 bg-dark-900/95 backdrop-blur supports-backdrop-filter:bg-dark-900/60 shadow-lg">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div>
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo width="70px" />
          </Link>
        </div>
        <div className="ml-auto">
          <ul className="flex gap-6 items-center">
            {navItem.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-dark-700 hover:text-primary-400 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(item.slug)}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null,
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
