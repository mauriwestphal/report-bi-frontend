import cookie from "js-cookie";

const saveToken = (token: string) => {
  if (token) {
    cookie.set("bipro-report.token", token, { expires: 1 });
  }
};

const removeToken = () => {
  cookie.remove("bipro-report.token");
};

const getToken = () => {
  return cookie.get("bipro-report.token");
};

const getAuthorization = () => {
  return cookie.get("bipro-report.token")
    ? `Bearer ${cookie.get("bipro-report.token")}`
    : false;
};

export { saveToken, getAuthorization, removeToken, getToken };
