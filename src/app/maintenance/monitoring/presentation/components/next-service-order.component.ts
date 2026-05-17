/**
 * @summary Standalone component that displays the next HIGH priority service order.
 * @author Estudiante U202319440
 */
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceOrderService } from '../../infrastructure/services/service-order.service';
import { ServiceOrder } from '../../domain/model/service-order.entity';

@Component({
  selector: 'app-next-service-order',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, TranslateModule, DatePipe],
  template: `
    <section aria-label="Next Service Order section">
      <h2>{{ 'HOME.NEXT_SERVICE_ORDER' | translate }}</h2>

      @if (loading()) {
        <p aria-live="polite">Loading service order...</p>
      } @else if (nextOrder()) {
        <mat-card
          class="order-card"
          role="region"
          aria-label="Highest priority service order">
          <mat-card-header>
            <mat-card-title>
              {{ 'SERVICE_ORDER.ID' | translate }}: #{{ nextOrder()!.id }}
            </mat-card-title>
            <mat-card-subtitle>
              <mat-chip color="warn" aria-label="Priority: HIGH">
                {{ nextOrder()!.priority }}
              </mat-chip>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="order-detail" role="group" aria-label="Service order details">
              <div class="detail-row">
                <span class="label">{{ 'SERVICE_ORDER.TRACK' | translate }}</span>
                <span>Track #{{ nextOrder()!.trackId }}</span>
              </div>
              <div class="detail-row">
                <span class="label">{{ 'SERVICE_ORDER.NEEDED_ACTION' | translate }}</span>
                <span>{{ nextOrder()!.neededAction }}</span>
              </div>
              <div class="detail-row">
                <span class="label">{{ 'SERVICE_ORDER.REGISTERED_AT' | translate }}</span>
                <span>{{ nextOrder()!.registeredAt | date:'medium' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      } @else {
        <p>{{ 'SERVICE_ORDER.NO_ORDER' | translate }}</p>
      }
    </section>
  `,
  styles: [`
    section { margin-bottom: 32px; }
    h2 { font-size: 20px; font-weight: 500; margin-bottom: 16px; }
    .order-card {
      max-width: 480px;
      background: #ffffff;
      color: #111827;
      border: 1px solid rgba(17, 24, 39, 0.08);
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(17, 24, 39, 0.08);
    }
    .label {
      font-weight: 500;
      color: rgba(17, 24, 39, 0.68);
      font-size: 13px;
    }
  `]
})
export class NextServiceOrderComponent implements OnInit {
  private serviceOrderService = inject(ServiceOrderService);
  nextOrder = signal<ServiceOrder | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.serviceOrderService.getAll().subscribe({
      next: (orders) => {
        const highPriority = orders
          .filter(o => o.priority === 'HIGH')
          .sort((a, b) => a.registeredAt.getTime() - b.registeredAt.getTime());
        this.nextOrder.set(highPriority[0] ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
