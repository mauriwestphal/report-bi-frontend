import React, { ComponentType, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EmbedProps } from "powerbi-client-react";
import { IEmbedConfiguration } from "powerbi-client";

const DynamicPowerBIEmbed = dynamic(
  () => import("powerbi-client-react").then((m) => m.PowerBIEmbed),
  { ssr: false }
);

const EmbedReport = ({ embedConfig }: { embedConfig: IEmbedConfiguration }) => {
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    // Set up the interval to refresh every 1 minute (1 * 60 * 1000 milliseconds)
    const intervalId = setInterval(() => {
      setRefreshCount((prevCount) => prevCount + 1);
    }, 30 * 60 * 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  if (DynamicPowerBIEmbed) {
    return (
      <>
        <DynamicPowerBIEmbed
          key={`embed-${refreshCount}`} // Add a unique key to trigger re-mount when refresh happens
          embedConfig={embedConfig}
          cssClassName="report-style-class"
        />
      </>
    );
  }

  return <></>;
};

export default EmbedReport;
