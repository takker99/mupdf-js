import { type Color, setCurrentColor } from "./color.ts";
import type { ColorSpace } from "./ColorSpace.ts";
import { ENUM } from "./enum.ts";
import type { Image } from "./image.ts";
import { MATRIX, type Matrix } from "./Matrix.ts";
import { libmupdf } from "./module.ts";
import type { Path } from "./path.ts";
import type { Pointer } from "./Pointer.ts";
import { RECT, type Rect, RECT2 } from "./Rect.ts";
import type { Shade } from "./shade.ts";
import { makeCharPtr } from "./string.ts";
import type { StrokeState } from "./stroke.ts";
import type { Text } from "./text.ts";
import { Userdata } from "./Userdata.ts";

export type BlendMode =
  | "Normal"
  | "Multiply"
  | "Screen"
  | "Overlay"
  | "Darken"
  | "Lighten"
  | "ColorDodge"
  | "ColorBurn"
  | "HardLight"
  | "SoftLight"
  | "Difference"
  | "Exclusion"
  | "Hue"
  | "Saturation"
  | "Color"
  | "Luminosity";

export class Device extends Userdata<"fz_device"> {
  static override readonly _drop: (p: Pointer<"fz_device">) => void =
    libmupdf._wasm_drop_device;

  static readonly BLEND_MODES: BlendMode[] = [
    "Normal",
    "Multiply",
    "Screen",
    "Overlay",
    "Darken",
    "Lighten",
    "ColorDodge",
    "ColorBurn",
    "HardLight",
    "SoftLight",
    "Difference",
    "Exclusion",
    "Hue",
    "Saturation",
    "Color",
    "Luminosity",
  ];

  fillPath(
    path: Path,
    evenOdd: boolean,
    ctm: Matrix,
    colorspace: ColorSpace,
    color: Color,
    alpha: number,
  ): void {
    libmupdf._wasm_fill_path(
      this.pointer,
      path.pointer,
      evenOdd,
      MATRIX(ctm),
      colorspace.pointer,
      setCurrentColor(color),
      alpha,
    );
  }

  strokePath(
    path: Path,
    stroke: StrokeState,
    ctm: Matrix,
    colorspace: ColorSpace,
    color: Color,
    alpha: number,
  ): void {
    libmupdf._wasm_stroke_path(
      this.pointer,
      path.pointer,
      stroke.pointer,
      MATRIX(ctm),
      colorspace.pointer,
      setCurrentColor(color),
      alpha,
    );
  }

  clipPath(path: Path, evenOdd: boolean, ctm: Matrix): void {
    libmupdf._wasm_clip_path(this.pointer, path.pointer, evenOdd, MATRIX(ctm));
  }

  clipStrokePath(path: Path, stroke: StrokeState, ctm: Matrix): void {
    libmupdf._wasm_clip_stroke_path(
      this.pointer,
      path.pointer,
      stroke.pointer,
      MATRIX(ctm),
    );
  }

  fillText(
    text: Text,
    ctm: Matrix,
    colorspace: ColorSpace,
    color: Color,
    alpha: number,
  ): void {
    libmupdf._wasm_fill_text(
      this.pointer,
      text.pointer,
      MATRIX(ctm),
      colorspace.pointer,
      setCurrentColor(color),
      alpha,
    );
  }

  strokeText(
    text: Text,
    stroke: StrokeState,
    ctm: Matrix,
    colorspace: ColorSpace,
    color: Color,
    alpha: number,
  ): void {
    libmupdf._wasm_stroke_text(
      this.pointer,
      text.pointer,
      stroke.pointer,
      MATRIX(ctm),
      colorspace.pointer,
      setCurrentColor(color),
      alpha,
    );
  }

  clipText(text: Text, ctm: Matrix): void {
    libmupdf._wasm_clip_text(this.pointer, text.pointer, MATRIX(ctm));
  }

  clipStrokeText(text: Text, stroke: StrokeState, ctm: Matrix): void {
    libmupdf._wasm_clip_stroke_text(
      this.pointer,
      text.pointer,
      stroke.pointer,
      MATRIX(ctm),
    );
  }

  ignoreText(text: Text, ctm: Matrix): void {
    libmupdf._wasm_ignore_text(this.pointer, text.pointer, MATRIX(ctm));
  }

  fillShade(shade: Shade, ctm: Matrix, alpha: number): void {
    libmupdf._wasm_fill_shade(this.pointer, shade.pointer, MATRIX(ctm), alpha);
  }

  fillImage(image: Image, ctm: Matrix, alpha: number): void {
    libmupdf._wasm_fill_image(this.pointer, image.pointer, MATRIX(ctm), alpha);
  }

  fillImageMask(
    image: Image,
    ctm: Matrix,
    colorspace: ColorSpace,
    color: Color,
    alpha: number,
  ): void {
    libmupdf._wasm_fill_image_mask(
      this.pointer,
      image.pointer,
      MATRIX(ctm),
      colorspace.pointer,
      setCurrentColor(color),
      alpha,
    );
  }

  clipImageMask(image: Image, ctm: Matrix): void {
    libmupdf._wasm_clip_image_mask(this.pointer, image.pointer, MATRIX(ctm));
  }

  popClip(): void {
    libmupdf._wasm_pop_clip(this.pointer);
  }

  beginMask(
    area: Rect,
    luminosity: boolean,
    colorspace: ColorSpace,
    color: Color,
  ): void {
    libmupdf._wasm_begin_mask(
      this.pointer,
      RECT(area),
      luminosity,
      colorspace.pointer,
      setCurrentColor(color),
    );
  }

  endMask(): void {
    libmupdf._wasm_end_mask(this.pointer);
  }

  beginGroup(
    area: Rect,
    colorspace: ColorSpace,
    isolated: boolean,
    knockout: boolean,
    blendmode: BlendMode,
    alpha: number,
  ): void {
    const blendmode_ix = ENUM<BlendMode>(blendmode, Device.BLEND_MODES);
    libmupdf._wasm_begin_group(
      this.pointer,
      RECT(area),
      colorspace.pointer,
      isolated,
      knockout,
      blendmode_ix,
      alpha,
    );
  }

  endGroup(): void {
    libmupdf._wasm_end_group(this.pointer);
  }

  beginTile(
    area: Rect,
    view: Rect,
    xstep: number,
    ystep: number,
    ctm: Matrix,
    id: number,
  ): number {
    return libmupdf._wasm_begin_tile(
      this.pointer,
      RECT(area),
      RECT2(view),
      xstep,
      ystep,
      MATRIX(ctm),
      id,
    );
  }

  endTile(): void {
    libmupdf._wasm_end_tile(this.pointer);
  }

  beginLayer(name: string): void {
    libmupdf._wasm_begin_layer(this.pointer, makeCharPtr(name));
  }

  endLayer(): void {
    libmupdf._wasm_end_layer(this.pointer);
  }

  close(): void {
    libmupdf._wasm_close_device(this.pointer);
  }
}
