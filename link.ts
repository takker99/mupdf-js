import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";
import { fromRect, RECT, type Rect } from "./Rect.ts";
import { makeCharPtr, toText } from "./string.ts";
import { Userdata } from "./Userdata.ts";

export class Link extends Userdata<"fz_link"> {
  static override readonly _drop: (p: Pointer<"fz_link">) => void =
    libmupdf._wasm_drop_link;

  get bounds(): Rect {
    return fromRect(libmupdf._wasm_link_get_rect(this.pointer));
  }

  set bounds(rect: Rect) {
    libmupdf._wasm_link_set_rect(this.pointer, RECT(rect));
  }

  get URI(): string {
    return toText(libmupdf._wasm_link_get_uri(this.pointer));
  }

  set URI(uri: string) {
    libmupdf._wasm_link_set_uri(this.pointer, makeCharPtr(uri));
  }

  get isExternal(): boolean {
    return /^\w[\w+-.]*:/.test(this.URI);
  }
}
