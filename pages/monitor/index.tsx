import React, { useMemo, useState, useEffect } from 'react'
import Router from "next/router";
import Layout from '../../components/layout';
import Monitor from '../../components/pages/monitor';
import { TopSearchProps } from '../../components/shared/interfaces/TopSearchInterface';
import TopTitle from '../../components/shared/TopTitle';
import { PlusCircleOutlined } from "@ant-design/icons";
import { useAppContext } from '../../context/AppContext';
import ZoneService from '../../services/ZoneService';
interface Zones {
    label: string;
    value: number
}

const mapDataToOptions = (data: any[]): Zones[] => (
    data.map((element) => ({
        label: `${element.city} - ${element.zone}`,
        value: element.city_id
    }))
);
interface ActiveConfigInterface extends TopSearchProps {
    title?: string
}

const MonitorPage = () => {
    const [optionZones, setOptionZones] = useState<Zones[]>();
    const [optionZonesLoading, setOptionZonesLoading] = useState<boolean>(true);
    const { user } = useAppContext();
    const [activeConfig, setActiveConfig] = useState<ActiveConfigInterface | undefined>({
        title: "Gestión de Pantallas",
        search: {
            onClick: () => { },
            placeholder: "Buscar monitor"
        },
        action: {
            buttonText: "Nuevo monitor",
            icon: <PlusCircleOutlined />,
            onClick: () => Router.push("monitor/crear"),
        }
    });

    useEffect(() => {

        if (!user) {
            Router.push("/auth");
        }

        // ZoneService.listZones().then(({ data }) => {
        //     setOptionZones(mapDataToOptions(data));

        // }).finally(() => {
        //     setOptionZonesLoading(false)
        // });
    }, [])

    return (
        <Layout>
            <TopTitle
                comeBackConfig={{
                    route: "/home",
                    show: false,
                }}
                showDate={false}
                title={{
                    title: activeConfig?.title
                }}
                action={activeConfig?.action}
            />

                 <Monitor optionZones={optionZones || []} />    

        </Layout>
    )
}


export default MonitorPage;
