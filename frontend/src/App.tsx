import "./App.css";
import GlobalTimeRunner from "./lib/state/globalTimeRunner.ts";
import AppRoutes from "./routes/AppRoutes.tsx";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalTimeRunner />
      <AppRoutes />
    </QueryClientProvider>
  );
}

export default App;
