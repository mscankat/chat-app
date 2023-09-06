import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context";
export default function SignOut() {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const signOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("https://localhost:3001/api/signout", {
        credentials: "include",
      });
    } catch (e) {
      console.log("log out failed", e);
    } finally {
      setIsLoggedIn(false);
      navigate("/");
    }
  };
  return (
    <button
      onClick={signOut}
      className="text-center pt-1 text-gray-700 cursor-pointer block w-full"
    >
      Sign out
    </button>
  );
}
