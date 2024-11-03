import { type AnyBuffer, makeBufferPtr } from "./buffer.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";
import { makeCharPtr, toText } from "./string.ts";
import { Userdata } from "./Userdata.ts";

export type ColorSpaceType =
  | "None"
  | "Gray"
  | "RGB"
  | "BGR"
  | "CMYK"
  | "Lab"
  | "Indexed"
  | "Separation";

export const COLORSPACE_TYPES = [
  "None",
  "Gray",
  "RGB",
  "BGR",
  "CMYK",
  "Lab",
  "Indexed",
  "Separation",
] as const satisfies ColorSpaceType[];

export class ColorSpace extends Userdata<"fz_colorspace"> {
  static override readonly _drop: (p: Pointer<"fz_colorspace">) => void =
    libmupdf._wasm_drop_colorspace;

  // Create ColorSpace from ICC profile.
  constructor(profile: AnyBuffer, name: string);

  // PRIVATE
  constructor(pointer: Pointer<"fz_colorspace">);

  constructor(from: Pointer<"fz_colorspace"> | AnyBuffer, name?: string) {
    super(
      typeof from === "number" ? from : libmupdf._wasm_new_icc_colorspace(
        makeCharPtr(name),
        makeBufferPtr(from),
      ),
    );
  }

  getName(): string {
    return toText(libmupdf._wasm_colorspace_get_name(this.pointer));
  }

  get type(): ColorSpaceType {
    return COLORSPACE_TYPES[libmupdf._wasm_colorspace_get_type(this.pointer)] ||
      "None";
  }

  getNumberOfComponents(): number {
    return libmupdf._wasm_colorspace_get_n(this.pointer);
  }

  get isGray(): boolean {
    return this.type === "Gray";
  }
  get isRGB(): boolean {
    return this.type === "RGB";
  }
  get isCMYK(): boolean {
    return this.type === "CMYK";
  }
  get isIndexed(): boolean {
    return this.type === "Indexed";
  }
  get isLab(): boolean {
    return this.type === "Lab";
  }
  get isDeviceN(): boolean {
    return this.type === "Separation";
  }
  get isSubtractive(): boolean {
    return this.type === "CMYK" || this.type === "Separation";
  }

  override toString(): string {
    return "[ColorSpace " + this.getName() + "]";
  }
}

export const DeviceGray: ColorSpace = /* @__PURE__ */ new ColorSpace(
  libmupdf._wasm_device_gray(),
);
export const DeviceRGB: ColorSpace = /* @__PURE__ */ new ColorSpace(
  libmupdf._wasm_device_rgb(),
);
export const DeviceBGR: ColorSpace = /* @__PURE__ */ new ColorSpace(
  libmupdf._wasm_device_bgr(),
);
export const DeviceCMYK: ColorSpace = /* @__PURE__ */ new ColorSpace(
  libmupdf._wasm_device_cmyk(),
);
export const Lab: ColorSpace = /* @__PURE__ */ new ColorSpace(
  libmupdf._wasm_device_lab(),
);
