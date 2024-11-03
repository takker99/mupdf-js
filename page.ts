import type { ColorSpace } from "./ColorSpace.ts";
import type { Device } from "./device.ts";
import { DisplayList } from "./DisplayList.ts";
import { Link } from "./link.ts";
import { MATRIX, type Matrix } from "./Matrix.ts";
import { libmupdf } from "./module.ts";
import { PDFPage } from "./PDFPage.ts";
import { Pixmap } from "./Pixmap.ts";
import type { Quad } from "./quad.ts";
import { fromRect, RECT, type Rect } from "./Rect.ts";
import { runSearch } from "./search.ts";
import { makeCharPtr, toText } from "./string.ts";
import { StructuredText } from "./StructuredText.ts";
import { Userdata } from "./Userdata.ts";

export type PageBox =
  | "MediaBox"
  | "CropBox"
  | "BleedBox"
  | "TrimBox"
  | "ArtBox";

export const BOXES = [
  "MediaBox",
  "CropBox",
  "BleedBox",
  "TrimBox",
  "ArtBox",
] as const satisfies PageBox[];

export class Page extends Userdata<"any_page"> {
  static override readonly _drop = libmupdf._wasm_drop_page;

  isPDF(): this is PDFPage {
    return this instanceof PDFPage;
  }

  getBounds(box: PageBox = "CropBox"): Rect {
    const box_ix = BOXES.indexOf(box);
    return fromRect(libmupdf._wasm_bound_page(this.pointer, box_ix));
  }

  getLabel(): string {
    return toText(libmupdf._wasm_page_label(this.pointer));
  }

  run(device: Device, matrix: Matrix): void {
    libmupdf._wasm_run_page(this.pointer, device.pointer, MATRIX(matrix));
  }

  runPageContents(device: Device, matrix: Matrix): void {
    libmupdf._wasm_run_page_contents(
      this.pointer,
      device.pointer,
      MATRIX(matrix),
    );
  }

  runPageAnnots(device: Device, matrix: Matrix): void {
    libmupdf._wasm_run_page_annots(
      this.pointer,
      device.pointer,
      MATRIX(matrix),
    );
  }

  runPageWidgets(device: Device, matrix: Matrix): void {
    libmupdf._wasm_run_page_widgets(
      this.pointer,
      device.pointer,
      MATRIX(matrix),
    );
  }

  toPixmap(
    matrix: Matrix,
    colorspace: ColorSpace,
    alpha = false,
    showExtras = true,
  ): Pixmap {
    let result;
    if (showExtras) {
      result = libmupdf._wasm_new_pixmap_from_page(
        this.pointer,
        MATRIX(matrix),
        colorspace.pointer,
        alpha,
      );
    } else {
      result = libmupdf._wasm_new_pixmap_from_page_contents(
        this.pointer,
        MATRIX(matrix),
        colorspace.pointer,
        alpha,
      );
    }
    return new Pixmap(result);
  }

  toDisplayList(showExtras = true): DisplayList {
    let result;
    if (showExtras) {
      result = libmupdf._wasm_new_display_list_from_page(this.pointer);
    } else {
      result = libmupdf._wasm_new_display_list_from_page_contents(this.pointer);
    }
    return new DisplayList(result);
  }

  toStructuredText(options = ""): StructuredText {
    return new StructuredText(
      libmupdf._wasm_new_stext_page_from_page(
        this.pointer,
        makeCharPtr(options),
      ),
    );
  }

  *getLinks(): Generator<Link, void, unknown> {
    let link = libmupdf._wasm_load_links(this.pointer);
    while (link) {
      yield new Link(libmupdf._wasm_keep_link(link));
      link = libmupdf._wasm_link_get_next(link);
    }
  }

  createLink(bbox: Rect, uri: string): Link {
    return new Link(
      libmupdf._wasm_create_link(this.pointer, RECT(bbox), makeCharPtr(uri)),
    );
  }

  deleteLink(link: Link): void {
    libmupdf._wasm_delete_link(this.pointer, link.pointer);
  }

  search(needle: string, max_hits = 500): Quad[][] {
    return runSearch(
      libmupdf._wasm_search_page,
      this.pointer,
      needle,
      max_hits,
    );
  }
}
