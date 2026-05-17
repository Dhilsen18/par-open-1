/**
 * @summary Standalone component that displays the Editor Analytics grid with stats per role.
 * @author Estudiante U202319440
 */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { TranslateModule } from '@ngx-translate/core';
import { EditorService } from '../../infrastructure/services/editor.service';
import { EditorStore } from '../../infrastructure/services/editor.store';
import { EditorRole } from '../../domain/model/editor-role.enum';
import { EditorRoleStatsComponent } from '../../../../maintenance/monitoring/presentation/components/editor-role-stats.component';
import { Editor } from '../../domain/model/editor.entity';

@Component({
  selector: 'app-editor-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    TranslateModule,
    EditorRoleStatsComponent
  ],
  template: `
    <section aria-label="Editor Analytics section">
      <h2>{{ 'HOME.EDITOR_ANALYTICS' | translate }}</h2>

      @if (store.loading()) {
        <p aria-live="polite">Loading editor analytics...</p>
      } @else {
        <mat-grid-list cols="3" rowHeight="220px" gutterSize="16px" role="list">
          @for (roleData of editorRoles; track roleData.role) {
            <mat-grid-tile role="listitem">
              <app-editor-role-stats
                [role]="roleData.role"
                [editors]="getEditorsByRole(roleData.role)">
              </app-editor-role-stats>
            </mat-grid-tile>
          }
        </mat-grid-list>
      }
    </section>
  `,
  styles: [`
    section { margin-bottom: 32px; }
    h2 {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 16px;
    }
    mat-grid-list { width: 100%; }
  `]
})
export class EditorAnalyticsComponent implements OnInit {
  store = inject(EditorStore);
  private editorService = inject(EditorService);

  editorRoles = [
    { role: EditorRole.METADATA_REVIEWER },
    { role: EditorRole.SYNC_SPECIALIST },
    { role: EditorRole.AUDIO_QUALITY_ANALYST }
  ];

  ngOnInit(): void {
    this.store.setLoading(true);
    this.editorService.getAll().subscribe({
      next: (editors) => {
        this.store.setEditors(editors);
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setError('Failed to load editors');
        this.store.setLoading(false);
      }
    });
  }

  getEditorsByRole(role: EditorRole): Editor[] {
    return this.store.editors().filter(e => e.editorRole === role);
  }
}
