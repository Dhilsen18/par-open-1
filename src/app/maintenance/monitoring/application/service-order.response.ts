/**
 * @summary Response interface for ServiceOrder data from the API.
 * @author Estudiante U202319440
 */
export interface ServiceOrderResponse {
  id: number;
  trackId: number;
  issueId: number | null;
  neededAction: 'REPLACE' | 'REPROCESS';
  priority: 'HIGH' | 'NORMAL';
  registeredAt: string;
}

/**
 * @summary Request interface for creating a new ServiceOrder.
 * @author Estudiante U202319440
 */
export interface ServiceOrderRequest {
  trackId: number;
  issueId: number | null;
  neededAction: 'REPLACE' | 'REPROCESS';
  priority: 'HIGH' | 'NORMAL';
  registeredAt: string;
}
