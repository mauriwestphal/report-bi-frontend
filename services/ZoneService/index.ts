import { AxiosResponse } from "axios";
import request from "../../utils/request";

export interface PowerBiReport {
  value: number;
  label: string;
}

const listReportBI = (): Promise<AxiosResponse<PowerBiReport[]>> => {
  return request({
    url: "/api/report/bi",
    method: "GET",
    private: true,
  });
};

const ZoneService = {
  listReportBI,
};

export default ZoneService;
