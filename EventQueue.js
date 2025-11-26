export class EventQueue {
  constructor() {
    this.queue = [];
    this.waitTimer = 0;
  }

  emit(event) {
    this.queue.push(event);
  }

  clear() {
    this.queue.length = 0;
    this.waitTimer = 0;
  }

  update(dt, handlers) {
    if (this.waitTimer > 0) {
      this.waitTimer -= dt;
      return;
    }

    const ev = this.queue[0];
    if (!ev) return;

    const handler = handlers[ev.type];
    if (handler) {
      handler(ev);
    }

    // Special case: WAIT event
    if (ev.type === "WAIT") {
      this.waitTimer = ev.ms;
    }

    this.queue.shift();
  }

  isIdle() {
    return this.queue.length === 0 && this.waitTimer <= 0;
  }
}
