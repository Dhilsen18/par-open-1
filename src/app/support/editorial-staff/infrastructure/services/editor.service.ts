/**
 * @summary Service responsible for HTTP communication with the /editors endpoint.
 * @author Estudiante U202319440
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EditorResponse, EditorRequest } from '../../application/editor.response';
import { EditorAssembler } from '../../application/editor.assembler';
import { Editor } from '../../domain/model/editor.entity';
import { EditorialStaffResource } from './editorial-staff.resource';

@Injectable({ providedIn: 'root' })
export class EditorService {
  private http = inject(HttpClient);
  private assembler = inject(EditorAssembler);

  getAll(): Observable<Editor[]> {
    return this.http.get<EditorResponse[]>(EditorialStaffResource.EDITORS).pipe(
      map(responses => this.assembler.toEntityList(responses))
    );
  }

  getByTrackId(trackId: number): Observable<Editor[]> {
    return this.http.get<EditorResponse[]>(`${EditorialStaffResource.EDITORS}?trackId=${trackId}`).pipe(
      map(responses => this.assembler.toEntityList(responses))
    );
  }

  create(request: EditorRequest): Observable<Editor> {
    return this.http.post<EditorResponse>(EditorialStaffResource.EDITORS, request).pipe(
      map(response => this.assembler.toEntity(response))
    );
  }
}
