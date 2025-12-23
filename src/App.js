import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/common/Navbar";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
