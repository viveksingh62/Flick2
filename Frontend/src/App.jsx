import "./App.css";
import Homepage from "./pages/Homepage";
import AuthProvider from "./context/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Pagedetails from "./pages/Pagedetails";
import New from "./component/New";
import Signup from "./pages/Signup";
import Login from "./pages/login";
import ProtectedRoute from "./component/ProtectedRoute";
import CategoryPage from "./pages/Categorypage";
import MyPurchases from "./pages/MyPurchased";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/prompt/:id",
      element: <Pagedetails />,
    },
    {
      path: "/prompt",
      element: (
        <ProtectedRoute>
          <New />
        </ProtectedRoute>
      ),
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/categories/:category", // 👈 new route
      element: <CategoryPage />,
    },
    { path: "/my-purchases", element: <MyPurchases /> },
  ]);
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
