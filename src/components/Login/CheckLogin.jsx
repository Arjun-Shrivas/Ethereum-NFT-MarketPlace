export default function CheckLoggedStatus() {
  const sessionToken = JSON.parse(
    localStorage.getItem("sessionData"),
  )?.session_token;
  if (sessionToken) {
    return [true, sessionToken];
  } else return [false, null];
}
