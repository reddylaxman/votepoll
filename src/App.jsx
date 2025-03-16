import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/SignupPage";
import CreatePoll from "./CreatePoll";
import PollsList from "./PollsList";
import UpdatePoll from "./UpdatePoll";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const voterId = localStorage.getItem("voterId");
    setIsLoggedIn(!!voterId);
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={isLoggedIn ? <PollsList /> : <LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/polls" element={<PollsList />} />
        <Route
          path="/createPoll"
          element={isLoggedIn ? <CreatePoll /> : <LoginPage />}
        />
        <Route
          path="/updatePoll/:pollId"
          element={isLoggedIn ? <UpdatePoll /> : <LoginPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
