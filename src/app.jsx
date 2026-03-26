import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginpage";
import Dashboard from "./pages/Dashboard";
import OAuthSuccess from "./pages/OAuthSucess";
import LandingPage from "./pages/LandingPage";
import AllApplications from "./pages/AllApplications";
import ApplicationEntry from "./pages/ApplicationEntry";
import NoteFormPage from "./pages/NoteFormPage";
import UserListPage from "./pages/UserListPage..jsx";
import UserEntryPage from "./pages/UserEntryPage";
import ProfilePage from "./pages/ProfilePage";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/applications" element={<AllApplications />} />
      <Route path="/applications/new" element={<ApplicationEntry />} />
      <Route path="/applications/:applicationId" element={<ApplicationEntry />} />
      <Route path="/applications/:applicationId/edit" element={<ApplicationEntry />} />
      <Route path="/applications/:applicationId/note/new" element={<NoteFormPage />} />
      <Route path="/applications/:applicationId/note/:noteId" element={<NoteFormPage />} />
      <Route path="/applications/:applicationId/note/:noteId/edit" element={<NoteFormPage />} />
      <Route path="/users" element={<UserListPage />} />
      <Route path="/users/:userId" element={<UserEntryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
