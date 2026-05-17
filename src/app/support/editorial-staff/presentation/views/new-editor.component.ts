/**
 * @summary New Editor view component with form to create an editor record and auto-generate a service order.
 * @author Estudiante U202319440
 */
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EditorService } from '../../infrastructure/services/editor.service';
import { ServiceOrderService } from '../../../../maintenance/monitoring/infrastructure/services/service-order.service';
import { TrackService } from '../../../../maintenance/monitoring/infrastructure/services/track.service';
import { Track } from '../../../../maintenance/monitoring/domain/model/track.entity';
import { EditorRole } from '../../domain/model/editor-role.enum';
import { EditorRequest } from '../../application/editor.response';
import { ServiceOrderRequest } from '../../../../maintenance/monitoring/application/service-order.response';

@Component({
  selector: 'app-new-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  template: `
    <main class="new-editor-container" role="main" aria-label="New Editor form page">
      <h1>{{ 'NEW_EDITOR.TITLE' | translate }}</h1>
      <h2>{{ 'NEW_EDITOR.SUBTITLE' | translate }}</h2>

      @if (loading()) {
        <mat-spinner diameter="40" aria-label="Loading"></mat-spinner>
      } @else {
        <form
          [formGroup]="editorForm"
          (ngSubmit)="onSubmit()"
          class="editor-form"
          aria-label="New editor registration form"
          novalidate>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'NEW_EDITOR.TRACK' | translate }}</mat-label>
            <mat-select
              formControlName="trackId"
              [placeholder]="'NEW_EDITOR.TRACK_PLACEHOLDER' | translate"
              aria-label="Select a track"
              aria-required="true">
              @for (track of tracks(); track track.id) {
                <mat-option [value]="track.id">{{ track.name }}</mat-option>
              }
            </mat-select>
            @if (editorForm.get('trackId')?.hasError('required') && editorForm.get('trackId')?.touched) {
              <mat-error>Track is required.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'NEW_EDITOR.EDITOR_ROLE' | translate }}</mat-label>
            <mat-select
              formControlName="editorRole"
              [placeholder]="'NEW_EDITOR.EDITOR_ROLE_PLACEHOLDER' | translate"
              aria-label="Select an editor role"
              aria-required="true">
              @for (role of editorRoles; track role) {
                <mat-option [value]="role">{{ role }}</mat-option>
              }
            </mat-select>
            @if (editorForm.get('editorRole')?.hasError('required') && editorForm.get('editorRole')?.touched) {
              <mat-error>Editor role is required.</mat-error>
            }
          </mat-form-field>

          <div class="form-actions" role="group" aria-label="Form actions">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="editorForm.invalid || submitting()"
              aria-label="Create editor record">
              {{ 'NEW_EDITOR.CREATE' | translate }}
            </button>
            <button
              mat-stroked-button
              type="button"
              (click)="onCancel()"
              aria-label="Cancel and return to Home">
              {{ 'NEW_EDITOR.CANCEL' | translate }}
            </button>
          </div>
        </form>
      }
    </main>
  `,
  styles: [`
    .new-editor-container {
      padding: 24px;
      max-width: 560px;
      margin: 0 auto;
    }
    h1 { font-size: 28px; font-weight: 500; margin-bottom: 4px; }
    h2 { font-size: 16px; opacity: 0.75; margin-bottom: 24px; }
    .editor-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .full-width { width: 100%; }
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }
  `]
})
export class NewEditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private editorService = inject(EditorService);
  private serviceOrderService = inject(ServiceOrderService);
  private trackService = inject(TrackService);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  tracks = signal<Track[]>([]);
  loading = signal(true);
  submitting = signal(false);

  editorRoles = Object.values(EditorRole);

  editorForm: FormGroup = this.fb.group({
    trackId: [null, Validators.required],
    editorRole: [null, Validators.required]
  });

  ngOnInit(): void {
    this.trackService.getAll().subscribe({
      next: (tracks) => {
        this.tracks.set(tracks);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSubmit(): void {
    if (this.editorForm.invalid) return;

    const { trackId, editorRole } = this.editorForm.value;
    const selectedTrack = this.tracks().find(t => t.id === trackId);
    if (!selectedTrack) return;

    this.submitting.set(true);

    this.editorService.getByTrackId(trackId).subscribe({
      next: (editors) => {
        const today = new Date().toDateString();
        const alreadyExists = editors.some(
          e => new Date(e.registeredAt).toDateString() === today
        );

        if (alreadyExists) {
          this.translate.get('NEW_EDITOR.ERROR_DUPLICATE').subscribe(msg => {
            this.snackBar.open(msg, 'OK', { duration: 4000 });
          });
          this.submitting.set(false);
          return;
        }

        const now = new Date().toISOString();

        const editorRequest: EditorRequest = {
          trackId,
          editorRole,
          status: 'AVAILABLE',
          registeredAt: now
        };

        this.editorService.create(editorRequest).subscribe({
          next: () => {
            const orderRequest: ServiceOrderRequest = {
              trackId,
              issueId: null,
              neededAction: selectedTrack.defaultAction,
              priority: 'NORMAL',
              registeredAt: now
            };

            this.serviceOrderService.create(orderRequest).subscribe({
              next: () => {
                this.translate.get('NEW_EDITOR.SUCCESS').subscribe(msg => {
                  this.snackBar.open(msg, 'OK', { duration: 3000 });
                });
                this.router.navigate(['/home']);
              },
              error: () => this.handleError()
            });
          },
          error: () => this.handleError()
        });
      },
      error: () => this.handleError()
    });
  }

  onCancel(): void {
    this.router.navigate(['/home']);
  }

  private handleError(): void {
    this.translate.get('NEW_EDITOR.ERROR_GENERIC').subscribe(msg => {
      this.snackBar.open(msg, 'OK', { duration: 4000 });
    });
    this.submitting.set(false);
  }
}
