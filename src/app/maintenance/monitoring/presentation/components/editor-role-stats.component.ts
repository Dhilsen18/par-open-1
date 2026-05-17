/**
 * @summary Standalone component that displays statistics for a specific editor role using a Material card.
 * @author Estudiante U202319440
 */
import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { Editor } from '../../../../support/editorial-staff/domain/model/editor.entity';
import { EditorRole } from '../../../../support/editorial-staff/domain/model/editor-role.enum';
import { TrackService } from '../../infrastructure/services/track.service';
import { Track } from '../../domain/model/track.entity';

@Component({
  selector: 'app-editor-role-stats',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  template: `
    <mat-card
      class="role-card"
      role="region"
      [attr.aria-label]="role + ' statistics card'">
      <mat-card-header>
        <mat-card-title>{{ role }}</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div class="stat-row" aria-label="Cost per hour for available editors">
          <span class="stat-label">{{ 'EDITOR_ROLE_STATS.COST_PER_HOUR' | translate }}</span>
          <span class="stat-value">\${{ costPerHour() }}</span>
        </div>
        <div class="stat-row" aria-label="Accumulated cost for available editors">
          <span class="stat-label">{{ 'EDITOR_ROLE_STATS.ACCUMULATED_COST' | translate }}</span>
          <span class="stat-value">\${{ accumulatedCost() }}</span>
        </div>
      </mat-card-content>

      <mat-card-footer>
        <div class="footer-row" aria-label="Number of active editors">
          <span class="stat-label">{{ 'EDITOR_ROLE_STATS.ACTIVE_EDITORS' | translate }}</span>
          <span class="stat-value active-count">{{ activeCount() }}</span>
        </div>
      </mat-card-footer>
    </mat-card>
  `,
  styles: [`
    .role-card {
      height: 100%;
      transition: box-shadow 0.2s;
      background: #ffffff;
      color: #111827;
      border: 1px solid rgba(17, 24, 39, 0.08);
    }
    .role-card:hover {
      box-shadow: 0 8px 24px rgba(17, 24, 39, 0.12);
    }
    mat-card-title {
      font-size: 14px;
      word-break: break-word;
      color: #111827;
    }
    .stat-row, .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid rgba(17, 24, 39, 0.08);
    }
    .stat-label {
      font-size: 12px;
      color: rgba(17, 24, 39, 0.68);
    }
    .stat-value {
      font-weight: 500;
      font-size: 14px;
      color: #111827;
    }
    .active-count {
      font-size: 18px;
      font-weight: bold;
      color: #b91c1c;
    }
    mat-card-footer {
      padding: 8px 16px;
    }
  `]
})
export class EditorRoleStatsComponent implements OnInit {
  @Input({ required: true }) role!: EditorRole;
  @Input({ required: true }) editors!: Editor[];

  private trackService = inject(TrackService);
  private tracks = signal<Track[]>([]);

  ngOnInit(): void {
    this.trackService.getAll().subscribe(t => this.tracks.set(t));
  }

  availableEditors = computed(() =>
    (this.editors ?? []).filter(e => e.status === 'AVAILABLE')
  );

  activeCount = computed(() => this.availableEditors().length);

  costPerHour = computed(() => {
    const trackMap = new Map(this.tracks().map(t => [t.id, t]));
    return this.availableEditors().reduce((sum, e) => {
      const track = trackMap.get(e.trackId);
      return sum + (track ? track.costPerHour : 0);
    }, 0);
  });

  accumulatedCost = computed(() => {
    const trackMap = new Map(this.tracks().map(t => [t.id, t]));
    const now = new Date();
    const total = this.availableEditors().reduce((sum, e) => {
      const track = trackMap.get(e.trackId);
      if (!track) return sum;
      const hours = Math.round((now.getTime() - e.registeredAt.getTime()) / 3600000);
      return sum + track.costPerHour * hours;
    }, 0);
    return total.toFixed(2);
  });
}
