export class StateMachine {
  constructor() {
    this.current = null;
  }

  change(state) {
    if (this.current) this.current.exit();
    this.current = state;
    state.enter();
  }

  update(dt) {
    if (!this.current) return;

    this.current.update(dt);

    // console.log(this.current.constructor.name);

    if (this.current.isFinished()) {
      const next = this.current.nextState();
      if (next) this.change(next);
    }
  }
}