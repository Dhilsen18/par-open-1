/**
 * @summary Resource class defining API endpoints for the monitoring bounded context.
 * @author Estudiante U202319440
 */
import { environment } from '../../../../../environments/environment';

export class MonitoringResource {
  static readonly BASE = environment.apiUrl;
  static readonly TRACKS = `${MonitoringResource.BASE}/tracks`;
  static readonly SERVICE_ORDERS = `${MonitoringResource.BASE}/service-orders`;
}
