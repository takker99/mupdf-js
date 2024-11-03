import type { Font } from "./font.ts";
import { fromMatrix, MATRIX, type Matrix } from "./Matrix.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";
import { fromRect, type Rect } from "./Rect.ts";
import { makeCharPtr } from "./string.ts";
import type { StrokeState } from "./stroke.ts";

export class Text implements Disposable {
  [Symbol.dispose](): void {
    libmupdf._wasm_drop_text(this.pointer);
  }

  constructor(public pointer: Pointer<"fz_text"> = libmupdf._wasm_new_text()) {}

  getBounds(strokeState: StrokeState, transform: Matrix): Rect {
    return fromRect(
      libmupdf._wasm_bound_text(
        this.pointer,
        strokeState?.pointer,
        MATRIX(transform),
      ),
    );
  }

  showGlyph(
    font: Font,
    trm: Matrix,
    gid: number,
    uni: number,
    wmode = 0,
  ): void {
    libmupdf._wasm_show_glyph(
      this.pointer,
      font.pointer,
      MATRIX(trm),
      gid,
      uni,
      wmode,
    );
  }

  showString(font: Font, trm: Matrix, str: string, wmode = 0): Matrix {
    return fromMatrix(
      libmupdf._wasm_show_string(
        this.pointer,
        font.pointer,
        MATRIX(trm),
        makeCharPtr(str),
        wmode,
      ),
    );
  }

  walk(_walker: unknown): never {
    throw "TODO";
  }
}
