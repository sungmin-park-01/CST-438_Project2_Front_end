import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Loginpage";
import Dashboard from "./pages/Dashboard";
import OAuthSuccess from "./pages/OAuthSucess";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
    </Routes>
  );
}