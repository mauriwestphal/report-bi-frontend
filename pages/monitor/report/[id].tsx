import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import EmbedReport from "../../../components/shared/EmbedBi";
import { IEmbedConfiguration, models, Page } from "powerbi-client";
import { useRouter } from "next/router";
import MonitorService from "../../../services/MonitorService/monitor";
import { useAppContext } from "../../../context/AppContext";

const MonitorPage = () => {
  const router = useRouter();
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  const [showTitle, setShowTitle] = useState(true);

  const [embedConfig, setEmbedConfig] = useState<IEmbedConfiguration>({
    type: "report", // Supported types: report, dashboard, tile, visual and qna
    embedUrl: undefined,
    accessToken: undefined,
    filters: [],
    pageView: "fitToWidth",

    settings: {
      background: 1,
      layoutType: 1,
      customLayout: {
        displayOption: 1,
      },
      panes: {
        pageNavigation: {
          visible: false,
        },
        filters: {
          expanded: false,
          visible: false,
        },
      },
    },
  });

  const [routerLoads, setRouterLoads] = useState(0);
  const { user } = useAppContext();

  useEffect(() => {
    setRouterLoads((prevVal) => prevVal + 1);
    // if (user) {
      if (router.query && router.query.id) {
        setShowTitle(regex.test(router.query.id as string) ? false : true);

        MonitorService.getMonitor(router.query.id as string).then(({ data }) => {
          if (data.report) {
            const { embedUrl, accessToken, pageName } = data.report;
            setEmbedConfig({
              ...embedConfig,
              embedUrl: embedUrl,
              accessToken: accessToken,
              pageName: pageName,
            });
          }
        });
      }

      const updateStateEvery1Minute = () => {
        if (router.query && router.query.id) {
          setShowTitle(regex.test(router.query.id as string) ? false : true);

          MonitorService.getMonitor(router.query.id as string).then(({ data }) => {
            if (data.report) {
              const { embedUrl, accessToken, pageName } = data.report;
              setEmbedConfig({
                ...embedConfig,
                embedUrl: embedUrl,
                accessToken: accessToken,
                pageName: pageName,
              });
            }
          });
        }
      }

      updateStateEvery1Minute();
      const interval = setInterval(updateStateEvery1Minute, 30 * 60 * 1000);
      return () => clearInterval(interval);
    // } else {
    //   router.push("/auth");
    // }
  }, [router.query]);

  return (
    <Layout style={{ height: "1px", overflow: "hidden" }} title={showTitle.toString()}>
      <EmbedReport embedConfig={embedConfig} />
    </Layout>
  );
};

export default MonitorPage;
