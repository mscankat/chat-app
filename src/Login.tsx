import { useEffect } from "react";
import { useAuth } from "./Context";
import { useNavigate } from "react-router-dom";
export default function Login() {
  console.log("qw");

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chat");
    }
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

  return (
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
