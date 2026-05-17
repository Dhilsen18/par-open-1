/**
 * @summary Assembler that converts EditorResponse to Editor entity and vice versa.
 * @author Estudiante U202319440
 */
import { Injectable } from '@angular/core';
import { Editor } from '../domain/model/editor.entity';
import { EditorResponse } from './editor.response';

@Injectable({ providedIn: 'root' })
export class EditorAssembler {
  toEntity(response: EditorResponse): Editor {
    return new Editor(
      response.id,
      response.trackId,
      response.editorRole,
      new Date(response.registeredAt),
      response.status
    );
  }

  toEntityList(responses: EditorResponse[]): Editor[] {
    return responses.map(r => this.toEntity(r));
  }
}
