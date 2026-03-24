import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginpage";
import Dashboard from "./pages/Dashboard";
import OAuthSuccess from "./pages/OAuthSucess";
import NotesOverviewPage from "./pages/NotesOverviewPage";
import NoteFormPage from "./pages/NoteFormPage";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notes" element={<NotesOverviewPage />} />
      <Route path="/notes/new/:applicationId" element={<NoteFormPage />} />
      <Route path="/notes/edit/:applicationId/:noteId" element={<NoteFormPage />} />
 
    </Routes>
  );
}