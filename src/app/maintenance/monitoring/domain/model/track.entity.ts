/**
 * @summary Represents a music track entity in the maintenance domain.
 * @author Estudiante U202319440
 */
export class Track {
  constructor(
    public id: number,
    public name: string,
    public costPerHour: number,
    public impactInPlayback: 'NONE' | 'PARTIAL' | 'TOTAL',
    public defaultAction: 'REPLACE' | 'REPROCESS'
  ) {}
}
