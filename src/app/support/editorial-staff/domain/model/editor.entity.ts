/**
 * @summary Represents an editor entity in the support domain.
 * @author Estudiante U202319440
 */
export class Editor {
  constructor(
    public id: number,
    public trackId: number,
    public editorRole: 'METADATA_REVIEWER' | 'SYNC_SPECIALIST' | 'AUDIO_QUALITY_ANALYST',
    public registeredAt: Date,
    public status: 'AVAILABLE' | 'BUSY'
  ) {}
}
