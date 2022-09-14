import { EventEmitter as Events } from 'events';

enum EmitterEvents {
  PaymenySuccess = 'PAYMENT_SUCCESS',
}

export class EventEmitter extends Events {
  constructor() {
    super();
  }
  addEventListener(
    event: keyof typeof EmitterEvents,
    handler: (...args: any[]) => void,
  ) {
    this.on(EmitterEvents[event], handler);
  }
  emitEvent(event: keyof typeof EmitterEvents, args: any) {
    this.emit(EmitterEvents[event], args);
  }
}

export const Emitter = new EventEmitter();
