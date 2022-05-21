import styles from "./App.module.css";
import { Router } from "react-chrome-extension-router";
import Login from "./pages/login";
import Header from "./components/header";

function App() {
  return (
    <div className={styles.wrapper}>
      <Header />
      <Router>
        <Login />
      </Router>
    </div>
  );
}

export default App;
