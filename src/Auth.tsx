import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const code = searchParams.get("code");
  const postURL = new URL("https://localhost:3001/api");
  const userURL = new URL("https://localhost:3001/api/user");
  const body = { code: code };

  const getCookies = async () => {
    await fetch(postURL, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
  };
  const isLoggedIn = async () => {
    const response = await fetch(userURL, { credentials: "include" });
    const data = await response.json();
    if (data.message) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getCookies();
        const isLogged = await isLoggedIn();
        if (!isLogged) {
          setLogged(false);
          console.log("you are not logged");
        } else {
          setLogged(true);
          setTimeout(() => {
            window.close();
          }, 2000);
          console.log("you are logged");
        }
      } catch (e) {
        console.error("error fetching", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex justify-center items-center h-screen flex-col gap-5 bg-gray-200">
      {loading ? (
        <>
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <div>Please Wait</div>
        </>
      ) : logged ? (
        <>
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <div>Login successful</div>
          <div className="">you are being directed</div>
        </>
      ) : (
        <>
          <div>you are not logged</div>
        </>
      )}
    </div>
  );
}
