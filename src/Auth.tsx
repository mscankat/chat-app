import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./Context";
import Loading from "./components/Loading";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const code = searchParams.get("code");
  const postURL = new URL("https://localhost:3001/api");
  const body = { code: code };

  const { isLoggedIn, setIsLoggedIn } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(postURL, {
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

        const data = await response.json();
        if (data === "success") {
          setIsLoggedIn(true);
          setTimeout(() => {
            window.close();
            window.opener.location.href = "/chat";
          }, 2000);
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
        <Loading />
      ) : isLoggedIn ? (
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
