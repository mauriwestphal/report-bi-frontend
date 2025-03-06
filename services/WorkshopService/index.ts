import { AxiosResponse } from "axios";
import request from "../../utils/request";

const listWorkShops = () => {
    return request({
        url:'/api/workshops',
        method:'GET',
        private:true,
    })
};

const listServices = () => {
    return request({
        url:'/api/services',
        method:'GET',
        private:true,
    })
};

const listZones = () => {
    return request({
        url:'/api/zones',
        method:'GET',
        private:true,
    })
};

const listSupervisorContrato = () => {
    return request({
        url:'/api/supervisor',
        method:'GET',
        private:true,
    })

}

const WorkshopServices = {
    listWorkShops,
    listServices,
    listZones,
    listSupervisorContrato
}

export default WorkshopServices;