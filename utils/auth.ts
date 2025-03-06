import cookie from "js-cookie";

const saveToken = (token: string) => {
  if (token) {
    cookie.set("gama-seguimiento-vehiculos.token", token, { expires: 1 });
  }
};

const removeToken = () => {
  cookie.remove("gama-seguimiento-vehiculos.token");
};

const getToken = () => {
  return cookie.get("gama-seguimiento-vehiculos.token");
};

const getAuthorization = () => {
  return cookie.get("gama-seguimiento-vehiculos.token")
    ? `Bearer ${cookie.get("gama-seguimiento-vehiculos.token")}`
    : false;
};

export { saveToken, getAuthorization, removeToken, getToken };
