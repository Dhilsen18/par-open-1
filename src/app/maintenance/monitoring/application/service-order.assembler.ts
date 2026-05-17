/**
 * @summary Assembler that converts ServiceOrderResponse to ServiceOrder entity.
 * @author Estudiante U202319440
 */
import { Injectable } from '@angular/core';
import { ServiceOrder } from '../domain/model/service-order.entity';
import { ServiceOrderResponse } from './service-order.response';

@Injectable({ providedIn: 'root' })
export class ServiceOrderAssembler {
  toEntity(response: ServiceOrderResponse): ServiceOrder {
    return new ServiceOrder(
      response.id,
      response.trackId,
      response.issueId,
      response.neededAction,
      response.priority,
      new Date(response.registeredAt)
    );
  }

  toEntityList(responses: ServiceOrderResponse[]): ServiceOrder[] {
    return responses.map(r => this.toEntity(r));
  }
}
