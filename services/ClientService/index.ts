import request from '../../utils/request';
import { SystemClient } from '../types';

export class ClientService {
  async getUserClients(): Promise<SystemClient[]> {
    const response = await request<SystemClient[]>({
      url: '/api/system-client/user-clients',
      method: 'GET',
      private: true,
    });
    return response.data;
  }

  async getClient(id: number): Promise<SystemClient> {
    const response = await request<SystemClient>({
      url: `/api/system-client/${id}`,
      method: 'GET',
      private: true,
    });
    return response.data;
  }
}

export const clientService = new ClientService();