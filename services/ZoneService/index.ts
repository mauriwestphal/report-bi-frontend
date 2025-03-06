import { AxiosResponse } from "axios";
import request from "../../utils/request";
import { Zone } from "../interfaces/Zones.interface";

// const listZones = () => {
//     return request({
//         url:'/api/zones',
//         method:'GET',
//         private:true,
//     })
// };

const createZone = (data: CreateorUpdateZone ) => {
    return request({
        url: "/api/monitor",
        method: "POST",
        data,
        private: true 
    }).catch(({data}) => {
        throw data;
    });
}

const listReportBI = () => {
    return request({
        url:"/api/monitor/report/list",
        method:"GET",
        private:true
    })
}

const listScreenDashboard = () =>{
    return request({
        url:"/api/screen-dashboard",
        method:"GET",
        private:true
    })
}
interface CreateorUpdateZone extends Partial<Zone>{}

const ZoneService = {
    // listZones,
    createZone,
    listReportBI,
    listScreenDashboard,
}

export default ZoneService;