import { AxiosResponse } from "axios";
import { BinnacleInterface,LogsBinnacleInterface } from "../../components/layout/interfaces";
import request from "../../utils/request";

const list = (id: string): Promise<AxiosResponse<LogsBinnacleInterface[]>> => {
  return request({
    url: `/api/screen-dashboard/${id}/binnacle`,
    method: "GET",
    private: true,
  });
};

const create = (id: string, message: string): Promise<AxiosResponse<any>> => {
  return request({
    url: `/api/screen-dashboard/${id}/binnacle`,
    method: "POST",
    private: true,
    data: {
      message,
    },
  });
};

const BinnacleService = {
  list,
  create,
};

export default BinnacleService;
