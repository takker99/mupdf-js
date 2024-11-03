import { MATRIX, type Matrix } from "./Matrix.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";
import { fromRect, type Rect } from "./Rect.ts";
import type { StrokeState } from "./stroke.ts";
import { Userdata } from "./Userdata.ts";

export class Path extends Userdata<"fz_path"> {
  static override readonly _drop: (p: Pointer<"fz_path">) => void =
    libmupdf._wasm_drop_path;

  // deno-lint-ignore constructor-super
  constructor(pointer?: Pointer<"fz_path">) {
    if (typeof pointer === "number") {
      super(pointer);
    } else {
      super(libmupdf._wasm_new_path());
    }
  }

  getBounds(strokeState: StrokeState, transform: Matrix): Rect {
    return fromRect(
      libmupdf._wasm_bound_path(
        this.pointer,
        strokeState?.pointer,
        MATRIX(transform),
      ),
    );
  }

  moveTo(x: number, y: number): void {
    libmupdf._wasm_moveto(this.pointer, x, y);
  }

  lineTo(x: number, y: number): void {
    libmupdf._wasm_lineto(this.pointer, x, y);
  }

  curveTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
  ): void {
    libmupdf._wasm_curveto(this.pointer, x1, y1, x2, y2, x3, y3);
  }

  curveToV(cx: number, cy: number, ex: number, ey: number): void {
    libmupdf._wasm_curvetov(this.pointer, cx, cy, ex, ey);
  }

  curveToY(cx: number, cy: number, ex: number, ey: number): void {
    libmupdf._wasm_curvetoy(this.pointer, cx, cy, ex, ey);
  }

  closePath(): void {
    libmupdf._wasm_closepath(this.pointer);
  }

  rect(x1: number, y1: number, x2: number, y2: number): void {
    libmupdf._wasm_rectto(this.pointer, x1, y1, x2, y2);
  }

  transform(matrix: Matrix): void {
    libmupdf._wasm_transform_path(this.pointer, MATRIX(matrix));
  }

  walk(_walker: unknown): never {
    throw "TODO";
  }
}
