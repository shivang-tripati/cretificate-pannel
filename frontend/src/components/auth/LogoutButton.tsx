import React from "react";
import { useAuth } from "../../hooks/useAuth";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return <button className="p-2 bg-red-500 text-white rounded">Logout</button>;
};

export default LogoutButton;
