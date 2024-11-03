import { type AnyBuffer, makeBufferPtr } from "./buffer.ts";
import { ColorSpace } from "./ColorSpace.ts";
import { libmupdf } from "./module.ts";
import { Pixmap } from "./Pixmap.ts";
import type { Pointer } from "./Pointer.ts";
import { Userdata } from "./Userdata.ts";

export class Image extends Userdata<"fz_image"> {
  static override readonly _drop: (p: Pointer<"fz_image">) => void =
    libmupdf._wasm_drop_image;

  constructor(pointer: Pointer<"fz_image">);
  constructor(data: AnyBuffer);
  constructor(pixmap: Pixmap, mask?: Image);

  constructor(
    pixmap_or_buffer: Pointer<"fz_image"> | Pixmap | AnyBuffer,
    mask?: Image,
  ) {
    let pointer = 0 as Pointer<"fz_image">;
    if (typeof pixmap_or_buffer === "number") {
      pointer = libmupdf._wasm_keep_image(pixmap_or_buffer);
    } else if (pixmap_or_buffer instanceof Pixmap) {
      pointer = libmupdf._wasm_new_image_from_pixmap(
        pixmap_or_buffer.pointer,
        mask ? mask.pointer : 0 as Pointer<"fz_image">,
      );
    } else {
      pointer = libmupdf._wasm_new_image_from_buffer(
        makeBufferPtr(pixmap_or_buffer),
      );
    }
    super(pointer);
  }

  getWidth(): number {
    return libmupdf._wasm_image_get_w(this.pointer);
  }

  getHeight(): number {
    return libmupdf._wasm_image_get_h(this.pointer);
  }

  getNumberOfComponents(): number {
    return libmupdf._wasm_image_get_n(this.pointer);
  }

  getBitsPerComponent(): number {
    return libmupdf._wasm_image_get_bpc(this.pointer);
  }

  getXResolution(): number {
    return libmupdf._wasm_image_get_xres(this.pointer);
  }

  getYResolution(): number {
    return libmupdf._wasm_image_get_yres(this.pointer);
  }

  getImageMask(): boolean {
    return !!libmupdf._wasm_image_get_imagemask(this.pointer);
  }

  getColorSpace(): ColorSpace | null {
    const cs = libmupdf._wasm_image_get_colorspace(this.pointer);
    if (cs) {
      return new ColorSpace(libmupdf._wasm_keep_colorspace(cs));
    }
    return null;
  }

  getMask(): Image | null {
    const mask = libmupdf._wasm_image_get_mask(this.pointer);
    if (mask) {
      return new Image(libmupdf._wasm_keep_image(mask));
    }
    return null;
  }

  toPixmap(): Pixmap {
    return new Pixmap(libmupdf._wasm_get_pixmap_from_image(this.pointer));
  }
}
