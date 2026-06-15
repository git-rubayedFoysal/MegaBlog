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
    <header className="py-3 shadow bg-[#1a1a1a]">
      <nav className="flex justify-between items-center px-4">
        <div>
          <Link to="/">
            <Logo width="70px" />
          </Link>
        </div>
        <div className="ml-auto">
          <ul className="flex gap-3 items-center">
            {navItem.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    className="inline-bock px-1.5 py-1 duration-200 hover:bg-[#2e2e2e] cursor-pointer rounded"
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
