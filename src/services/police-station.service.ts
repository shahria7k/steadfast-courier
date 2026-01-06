/**
 * Police station service for getting police station data
 *
 * This module provides functionality for retrieving police station information
 * from Steadfast Courier. This data may be required for certain delivery operations.
 *
 * @module services/police-station
 */

import { BaseService } from './base.service';

/**
 * Police station information
 *
 * Represents a police station with its details.
 *
 * @example
 * ```typescript
 * const stations = await client.policeStations.getPoliceStations();
 *
 * stations.forEach((station) => {
 *   console.log(`${station.name}: ${station.address || 'No address'}`);
 * });
 * ```
 */
export interface PoliceStation {
  /** Unique police station identifier */
  id: number;
  /** Name of the police station */
  name: string;
  /** Optional address of the police station */
  address?: string;
  /** Optional phone number of the police station */
  phone?: string;
  /** Additional properties that may be present in the response */
  [key: string]: unknown;
}

/**
 * Response for getting police stations
 *
 * Array of all available police stations.
 *
 * @see {@link PoliceStationService.getPoliceStations} For getting all police stations
 */
export type GetPoliceStationsResponse = PoliceStation[];

/**
 * Service for police station operations
 *
 * Provides methods to retrieve police station information.
 *
 * @example
 * ```typescript
 * import { SteadfastClient } from 'steadfast-courier';
 *
 * const client = new SteadfastClient({
 *   apiKey: 'your-api-key',
 *   secretKey: 'your-secret-key',
 * });
 *
 * const stations = await client.policeStations.getPoliceStations();
 * console.log(`Total police stations: ${stations.length}`);
 * ```
 *
 * @see {@link GetPoliceStationsResponse} For response structure
 */
export class PoliceStationService extends BaseService {
  /**
   * Get all police stations
   *
   * Retrieves a list of all available police stations.
   * This information may be required for certain delivery operations.
   *
   * @returns Promise resolving to an array of police station information
   * @throws {SteadfastApiError} If the API request fails
   *
   * @example
   * ```typescript
   * const stations = await client.policeStations.getPoliceStations();
   *
   * // Find a specific station
   * const station = stations.find(s => s.name.includes('Dhaka'));
   * if (station) {
   *   console.log(`Found: ${station.name}`);
   *   console.log(`Address: ${station.address || 'N/A'}`);
   *   console.log(`Phone: ${station.phone || 'N/A'}`);
   * }
   * ```
   *
   * @see {@link GetPoliceStationsResponse} For response structure
   */
  async getPoliceStations(): Promise<GetPoliceStationsResponse> {
    return this.httpClient.get<GetPoliceStationsResponse>('/police_stations');
  }
}
