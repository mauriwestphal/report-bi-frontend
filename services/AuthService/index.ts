const auth = (window: any) => {
  window.location.href = `${process.env.NEXT_PUBLIC_URL_API}/auth/ms/redir`;
};

const AuthService = {
  auth,
};

export default AuthService;
