import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";
import { fromRect, type Rect } from "./Rect.ts";
import { Userdata } from "./Userdata.ts";

export class Shade extends Userdata<"fz_shade"> {
  static override readonly _drop: (p: Pointer<"fz_shade">) => void =
    libmupdf._wasm_drop_shade;
  getBounds(): Rect {
    return fromRect(libmupdf._wasm_bound_shade(this.pointer));
  }
}
