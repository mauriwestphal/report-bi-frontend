import moment from "moment";

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => {
          return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return undefined;
  }
};

const isTokenValid = (token: string): boolean => {
  const data = parseJwt(token);
  if (data !== undefined) {
    return moment.unix(data.exp).isAfter(new Date());
  }

  return false;
};

export { isTokenValid, parseJwt };
