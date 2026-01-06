/**
 * Police station service for getting police station data
 */

import { BaseService } from './base.service';

/**
 * Police station information
 */
export interface PoliceStation {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  [key: string]: unknown;
}

/**
 * Response for getting police stations
 */
export type GetPoliceStationsResponse = PoliceStation[];

/**
 * Service for police station operations
 */
export class PoliceStationService extends BaseService {
  /**
   * Get all police stations
   */
  async getPoliceStations(): Promise<GetPoliceStationsResponse> {
    return this.httpClient.get<GetPoliceStationsResponse>('/police_stations');
  }
}
