/**
 * @summary Response interface for Editor data from the API.
 * @author Estudiante U202319440
 */
export interface EditorResponse {
  id: number;
  trackId: number;
  editorRole: 'METADATA_REVIEWER' | 'SYNC_SPECIALIST' | 'AUDIO_QUALITY_ANALYST';
  registeredAt: string;
  status: 'AVAILABLE' | 'BUSY';
}

/**
 * @summary Request interface for creating a new Editor record.
 * @author Estudiante U202319440
 */
export interface EditorRequest {
  trackId: number;
  editorRole: 'METADATA_REVIEWER' | 'SYNC_SPECIALIST' | 'AUDIO_QUALITY_ANALYST';
  registeredAt: string;
  status: 'AVAILABLE' | 'BUSY';
}
