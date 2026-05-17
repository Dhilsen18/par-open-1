/**
 * @summary Service responsible for HTTP communication with the /tracks endpoint.
 * @author Estudiante U202319440
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TrackResponse } from '../../application/track.response';
import { TrackAssembler } from '../../application/track.assembler';
import { Track } from '../../domain/model/track.entity';
import { MonitoringResource } from './monitoring.resource';

@Injectable({ providedIn: 'root' })
export class TrackService {
  private http = inject(HttpClient);
  private assembler = inject(TrackAssembler);

  getAll(): Observable<Track[]> {
    return this.http.get<TrackResponse[]>(MonitoringResource.TRACKS).pipe(
      map(responses => this.assembler.toEntityList(responses))
    );
  }
}
