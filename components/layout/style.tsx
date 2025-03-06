import styled from "styled-components";

export const LayoutStyled = styled.div`
  .layout-home {
    min-height: 100vh;
    wigth:100%;
    // background: linear-gradient(
    //     180deg,
    //     #141414 63.49%,
    //     rgba(20, 20, 20, 0) 139.89%
    //   ),
    //   linear-gradient(0deg, rgba(20, 20, 20, 0.9), rgba(20, 20, 20, 0.9)),
    //   url("/auth/background.png");
        // background-color: red !important;

    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("/auth/backgroud-home.png");
    .content-classname,
    .top-section {
      padding: 0px 24px;
    }
  }

  .layout {
    min-height: 100vh;
    wigth:100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("/auth/backgroud-home.png");
    .content-classname,
    .top-section {
      padding: 0px 24px;
    }
  }
`;
