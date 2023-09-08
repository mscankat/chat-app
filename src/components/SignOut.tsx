import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context";
export default function SignOut({ name }: { name: string }) {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const signOutURL = new URL(
    `${process.env.REACT_APP_SERVER_HOST}/api/signout`
  );
  const signOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch(signOutURL, {
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
    <div className="absolute right-0 text-gray-950 m-3 p-2 bg-gray-300 rounded-md">
      Logged in as: "{name}"
      <button
        onClick={signOut}
        className="text-center pt-1 text-gray-700 cursor-pointer block w-full"
      >
        Sign out
      </button>
    </div>
  );
}
