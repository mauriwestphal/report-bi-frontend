import { TopTitleDashboardStyle } from "./style";

import { TopSearchProps } from "../interfaces/TopSearchInterface";

interface PropInterface {
  showDate?: boolean;
  comeBackConfig?: {
    route?: string;
    show?: boolean;
    text?: string;
  };
  title: {
    strong?: string;
    title?: string;
    subtitle?: string;
    conteo?: any;
  };
}

const TopTitleDashboard = ({
  showDate,
  comeBackConfig,
  title,
  search,
  action,
}: PropInterface & TopSearchProps) => {
  const countArray = Object.entries(title?.conteo || {}).map(
    ([key, value]) => ({ key, value })
  );

  return (
    <TopTitleDashboardStyle>
      <div className="top-section">
        <div
          className="section-title"
          style={{
            width: "100%",
          }}
        >
          <h1>
            <strong>{title.strong}</strong> {title.title}
          </h1>
          <p
            style={{
              color: "#8C8C8C",
              fontWeight: 10,
              fontSize: "20px",
              fontFamily: "Arial",
            }}
          >
            {title.subtitle}
          </p>
        </div>

        <div
          className="section-indicators"
          style={{
            width: "100%",
          }}
        >
          <div style={{ marginBottom: "3px", textAlign: "center" }}>
            <strong style={{
              fontSize: '26px',
              fontWeight: "700",
              lineHeight: "22px",
            }}>Unidades por tipo de servicio </strong>
          </div>
          <div
            style={{
              width: "100%",
              height: "50px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                width: "100%",
                marginTop: 10,
              }}
            >
              {countArray.length ? (
                countArray?.map((elemet) => {
                  return (
                    <p
                      style={{
                        fontSize: "24px",
                        marginRight: 5,
                        display: "inline-block",
                        fontWeight: "bold",

                      }}
                    >
                      {" "}
                      {elemet.key}{" "}
                      <span
                        className="section-indicators-box"
                        style={{
                          border: "2px solid #8B8B8B",
                          paddingLeft: 5,
                          paddingRight: 5,
                          borderRadius: 5,
                          color: "#FF5F00",
                          fontSize: "24px",
                          fontWeight: "bold",
                          marginRight: 5,
                        }}
                      >
                        {Number(elemet?.value)}{" "}
                      </span>
                    </p>
                  );
                })
              ) : (
                <p
                  style={{
                    color: "#8C8C8C",
                    fontWeight: 10,
                  }}
                >
                  Cargando...
                </p>
              )}
            </div>
          </div>
        </div>
        <div
          className="section-indicadors-last"
          style={{
            width: "100%",
            textAlign: "end",
          }}
        >
          {/* <p style={{
            fontSize: '12px',
            marginRight: 5
          }}>Atrasado    <span className="section-indicators-box" style={{
            border: '2px solid #8B8B8B',
            paddingLeft: 5,
            paddingRight: 5,
            borderRadius: 5,
            color: '#FF5F00',
            fontSize: '15px',
            fontWeight: 'bold'
          }}>33</span></p> */}
        </div>
      </div>
    </TopTitleDashboardStyle>
  );
};

export default TopTitleDashboard;
