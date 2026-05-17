/**
 * @summary Assembler that converts TrackResponse to Track entity and vice versa.
 * @author Estudiante U202319440
 */
import { Injectable } from '@angular/core';
import { Track } from '../domain/model/track.entity';
import { TrackResponse } from './track.response';

@Injectable({ providedIn: 'root' })
export class TrackAssembler {
  toEntity(response: TrackResponse): Track {
    return new Track(
      response.id,
      response.name,
      response.costPerHour,
      response.impactInPlayback,
      response.defaultAction
    );
  }

  toEntityList(responses: TrackResponse[]): Track[] {
    return responses.map(r => this.toEntity(r));
  }
}
