import { Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoginStyled } from "../../../components/pages/styled";
import { saveToken } from "../../../utils/auth";
import { useAppContext } from '../../../context/AppContext';
const CompleteLoginPage = () => {
  const router = useRouter();
  const [routerLoads, setRouterLoads] = useState(0);
  const {getUser} = useAppContext();
  useEffect(() => {
    setRouterLoads((prevVal) => prevVal + 1);
    if (routerLoads >= 3) {
      router.push("/auth");
    }
    if (router.query && router.query.token) {
      const token = router.query.token as string;
      saveToken(token);
      getUser();
      router.push("/report");
    }

    if (router.query && router.query.status) {
      router.push(`/auth?status=${router.query.status}`);
    }
  }, [router.query]);

  return (
    <LoginStyled>
      <div className="login-page__container">
        <Spin spinning />
      </div>
    </LoginStyled>
  );
};

export default CompleteLoginPage;
