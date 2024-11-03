import { toUint8Array } from "./buffer.ts";
import type { Color } from "./color.ts";
import { ColorSpace } from "./ColorSpace.ts";
import { libmupdf } from "./module.ts";
import type { Point } from "./point.ts";
import type { Pointer } from "./Pointer.ts";
import { QUAD, type Quad } from "./quad.ts";
import { RECT, type Rect } from "./Rect.ts";
import { Userdata } from "./Userdata.ts";

/**
 * A `Pixmap` object contains a color raster image (short for pixel map).
 * The components in a pixel in the `Pixmap` are all byte values, with the transparency as the last component.
 * A `Pixmap` also has a location (x, y) in addition to its size; so that they can easily be used to represent tiles of a page.
 */
export class Pixmap extends Userdata<"fz_pixmap"> {
  static override readonly _drop = libmupdf._wasm_drop_pixmap;

  constructor(pointer: Pointer<"fz_pixmap">);
  constructor(colorspace: ColorSpace, bbox: Rect, alpha: boolean);

  /**
   * Create a new pixmap. The pixel data is **not** initialized; and will contain garbage.
   *
   * @param arg1
   * @param bbox
   * @param alpha
   */
  // deno-lint-ignore constructor-super
  constructor(
    arg1: Pointer<"fz_pixmap"> | ColorSpace,
    bbox?: Rect,
    alpha = false,
  ) {
    if (typeof arg1 === "number") {
      super(arg1);
    }
    if (arg1 instanceof ColorSpace) {
      if (!bbox) throw new Error("bbox is required");
      super(
        libmupdf._wasm_new_pixmap_with_bbox(arg1.pointer, RECT(bbox), alpha),
      );
    }
    if (arg1 === null) {
      if (!bbox) throw new Error("bbox is required");
      super(
        libmupdf._wasm_new_pixmap_with_bbox(
          0 as Pointer<"fz_colorspace">,
          RECT(bbox),
          alpha,
        ),
      );
    }
  }

  getBounds(): Rect {
    const x = libmupdf._wasm_pixmap_get_x(this.pointer);
    const y = libmupdf._wasm_pixmap_get_y(this.pointer);
    const w = libmupdf._wasm_pixmap_get_w(this.pointer);
    const h = libmupdf._wasm_pixmap_get_h(this.pointer);
    return [x, y, x + w, y + h];
  }

  clear(value?: number): void {
    if (typeof value === "undefined") {
      libmupdf._wasm_clear_pixmap(this.pointer);
    } else {
      libmupdf._wasm_clear_pixmap_with_value(this.pointer, value);
    }
  }

  getWidth(): number {
    return libmupdf._wasm_pixmap_get_w(this.pointer);
  }
  getHeight(): number {
    return libmupdf._wasm_pixmap_get_h(this.pointer);
  }
  getX(): number {
    return libmupdf._wasm_pixmap_get_x(this.pointer);
  }
  getY(): number {
    return libmupdf._wasm_pixmap_get_y(this.pointer);
  }
  getStride(): number {
    return libmupdf._wasm_pixmap_get_stride(this.pointer);
  }
  getNumberOfComponents(): number {
    return libmupdf._wasm_pixmap_get_n(this.pointer);
  }
  getAlpha(): number {
    return libmupdf._wasm_pixmap_get_alpha(this.pointer);
  }
  getXResolution(): number {
    return libmupdf._wasm_pixmap_get_xres(this.pointer);
  }
  getYResolution(): number {
    return libmupdf._wasm_pixmap_get_yres(this.pointer);
  }

  setResolution(x: number, y: number): void {
    libmupdf._wasm_pixmap_set_xres(this.pointer, x);
    libmupdf._wasm_pixmap_set_yres(this.pointer, y);
  }

  getColorSpace(): ColorSpace | null {
    const cs = libmupdf._wasm_pixmap_get_colorspace(this.pointer);
    if (cs) {
      return new ColorSpace(libmupdf._wasm_keep_colorspace(cs));
    }
    return null;
  }

  getPixels(): Uint8ClampedArray {
    const s = libmupdf._wasm_pixmap_get_stride(this.pointer);
    const h = libmupdf._wasm_pixmap_get_h(this.pointer);
    const p = libmupdf._wasm_pixmap_get_samples(this.pointer);
    return new Uint8ClampedArray(libmupdf.HEAPU8.buffer, p, s * h);
  }

  asPNG(): Uint8Array {
    const buf = libmupdf._wasm_new_buffer_from_pixmap_as_png(this.pointer);
    try {
      return toUint8Array(buf);
    } finally {
      libmupdf._wasm_drop_buffer(buf);
    }
  }

  asPSD(): Uint8Array {
    const buf = libmupdf._wasm_new_buffer_from_pixmap_as_psd(this.pointer);
    try {
      return toUint8Array(buf);
    } finally {
      libmupdf._wasm_drop_buffer(buf);
    }
  }

  asPAM(): Uint8Array {
    const buf = libmupdf._wasm_new_buffer_from_pixmap_as_pam(this.pointer);
    try {
      return toUint8Array(buf);
    } finally {
      libmupdf._wasm_drop_buffer(buf);
    }
  }

  /**
   * Returns a buffer of the {@linkcode Pixmap} as a **JPEG**.
   * Note, if the {@linkcode Pixmap} has an alpha channel then an exception will be thrown.
   *
   * @param quality
   * @param invert_cmyk
   * @returns
   */
  asJPEG(quality: number, invert_cmyk: boolean): Uint8Array {
    const buf = libmupdf._wasm_new_buffer_from_pixmap_as_jpeg(
      this.pointer,
      quality,
      invert_cmyk,
    );
    try {
      return toUint8Array(buf);
    } finally {
      libmupdf._wasm_drop_buffer(buf);
    }
  }

  invert(): void {
    libmupdf._wasm_invert_pixmap(this.pointer);
  }

  invertLuminance(): void {
    libmupdf._wasm_invert_pixmap_luminance(this.pointer);
  }

  gamma(p: number): void {
    libmupdf._wasm_gamma_pixmap(this.pointer, p);
  }

  tint(black: number | Color, white: number | Color): void {
    let black_hex = 0x000000;
    let white_hex = 0xffffff;
    if (typeof black === "number") {
      black_hex = black;
    } else if (black instanceof Array && black.length === 3) {
      black_hex = ((black[0] * 255) << 16) | ((black[1] * 255) << 8) |
        (black[2] * 255);
    }
    if (typeof white === "number") {
      white_hex = white;
    } else if (white instanceof Array && white.length === 3) {
      white = ((white[0] * 255) << 16) | ((white[1] * 255) << 8) |
        (white[2] * 255);
    }
    libmupdf._wasm_tint_pixmap(this.pointer, black_hex, white_hex);
  }

  convertToColorSpace(colorspace: ColorSpace, keepAlpha = false): Pixmap {
    return new Pixmap(
      libmupdf._wasm_convert_pixmap(
        this.pointer,
        colorspace.pointer,
        keepAlpha,
      ),
    );
  }

  warp(points: Point[], width: number, height: number): Pixmap {
    const quad = points.flat();
    if (quad.length !== 8) {
      throw new Error("invalid number of points for warp");
    }
    return new Pixmap(
      libmupdf._wasm_warp_pixmap(
        this.pointer,
        QUAD(quad as Quad),
        width,
        height,
      ),
    );
  }
}
