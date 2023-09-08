export default function NotLoggedIn() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen gap-5 bg-gray-300">
        <div>You are not logged in. </div>
        <a href="/" className="underline text-stone-600">
          Login Page
        </a>
      </div>
    </>
  );
}
