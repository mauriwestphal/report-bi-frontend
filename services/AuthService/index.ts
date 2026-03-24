const AuthService = {
  auth: (win: Window) => {
    win.location.href = `${process.env.NEXT_PUBLIC_URL_API}/auth/ms/redir`;
  },
};

export default AuthService;
