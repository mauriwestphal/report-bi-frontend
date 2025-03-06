import { AxiosResponse } from "axios";
import request from "../../utils/request";
import { ListReport } from "../interfaces/List.interface";

const listReport = (
): Promise<AxiosResponse<ListReport[]>> => {
  return request({
    url: "/api/monitor/report/user",
    method: "GET",
    private: true,
  });
};



const ReportService = {
  listReport
};

export default ReportService;
