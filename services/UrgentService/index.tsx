

import { AxiosResponse } from "axios";
import request from "../../utils/request";


const create = (osIdUrgent: string): Promise<AxiosResponse<any>> => {

    return request({
        url: '/api/urgent',
        method: 'POST',
        private: true,
        data: {
            osIdUrgent
        }
    });
}

const getAllUrgent = (): Promise<AxiosResponse<any>> => {
    return request({
        url: '/api/urgent/urgents',
        method: 'GET',
        private: true,
    });
}

const UrgentService = {
    create,
    getAllUrgent,
}


export default UrgentService;