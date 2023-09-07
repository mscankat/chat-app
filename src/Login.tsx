import { useEffect, useState } from "react";
import { useAuth } from "./Context";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userURL = new URL("https://localhost:3001/api/user");

  useEffect(() => {
    const getCredentials = async () => {
      try {
        const response = await fetch(userURL, { credentials: "include" });
        const data = await response.json();
        if (data.name) {
          navigate("/chat");
        }
      } catch (e) {
        console.error("error fetching", e);
      } finally {
        setLoading(false);
      }
    };
    getCredentials();
  }, [isLoggedIn]);
  function handleClick() {
    window.open(
      getURL,
      "_blank",
      "width=600,height=800,popup=yes,left=650,top=100"
    );
  }
  const clientID = process.env.REACT_APP_CLIENT_ID || "";
  const getURL = new URL("https://github.com/login/oauth/authorize");
  getURL.searchParams.set("client_id", clientID);

  return loading ? (
    <div className="flex justify-center items-center h-screen flex-col gap-5 bg-gray-200">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  ) : (
    <>
      <div className="h-screen flex justify-center items-center bg-gray-950">
        <div className="h-2/5 w-2/6 bg-white rounded-3xl flex flex-col justify-center items-center gap-4">
          <div className="mb-10">
            <h2 className="text-5xl justify-start mb-10 text-center">Login</h2>

            <div
              onClick={handleClick}
              className="cursor-pointer bg-gray-400 text-white w-80 h-12 rounded-md border-b-2 border-gray-600 text-center leading-[3rem] hover:shadow-lg "
            >
              Login With GitHub
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
