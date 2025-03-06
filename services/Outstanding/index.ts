import { AxiosResponse } from "axios";
import request from "../../utils/request";
import { io } from "socket.io-client";

const create = (osIdOutstanding: string): Promise<AxiosResponse<any>> => {
  return request({
    url: `/api/outstanding`,
    method: "POST",
    private: true,
    data: {
      osIdOutstanding,
    },
  });
};

const getAllOutstandings = (): Promise<AxiosResponse<any>> => {
  return request({
    url: `/api/outstanding/outstandings`,
    method: "GET",
    private: true,
  });
};

const OutstandingService = {
  create,
  getAllOutstandings,
};

export default OutstandingService;
