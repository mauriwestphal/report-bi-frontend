import { AxiosResponse } from "axios";
import { DashboardInterface, FilterInterface } from "../../components/layout/interfaces";
import request from "../../utils/request";


const listOrder = (): Promise<AxiosResponse<DashboardInterface[]>> => {
    return  request({
        url: `api/listOrder/recentEntries`,
        method:"GET",
        private: true 
    });
}

const listOrderOpen = (pageSize: number = 0, filter: FilterInterface) : Promise<AxiosResponse<DashboardInterface[]>> => {
    
    const queryParams = new URLSearchParams(filter as {}).toString();

    return  request({
        url: `api/listOrder/orderOpen/${pageSize}/filter?${queryParams}`,
        method:"GET",
        private: true 
    });
}

const listOrderOpenDays = () : Promise<AxiosResponse<DashboardInterface[]>> => {
    return  request({
        url: `api/listOrder/orderOpenDays`,
        method:"GET",
        private: true
    });
}

const listOrderPreventiveTechnicalReview = (): Promise<AxiosResponse<DashboardInterface[]>> => {
    return  request({
        url: `api/listOrder/preventiveTechnicalReview`,
        method:"GET",
        private: true 
    });
}

const listOrderFeatured = (): Promise<AxiosResponse<DashboardInterface[]>> => {
    return  request({
        url: `api/listOrder/featured`,
        method:"GET",
        private: true 
    });
}

const listOrderUrgent = (): Promise<AxiosResponse<DashboardInterface[]>> => {
    return  request({
        url: `api/listOrder/urgent`,
        method:"GET",
        private: true
    });
}

const lastUpdate = (): Promise<AxiosResponse> => {
    return  request({
        url: `/api/listOrder/lastUpdate`,
        method:"GET",
        private: true 
    });
}

const getColors = (): Promise<AxiosResponse> => { 
    return request({
        url: `/api/screen-dashboard/metricas/colour`,
        method:"GET",
        private: true
    })
}

const getSlas = (): Promise<AxiosResponse> => { 
    return request({
        url: `/api/screen-dashboard/metricas/slas`,
        method:"GET",
        private: true
    })
}

const getOneMonitorIdentifier = (identifier: string): Promise<AxiosResponse> => { 
    return request({
        url: `/api/monitor/identifier/${identifier}`,
        method:"GET",
        private: true
    })
}

const getStatusSla = (): Promise<AxiosResponse> => { 
    return request({
        url: `api/screen-dashboard/metricas/statusSla`,
        method:"GET",
        private: true
    })
}

const getLogs = (os: string) => { 
    return request({
        url: `api/listOrder/logs/${os}`,
        method:"GET",
        private: true
    }).catch(({ data }) => {
        throw data;
    });
} 

const getDetailVehicle = (caseid: string) => {
    return request({
        url: `api/listOrderOpen/flotaVehicle/${caseid}`,
        method:"GET",
        private: true
    }).catch(({ data }) => {
        throw data;
    });
}

export  {listOrderFeatured, listOrder, listOrderOpen, lastUpdate, getColors, getSlas, getOneMonitorIdentifier, getStatusSla, listOrderPreventiveTechnicalReview, getLogs, getDetailVehicle, listOrderOpenDays, listOrderUrgent};