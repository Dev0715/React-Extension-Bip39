import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Process from "./pages/process";
import { routes } from "./routes";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={routes.home} element={<Home />} />
          <Route path={routes.process} element={<Process />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
