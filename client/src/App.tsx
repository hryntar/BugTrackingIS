import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "./hooks/use-auth";
import { router } from "./router";

function App() {
  const { isAuthenticated } = useAuth();
  return <RouterProvider router={router} context={{ isAuthenticated }} />;
}

export default App;
