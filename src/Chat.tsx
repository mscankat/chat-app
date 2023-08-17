export default function Chat() {
  return (
    <>
      <div>{localStorage.getItem("token")}</div>
    </>
  );
}
