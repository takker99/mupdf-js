import { type AnyBuffer, makeBufferPtr } from "./buffer.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";
import { makeCharPtr, toText } from "./string.ts";

export type FontSimpleEncoding = "Latin" | "Greek" | "Cyrillic";

export type FontCJKOrdering = 0 | 1 | 2 | 3;

export type FontCJKLanguage =
  | "Adobe-CNS1"
  | "Adobe-GB1"
  | "Adobe-Japan1"
  | "Adobe-Korea1"
  | "zh-Hant"
  | "zh-TW"
  | "zh-HK"
  | "zh-Hans"
  | "zh-CN"
  | "ja"
  | "ko";

export const SIMPLE_ENCODING = [
  "Latin",
  "Greek",
  "Cyrillic",
] as const satisfies FontSimpleEncoding[];

export const ADOBE_CNS = 0;
export const ADOBE_GB = 1;
export const ADOBE_JAPAN = 2;
export const ADOBE_KOREA = 3;

export const CJK_ORDERING_BY_LANG = {
  "Adobe-CNS1": 0,
  "Adobe-GB1": 1,
  "Adobe-Japan1": 2,
  "Adobe-Korea1": 3,
  "zh-Hant": 0,
  "zh-TW": 0,
  "zh-HK": 0,
  "zh-Hans": 1,
  "zh-CN": 1,
  "ja": 2,
  "ko": 3,
} as const satisfies Record<FontCJKLanguage, FontCJKOrdering>;

export class Font implements Disposable {
  pointer: Pointer<"fz_font">;

  [Symbol.dispose](): void {
    libmupdf._wasm_drop_font(this.pointer);
  }

  constructor(name: string);
  constructor(name: string, data: AnyBuffer, subfont?: number);
  constructor(pointer: Pointer<"fz_font">);

  constructor(
    name_or_pointer: Pointer<"fz_font"> | string,
    data?: AnyBuffer,
    subfont = 0,
  ) {
    let pointer = 0 as Pointer<"fz_font">;
    if (typeof name_or_pointer === "number") {
      pointer = libmupdf._wasm_keep_font(name_or_pointer);
    } else {
      if (data) {
        pointer = libmupdf._wasm_new_font_from_buffer(
          makeCharPtr(name_or_pointer),
          makeBufferPtr(data),
          subfont,
        );
      } else {
        pointer = libmupdf._wasm_new_base14_font(makeCharPtr(name_or_pointer));
      }
    }
    this.pointer = pointer;
  }

  get name(): string {
    return toText(libmupdf._wasm_font_get_name(this.pointer));
  }

  encodeCharacter(uni: number | string): number {
    if (typeof uni === "string") {
      uni = uni.charCodeAt(0);
    }
    return libmupdf._wasm_encode_character(this.pointer, uni);
  }

  advanceGlyph(gid: number, wmode = 0): number {
    return libmupdf._wasm_advance_glyph(this.pointer, gid, wmode);
  }

  get isMono(): boolean {
    return !!libmupdf._wasm_font_is_monospaced(this.pointer);
  }

  get isSerif(): boolean {
    return !!libmupdf._wasm_font_is_serif(this.pointer);
  }

  get isBold(): boolean {
    return !!libmupdf._wasm_font_is_bold(this.pointer);
  }

  get isItalic(): boolean {
    return !!libmupdf._wasm_font_is_italic(this.pointer);
  }
}
