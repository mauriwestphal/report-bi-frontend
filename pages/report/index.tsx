import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import TopTitle from "../../components/shared/TopTitle";
import { TopSearchProps } from "../../components/shared/interfaces/TopSearchInterface";
import { PlusCircleOutlined } from "@ant-design/icons";
import { getValidatedItems } from "../../utils/validatedItems";
import { ListReport } from '../../services/interfaces/List.interface';
import ReportService from "../../services/Reports";
import { Row, Col } from "antd";
import CardInfo from "../../components/shared/CardInfo";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
interface ActiveConfigInterface extends TopSearchProps {
    title?: string
}

const extractNumericPart = (str: string): number => {
    const numericPart = str.split(".")[0];

    if (!isNaN(parseInt(numericPart))) {
        return parseInt(numericPart);
    } else {
        return NaN;
    }
}
const Report = () => {
    const [item, setItem] = useState<ListReport[]>();
    const router = useRouter();


    const [activeConfig, setActiveConfig] = useState<ActiveConfigInterface | undefined>({
        title: "Reportes",

    });

    const { user } = useAppContext();
    const itemUserReportPages: any = user?.role?.reportPages?.sort(
        (a: any, b: any) => {
            const aNumber = extractNumericPart(a.name);
            const bNumber = extractNumericPart(b.name);
            return aNumber - bNumber || a.name.localeCompare(b.name);
        }
    ).map((element: any) => {
        return {
            title: element.name,
            body: element.description,
            url: `monitor/report/${element.id}`
        }
    });



    return (
        <Layout>
            <TopTitle
                comeBackConfig={{
                    route: "/home",
                    show: false,
                }}
                showDate={true}
                title={{
                    title: activeConfig?.title
                }}
            />

            <Row gutter={24} style={{ margin: 0 }}>
                <Col span={4}></Col>
                <Col span={16}>
                    <Row style={{ margin: 0 }} gutter={[12, 12]}>
                        {itemUserReportPages?.map((element: any) => {
                            return (
                                <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                                    <CardInfo {...element} bordered={false} icono={false} />
                                </Col>
                            )
                        })}
                    </Row>
                </Col>
                <Col span={4}></Col>
            </Row>

        </Layout>)
}


export default Report;