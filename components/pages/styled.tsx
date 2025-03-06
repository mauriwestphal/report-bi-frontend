import styled from "styled-components";

export const LoginStyled = styled.div`
  .login-page {
    &__container {
      max-height: 100vh;
      height: 100vh;
      background-image: url("/auth/background.png");
      background-size: cover;
      background-repeat: no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
      .login-card {
        width: 450px;
        height: 460px;
      }
    }
  }
`;
