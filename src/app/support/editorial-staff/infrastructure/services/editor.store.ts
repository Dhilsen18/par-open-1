/**
 * @summary Signal-based store for managing editor state in the editorial-staff bounded context.
 * @author Estudiante U202319440
 */
import { Injectable, signal, computed } from '@angular/core';
import { Editor } from '../../domain/model/editor.entity';
import { EditorRole } from '../../domain/model/editor-role.enum';

@Injectable({ providedIn: 'root' })
export class EditorStore {
  private _editors = signal<Editor[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly editors = this._editors.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly availableEditors = computed(() =>
    this._editors().filter(e => e.status === 'AVAILABLE')
  );

  readonly editorsByRole = computed(() => {
    const roles = Object.values(EditorRole);
    return roles.map(role => ({
      role,
      editors: this._editors().filter(e => e.editorRole === role)
    }));
  });

  setEditors(editors: Editor[]): void {
    this._editors.set(editors);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  addEditor(editor: Editor): void {
    this._editors.update(list => [...list, editor]);
  }
}
