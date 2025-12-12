import "./App.css";
import GlobalTimeRunner from "./lib/state/globalTimeRunner";
import AppRoutes from "./routes/AppRoutes";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { InstallPWA } from "./components/installPWA"; // Import the component

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalTimeRunner />
      <AppRoutes />
      <InstallPWA /> {/* Add the component here */}
    </QueryClientProvider>
  );
}

export default App;
