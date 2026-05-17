/**
 * @summary Represents a service order entity in the maintenance domain.
 * @author Estudiante U202319440
 */
export class ServiceOrder {
  constructor(
    public id: number,
    public trackId: number,
    public issueId: number | null,
    public neededAction: 'REPLACE' | 'REPROCESS',
    public priority: 'HIGH' | 'NORMAL',
    public registeredAt: Date
  ) {}
}
