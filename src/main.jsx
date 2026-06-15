import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ProtectedRoute } from "./components";
import Home from "./pages/Home.jsx";
import AllPosts from "./pages/AllPost.jsx";
import AddPost from "./pages/AddPost.jsx";
import EditPost from "./pages/EditPost.jsx";
import Post from "./pages/Post.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Signup />
          </ProtectedRoute>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <ProtectedRoute requireAuth>
            <AllPosts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-post",
        element: (
          <ProtectedRoute requireAuth>
            <AddPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <ProtectedRoute requireAuth>
            <EditPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post/:slug",
        element: (
          <ProtectedRoute requireAuth>
            <Post />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
