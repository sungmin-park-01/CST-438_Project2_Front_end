import { useNavigate } from "react-router-dom";
import "../css/UserListEntry.css";

export default function UserListEntry({ user }) {
  const navigate = useNavigate();

  return (
    <button className="user-list-entry" onClick={() => navigate(`/users/${user.userId}`)}>
      <span className="user-list-entry-name">{user.username}</span>
      <span className="user-list-entry-role">{user.role}</span>
    </button>
  );
}
