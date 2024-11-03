import type { ColorSpace } from "./ColorSpace.ts";
import type { Device } from "./device.ts";
import { MATRIX, type Matrix } from "./Matrix.ts";
import { libmupdf } from "./module.ts";
import { Pixmap } from "./Pixmap.ts";
import type { Pointer } from "./Pointer.ts";
import type { Quad } from "./quad.ts";
import { fromRect, RECT, type Rect } from "./Rect.ts";
import { runSearch } from "./search.ts";
import { makeCharPtr } from "./string.ts";
import { StructuredText } from "./StructuredText.ts";
import { Userdata } from "./Userdata.ts";

export class DisplayList extends Userdata<"fz_display_list"> {
  static override readonly _drop: (p: Pointer<"fz_display_list">) => void =
    libmupdf._wasm_drop_display_list;

  constructor(pointer: Pointer<"fz_display_list">);
  constructor(mediabox: Rect);

  constructor(arg1: Pointer<"fz_display_list"> | Rect) {
    let pointer = 0 as Pointer<"fz_display_list">;
    if (typeof arg1 === "number") {
      pointer = arg1;
    } else {
      pointer = libmupdf._wasm_new_display_list(RECT(arg1));
    }
    super(pointer);
  }

  getBounds(): Rect {
    return fromRect(libmupdf._wasm_bound_display_list(this.pointer));
  }

  toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha = false): Pixmap {
    return new Pixmap(
      libmupdf._wasm_new_pixmap_from_display_list(
        this.pointer,
        MATRIX(matrix),
        colorspace.pointer,
        alpha,
      ),
    );
  }

  toStructuredText(options = ""): StructuredText {
    return new StructuredText(
      libmupdf._wasm_new_stext_page_from_display_list(
        this.pointer,
        makeCharPtr(options),
      ),
    );
  }

  run(device: Device, matrix: Matrix): void {
    libmupdf._wasm_run_display_list(
      this.pointer,
      device.pointer,
      MATRIX(matrix),
    );
  }

  search(needle: string, max_hits = 500): Quad[][] {
    return runSearch(
      libmupdf._wasm_search_display_list,
      this.pointer,
      needle,
      max_hits,
    );
  }
}
