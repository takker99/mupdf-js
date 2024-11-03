import type { Pointer } from "./Pointer.ts";

export abstract class Userdata<B extends string> {
  static #_finalizer: FinalizationRegistry<number>;

  // deno-lint-ignore no-explicit-any
  static readonly _drop: (pointer: Pointer<any>) => void;

  pointer: Pointer<B>;

  constructor(pointer: Pointer<B>) {
    if (pointer !== 0) {
      const ctor = this.constructor as typeof Userdata;
      if (!ctor.#_finalizer) {
        ctor.#_finalizer = new FinalizationRegistry(ctor._drop);
      }
      ctor.#_finalizer.register(this, pointer, this);
    }
    this.pointer = pointer;
  }

  destroy(): void {
    if (this.pointer !== 0) {
      const ctor = this.constructor as typeof Userdata;
      ctor.#_finalizer.unregister(this);
      ctor._drop(this.pointer);
    }
    this.pointer = 0 as Pointer<B>;
  }

  toString(): string {
    return `[${this.constructor.name} ${this.pointer}]`;
  }

  // deno-lint-ignore no-explicit-any
  valueOf(): any {
    throw new Error("cannot convert Userdata to Javascript value");
  }
}
