/**
 * @summary Service responsible for HTTP communication with the /service-orders endpoint.
 * @author Estudiante U202319440
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceOrderResponse, ServiceOrderRequest } from '../../application/service-order.response';
import { ServiceOrderAssembler } from '../../application/service-order.assembler';
import { ServiceOrder } from '../../domain/model/service-order.entity';
import { MonitoringResource } from './monitoring.resource';

@Injectable({ providedIn: 'root' })
export class ServiceOrderService {
  private http = inject(HttpClient);
  private assembler = inject(ServiceOrderAssembler);

  getAll(): Observable<ServiceOrder[]> {
    return this.http.get<ServiceOrderResponse[]>(MonitoringResource.SERVICE_ORDERS).pipe(
      map(responses => this.assembler.toEntityList(responses))
    );
  }

  create(request: ServiceOrderRequest): Observable<ServiceOrder> {
    return this.http.post<ServiceOrderResponse>(MonitoringResource.SERVICE_ORDERS, request).pipe(
      map(response => this.assembler.toEntity(response))
    );
  }
}
