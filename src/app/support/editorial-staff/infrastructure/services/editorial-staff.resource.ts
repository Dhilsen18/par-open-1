/**
 * @summary Resource class defining API endpoints for the editorial-staff bounded context.
 * @author Estudiante U202319440
 */
import { environment } from '../../../../../environments/environment';

export class EditorialStaffResource {
  static readonly BASE = environment.apiUrl;
  static readonly EDITORS = `${EditorialStaffResource.BASE}/editors`;
}
