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
    async function getUserData() {
      try {
        const user = await authService.getCurrentUser();

        if (user) {
          dispatch(login(user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("getUserData error:", error);
      } finally {
        setLoading(false);
      }
    }

    getUserData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <Header />
      <main className="grow w-full">
        <Outlet />
      </main>
      <Footer />
    </Container>
  );
}

export default App;
