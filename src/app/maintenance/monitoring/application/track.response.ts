/**
 * @summary Response interface for Track data from the API.
 * @author Estudiante U202319440
 */
export interface TrackResponse {
  id: number;
  name: string;
  costPerHour: number;
  impactInPlayback: 'NONE' | 'PARTIAL' | 'TOTAL';
  defaultAction: 'REPLACE' | 'REPROCESS';
}
