import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Container, Footer, Header } from "./components";
import { useDispatch } from "react-redux";
import { login, logout } from "./features/authSlice";
import authService from "./appwrite/auth";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <Container>
      <Header />
      <main className="min-h-[55vh] w-full block">
        <Outlet />
      </main>
      <Footer />
    </Container>
  );
}

export default App;
