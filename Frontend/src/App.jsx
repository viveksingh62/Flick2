import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Homepage from "./pages/Homepage";

import { createBrowserRouter, RouterProvider } from "react-router";
import Pagedetails from "./pages/Pagedetails";
import New from "./component/New";

function App() {
  const [count, setCount] = useState(0);

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
      element: <New />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
