import { type AnyBuffer, makeBufferPtr } from "./buffer.ts";
import { type Color, getCurrentColor, setCurrentColor } from "./color.ts";
import type { ColorSpace } from "./ColorSpace.ts";
import type { Device } from "./device.ts";
import { DisplayList } from "./DisplayList.ts";
import { ENUM } from "./enum.ts";
import { MATRIX, type Matrix } from "./Matrix.ts";
import { libmupdf } from "./module.ts";
import type { PDFDocument } from "./PDFDocument.ts";
import {
  keepPDFObject,
  type PDFObject,
  type PDFObjectLike,
} from "./PDFObject.ts";
import { Pixmap } from "./Pixmap.ts";
import {
  _wasm_point,
  checkPoint,
  fromPoint,
  POINT,
  type Point,
  POINT2,
  POINT3,
} from "./point.ts";
import type { Pointer } from "./Pointer.ts";
import { fromQuad, QUAD, type Quad } from "./quad.ts";
import { fromRect, RECT, type Rect } from "./Rect.ts";
import { makeCharPtr, STRING2_OPT, toText } from "./string.ts";
import { Userdata } from "./Userdata.ts";

export type PDFAnnotationType =
  | "Text"
  | "Link"
  | "FreeText"
  | "Line"
  | "Square"
  | "Circle"
  | "Polygon"
  | "PolyLine"
  | "Highlight"
  | "Underline"
  | "Squiggly"
  | "StrikeOut"
  | "Redact"
  | "Stamp"
  | "Caret"
  | "Ink"
  | "Popup"
  | "FileAttachment"
  | "Sound"
  | "Movie"
  | "RichMedia"
  | "Widget"
  | "Screen"
  | "PrinterMark"
  | "TrapNet"
  | "Watermark"
  | "3D"
  | "Projection";

export type PDFAnnotationLineEndingStyle =
  | "None"
  | "Square"
  | "Circle"
  | "Diamond"
  | "OpenArrow"
  | "ClosedArrow"
  | "Butt"
  | "ROpenArrow"
  | "RClosedArrow"
  | "Slash";

export type PDFAnnotationBorderStyle =
  | "Solid"
  | "Dashed"
  | "Beveled"
  | "Inset"
  | "Underline";

export type PDFAnnotationBorderEffect = "None" | "Cloudy";

export type PDFAnnotationIntent =
  | null
  | "FreeTextCallout"
  | "FreeTextTypeWriter"
  | "LineArrow"
  | "LineDimension"
  | "PloyLine"
  | "PolygonCloud"
  | "PolygonDimension"
  | "StampImage"
  | "StampSnapshot";

export class PDFAnnotation extends Userdata<"pdf_annot"> {
  static override readonly _drop = libmupdf._wasm_pdf_drop_annot;

  _doc: PDFDocument;

  /* IMPORTANT: Keep in sync with mupdf/pdf/annot.h and PDFAnnotation.java */
  static readonly ANNOT_TYPES: PDFAnnotationType[] = [
    "Text",
    "Link",
    "FreeText",
    "Line",
    "Square",
    "Circle",
    "Polygon",
    "PolyLine",
    "Highlight",
    "Underline",
    "Squiggly",
    "StrikeOut",
    "Redact",
    "Stamp",
    "Caret",
    "Ink",
    "Popup",
    "FileAttachment",
    "Sound",
    "Movie",
    "RichMedia",
    "Widget",
    "Screen",
    "PrinterMark",
    "TrapNet",
    "Watermark",
    "3D",
    "Projection",
  ];

  static readonly LINE_ENDING: PDFAnnotationLineEndingStyle[] = [
    "None",
    "Square",
    "Circle",
    "Diamond",
    "OpenArrow",
    "ClosedArrow",
    "Butt",
    "ROpenArrow",
    "RClosedArrow",
    "Slash",
  ];

  static readonly BORDER_STYLE: PDFAnnotationBorderStyle[] = [
    "Solid",
    "Dashed",
    "Beveled",
    "Inset",
    "Underline",
  ];

  static readonly BORDER_EFFECT: PDFAnnotationBorderEffect[] = [
    "None",
    "Cloudy",
  ];

  static readonly INTENT: PDFAnnotationIntent[] = [
    null,
    "FreeTextCallout",
    "FreeTextTypeWriter",
    "LineArrow",
    "LineDimension",
    "PloyLine",
    "PolygonCloud",
    "PolygonDimension",
    "StampImage",
    "StampSnapshot",
  ];

  // Bit masks for getFlags and setFlags
  static readonly IS_INVISIBLE = 1 << (1 - 1);
  static readonly IS_HIDDEN = 1 << (2 - 1);
  static readonly IS_PRINT = 1 << (3 - 1);
  static readonly IS_NO_ZOOM = 1 << (4 - 1);
  static readonly IS_NO_ROTATE = 1 << (5 - 1);
  static readonly IS_NO_VIEW = 1 << (6 - 1);
  static readonly IS_READ_ONLY = 1 << (7 - 1);
  static readonly IS_LOCKED = 1 << (8 - 1);
  static readonly IS_TOGGLE_NO_VIEW = 1 << (9 - 1);
  static readonly IS_LOCKED_CONTENTS = 1 << (10 - 1);

  // PRIVATE
  constructor(doc: PDFDocument, pointer: Pointer<"pdf_annot">) {
    super(pointer);
    this._doc = doc;
  }

  getObject(): PDFObject {
    return keepPDFObject(this._doc, libmupdf._wasm_pdf_annot_obj(this.pointer));
  }

  getBounds(): Rect {
    return fromRect(libmupdf._wasm_pdf_bound_annot(this.pointer));
  }

  run(device: Device, matrix: Matrix): void {
    libmupdf._wasm_pdf_run_annot(this.pointer, device.pointer, MATRIX(matrix));
  }

  toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha = false): Pixmap {
    return new Pixmap(
      libmupdf._wasm_pdf_new_pixmap_from_annot(
        this.pointer,
        MATRIX(matrix),
        colorspace.pointer,
        alpha,
      ),
    );
  }

  toDisplayList(): DisplayList {
    return new DisplayList(
      libmupdf._wasm_pdf_new_display_list_from_annot(this.pointer),
    );
  }

  update(): boolean {
    return !!libmupdf._wasm_pdf_update_annot(this.pointer);
  }

  getType(): PDFAnnotationType {
    const type = libmupdf._wasm_pdf_annot_type(this.pointer);
    return PDFAnnotation.ANNOT_TYPES[type] || "Text";
  }

  getLanguage(): string {
    return toText(libmupdf._wasm_pdf_annot_language(this.pointer));
  }

  setLanguage(lang: string): void {
    libmupdf._wasm_pdf_set_annot_language(this.pointer, makeCharPtr(lang));
  }

  getFlags(): number {
    return libmupdf._wasm_pdf_annot_flags(this.pointer);
  }

  setFlags(flags: number): void {
    return libmupdf._wasm_pdf_set_annot_flags(this.pointer, flags);
  }

  getContents(): string {
    return toText(libmupdf._wasm_pdf_annot_contents(this.pointer));
  }

  setContents(text: string): void {
    libmupdf._wasm_pdf_set_annot_contents(this.pointer, makeCharPtr(text));
  }

  getAuthor(): string {
    return toText(libmupdf._wasm_pdf_annot_author(this.pointer));
  }

  setAuthor(text: string): void {
    libmupdf._wasm_pdf_set_annot_author(this.pointer, makeCharPtr(text));
  }

  getCreationDate(): Date {
    return new Date(
      libmupdf._wasm_pdf_annot_creation_date(this.pointer) * 1000,
    );
  }

  setCreationDate(date: Date): void {
    libmupdf._wasm_pdf_set_annot_creation_date(
      this.pointer,
      date.getTime() / 1000,
    );
  }

  getModificationDate(): Date {
    return new Date(
      libmupdf._wasm_pdf_annot_modification_date(this.pointer) * 1000,
    );
  }

  setModificationDate(date: Date): void {
    libmupdf._wasm_pdf_set_annot_modification_date(
      this.pointer,
      date.getTime() / 1000,
    );
  }

  hasRect(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_rect(this.pointer);
  }
  hasInkList(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_ink_list(this.pointer);
  }
  hasQuadPoints(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_quad_points(this.pointer);
  }
  hasVertices(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_vertices(this.pointer);
  }
  hasLine(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_line(this.pointer);
  }
  hasInteriorColor(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_interior_color(this.pointer);
  }
  hasLineEndingStyles(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_line_ending_styles(this.pointer);
  }
  hasBorder(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_border(this.pointer);
  }
  hasBorderEffect(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_border_effect(this.pointer);
  }
  hasIcon(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_icon_name(this.pointer);
  }
  hasOpen(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_open(this.pointer);
  }
  hasAuthor(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_author(this.pointer);
  }
  hasFilespec(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_filespec(this.pointer);
  }
  hasCallout(): boolean {
    return !!libmupdf._wasm_pdf_annot_has_callout(this.pointer);
  }

  getRect(): Rect {
    return fromRect(libmupdf._wasm_pdf_annot_rect(this.pointer));
  }

  setRect(rect: Rect): void {
    libmupdf._wasm_pdf_set_annot_rect(this.pointer, RECT(rect));
  }

  getPopup(): Rect {
    return fromRect(libmupdf._wasm_pdf_annot_popup(this.pointer));
  }

  setPopup(rect: Rect): void {
    libmupdf._wasm_pdf_set_annot_popup(this.pointer, RECT(rect));
  }

  getIsOpen(): boolean {
    return !!libmupdf._wasm_pdf_annot_is_open(this.pointer);
  }

  setIsOpen(isOpen: boolean): void {
    libmupdf._wasm_pdf_set_annot_is_open(this.pointer, isOpen);
  }

  getHiddenForEditing(): boolean {
    return !!libmupdf._wasm_pdf_annot_hidden_for_editing(this.pointer);
  }

  setHiddenForEditing(isHidden: boolean): void {
    libmupdf._wasm_pdf_set_annot_hidden_for_editing(this.pointer, isHidden);
  }

  getIcon(): string {
    return toText(libmupdf._wasm_pdf_annot_icon_name(this.pointer));
  }

  setIcon(text: string): void {
    libmupdf._wasm_pdf_set_annot_icon_name(this.pointer, makeCharPtr(text));
  }

  getOpacity(): number {
    return libmupdf._wasm_pdf_annot_opacity(this.pointer);
  }

  setOpacity(opacity: number): void {
    libmupdf._wasm_pdf_set_annot_opacity(this.pointer, opacity);
  }

  getQuadding(): number {
    return libmupdf._wasm_pdf_annot_quadding(this.pointer);
  }

  setQuadding(quadding: number): void {
    libmupdf._wasm_pdf_set_annot_quadding(this.pointer, quadding);
  }

  getLine(): [Point, Point] {
    const a = fromPoint(libmupdf._wasm_pdf_annot_line_1(this.pointer));
    const b = fromPoint(libmupdf._wasm_pdf_annot_line_2(this.pointer));
    return [a, b];
  }

  setLine(a: Point, b: Point): void {
    checkPoint(a);
    checkPoint(b);
    libmupdf._wasm_pdf_set_annot_line(this.pointer, POINT(a), POINT2(b));
  }

  getLineEndingStyles(): {
    start: PDFAnnotationLineEndingStyle;
    end: PDFAnnotationLineEndingStyle;
  } {
    const a = libmupdf._wasm_pdf_annot_line_ending_styles_start(this.pointer);
    const b = libmupdf._wasm_pdf_annot_line_ending_styles_end(this.pointer);
    return {
      start: PDFAnnotation.LINE_ENDING[a] || "None",
      end: PDFAnnotation.LINE_ENDING[b] || "None",
    };
  }

  setLineEndingStyles(
    start: PDFAnnotationLineEndingStyle,
    end: PDFAnnotationLineEndingStyle,
  ): void {
    const start_ix = ENUM<PDFAnnotationLineEndingStyle>(
      start,
      PDFAnnotation.LINE_ENDING,
    );
    const end_ix = ENUM<PDFAnnotationLineEndingStyle>(
      end,
      PDFAnnotation.LINE_ENDING,
    );
    libmupdf._wasm_pdf_set_annot_line_ending_styles(
      this.pointer,
      start_ix,
      end_ix,
    );
  }

  getLineCaption(): boolean {
    return libmupdf._wasm_pdf_annot_line_caption(this.pointer);
  }

  setLineCaption(on: boolean): void {
    return libmupdf._wasm_pdf_set_annot_line_caption(this.pointer, on);
  }

  getLineCaptionOffset(): Point {
    return fromPoint(
      libmupdf._wasm_pdf_annot_line_caption_offset(this.pointer),
    );
  }

  setLineCaptionOffset(p: Point): void {
    return libmupdf._wasm_pdf_set_annot_line_caption_offset(
      this.pointer,
      POINT(p),
    );
  }

  getLineLeader(): number {
    return libmupdf._wasm_pdf_annot_line_leader(this.pointer);
  }

  getLineLeaderExtension(): number {
    return libmupdf._wasm_pdf_annot_line_leader_extension(this.pointer);
  }

  getLineLeaderOffset(): number {
    return libmupdf._wasm_pdf_annot_line_leader_offset(this.pointer);
  }

  setLineLeader(v: number): void {
    return libmupdf._wasm_pdf_set_annot_line_leader(this.pointer, v);
  }

  setLineLeaderExtension(v: number): void {
    return libmupdf._wasm_pdf_set_annot_line_leader_extension(this.pointer, v);
  }

  setLineLeaderOffset(v: number): void {
    return libmupdf._wasm_pdf_set_annot_line_leader_offset(this.pointer, v);
  }

  getCalloutStyle(): PDFAnnotationLineEndingStyle {
    const style = libmupdf._wasm_pdf_annot_callout_style(this.pointer);
    return PDFAnnotation.LINE_ENDING[style] || "None";
  }

  setCalloutStyle(style: PDFAnnotationLineEndingStyle): void {
    const style_ix = ENUM<PDFAnnotationLineEndingStyle>(
      style,
      PDFAnnotation.LINE_ENDING,
    );
    libmupdf._wasm_pdf_set_annot_callout_style(this.pointer, style_ix);
  }

  getCalloutLine(): [Point, Point, Point] | [Point, Point] | undefined {
    const n = libmupdf._wasm_pdf_annot_callout_line(
      this.pointer,
      (_wasm_point << 2) as Pointer<"fz_point">,
    );
    if (n == 3) {
      return [
        fromPoint((_wasm_point + 0) << 2 as Pointer<"fz_point">),
        fromPoint((_wasm_point + 1) << 2 as Pointer<"fz_point">),
        fromPoint((_wasm_point + 2) << 2 as Pointer<"fz_point">),
      ];
    }
    if (n == 2) {
      return [
        fromPoint((_wasm_point + 0) << 2 as Pointer<"fz_point">),
        fromPoint((_wasm_point + 1) << 2 as Pointer<"fz_point">),
      ];
    }
    return undefined;
  }

  setCalloutLine(line: Point[]): void {
    const a = line[0] || [0, 0];
    const b = line[1] || [0, 0];
    const c = line[2] || [0, 0];
    libmupdf._wasm_pdf_set_annot_callout_line(
      this.pointer,
      line.length,
      POINT(a),
      POINT2(b),
      POINT3(c),
    );
  }

  getCalloutPoint(): Point | undefined {
    const line = this.getCalloutLine();
    if (line) {
      return line[0];
    }
    return undefined;
  }

  setCalloutPoint(p: Point): void {
    libmupdf._wasm_pdf_set_annot_callout_point(this.pointer, POINT(p));
  }

  getColor(): Color {
    return getCurrentColor(
      libmupdf._wasm_pdf_annot_color(this.pointer, setCurrentColor()) as
        | 1
        | 3
        | 4,
    );
  }

  getInteriorColor(): Color {
    return getCurrentColor(
      libmupdf._wasm_pdf_annot_interior_color(
        this.pointer,
        setCurrentColor(),
      ) as 1 | 3 | 4,
    );
  }

  setColor(color: Color): void {
    libmupdf._wasm_pdf_set_annot_color(
      this.pointer,
      color.length,
      setCurrentColor(color),
    );
  }

  setInteriorColor(color: Color): void {
    libmupdf._wasm_pdf_set_annot_interior_color(
      this.pointer,
      color.length,
      setCurrentColor(color),
    );
  }

  getBorderWidth(): number {
    return libmupdf._wasm_pdf_annot_border_width(this.pointer);
  }

  setBorderWidth(value: number): void {
    return libmupdf._wasm_pdf_set_annot_border_width(this.pointer, value);
  }

  getBorderStyle(): PDFAnnotationBorderStyle {
    return PDFAnnotation
      .BORDER_STYLE[libmupdf._wasm_pdf_annot_border_style(this.pointer)] ||
      "Solid";
  }

  setBorderStyle(value: PDFAnnotationBorderStyle): void {
    const value_ix = ENUM<PDFAnnotationBorderStyle>(
      value,
      PDFAnnotation.BORDER_STYLE,
    );
    return libmupdf._wasm_pdf_set_annot_border_style(this.pointer, value_ix);
  }

  getBorderEffect(): PDFAnnotationBorderEffect {
    return PDFAnnotation
      .BORDER_EFFECT[libmupdf._wasm_pdf_annot_border_effect(this.pointer)] ||
      "None";
  }

  setBorderEffect(value: PDFAnnotationBorderEffect): void {
    const value_ix = ENUM<PDFAnnotationBorderEffect>(
      value,
      PDFAnnotation.BORDER_EFFECT,
    );
    return libmupdf._wasm_pdf_set_annot_border_effect(this.pointer, value_ix);
  }

  getBorderEffectIntensity(): number {
    return libmupdf._wasm_pdf_annot_border_effect_intensity(this.pointer);
  }

  setBorderEffectIntensity(value: number): void {
    return libmupdf._wasm_pdf_set_annot_border_effect_intensity(
      this.pointer,
      value,
    );
  }

  getBorderDashCount(): number {
    return libmupdf._wasm_pdf_annot_border_dash_count(this.pointer);
  }

  getBorderDashItem(idx: number): number {
    return libmupdf._wasm_pdf_annot_border_dash_item(this.pointer, idx);
  }

  clearBorderDash(): void {
    return libmupdf._wasm_pdf_clear_annot_border_dash(this.pointer);
  }

  addBorderDashItem(v: number): void {
    return libmupdf._wasm_pdf_add_annot_border_dash_item(this.pointer, v);
  }

  getBorderDashPattern(): number[] {
    const n = this.getBorderDashCount();
    const result: number[] = [];
    for (let i = 0; i < n; ++i) {
      result.push(this.getBorderDashItem(i));
    }
    return result;
  }

  setBorderDashPattern(list: number[]): void {
    this.clearBorderDash();
    for (const v of list) {
      this.addBorderDashItem(v);
    }
  }

  getIntent(): PDFAnnotationIntent {
    return PDFAnnotation
      .INTENT[libmupdf._wasm_pdf_annot_intent(this.pointer)] || null;
  }

  setIntent(value: PDFAnnotationIntent): void {
    const value_ix = ENUM<PDFAnnotationIntent>(value, PDFAnnotation.INTENT);
    return libmupdf._wasm_pdf_set_annot_intent(this.pointer, value_ix);
  }

  setDefaultAppearance(fontName: string, size: number, color: Color): void {
    libmupdf._wasm_pdf_set_annot_default_appearance(
      this.pointer,
      makeCharPtr(fontName),
      size,
      color.length,
      setCurrentColor(color),
    );
  }

  getDefaultAppearance(): {
    font: string;
    size: number;
    color: Color;
  } {
    const font = toText(
      libmupdf._wasm_pdf_annot_default_appearance_font(this.pointer),
    );
    const size = libmupdf._wasm_pdf_annot_default_appearance_size(this.pointer);
    const color = getCurrentColor(
      libmupdf._wasm_pdf_annot_default_appearance_color(
        this.pointer,
        setCurrentColor(),
      ) as 1 | 3 | 4,
    );
    return { font, size, color };
  }

  getFileSpec(): PDFObject {
    return keepPDFObject(
      this._doc,
      libmupdf._wasm_pdf_annot_filespec(this.pointer),
    );
  }

  setFileSpec(fs: PDFObject): void {
    return libmupdf._wasm_pdf_set_annot_filespec(
      this.pointer,
      this._doc._PDFOBJ(fs),
    );
  }

  getQuadPoints(): Quad[] {
    const n = libmupdf._wasm_pdf_annot_quad_point_count(this.pointer);
    const result: Quad[] = [];
    for (let i = 0; i < n; ++i) {
      result.push(
        fromQuad(libmupdf._wasm_pdf_annot_quad_point(this.pointer, i)),
      );
    }
    return result;
  }

  clearQuadPoints(): void {
    libmupdf._wasm_pdf_clear_annot_quad_points(this.pointer);
  }

  addQuadPoint(quad: Quad): void {
    libmupdf._wasm_pdf_add_annot_quad_point(this.pointer, QUAD(quad));
  }

  setQuadPoints(quadlist: Quad[]): void {
    this.clearQuadPoints();
    for (const quad of quadlist) {
      this.addQuadPoint(quad);
    }
  }

  getVertices(): Point[] {
    const n = libmupdf._wasm_pdf_annot_vertex_count(this.pointer);
    const result: Point[] = new Array(n);
    for (let i = 0; i < n; ++i) {
      result[i] = fromPoint(libmupdf._wasm_pdf_annot_vertex(this.pointer, i));
    }
    return result;
  }

  clearVertices(): void {
    libmupdf._wasm_pdf_clear_annot_vertices(this.pointer);
  }

  addVertex(vertex: Point): void {
    checkPoint(vertex);
    libmupdf._wasm_pdf_add_annot_vertex(this.pointer, POINT(vertex));
  }

  setVertices(vertexlist: Point[]): void {
    this.clearVertices();
    for (const vertex of vertexlist) {
      this.addVertex(vertex);
    }
  }

  getInkList(): Point[][] {
    const n = libmupdf._wasm_pdf_annot_ink_list_count(this.pointer);
    const outer: Point[][] = [];
    for (let i = 0; i < n; ++i) {
      const m = libmupdf._wasm_pdf_annot_ink_list_stroke_count(this.pointer, i);
      const inner: Point[] = new Array(m);
      for (let k = 0; k < m; ++k) {
        inner[k] = fromPoint(
          libmupdf._wasm_pdf_annot_ink_list_stroke_vertex(this.pointer, i, k),
        );
      }
      outer.push(inner);
    }
    return outer;
  }

  clearInkList(): void {
    libmupdf._wasm_pdf_clear_annot_ink_list(this.pointer);
  }

  addInkListStroke(): void {
    libmupdf._wasm_pdf_add_annot_ink_list_stroke(this.pointer);
  }

  addInkListStrokeVertex(v: Point): void {
    checkPoint(v);
    libmupdf._wasm_pdf_add_annot_ink_list_stroke_vertex(this.pointer, POINT(v));
  }

  setInkList(inklist: Point[][]): void {
    this.clearInkList();
    for (const stroke of inklist) {
      this.addInkListStroke();
      for (const vertex of stroke) {
        this.addInkListStrokeVertex(vertex);
      }
    }
  }

  setAppearanceFromDisplayList(
    appearance: string | undefined,
    state: string | null,
    transform: Matrix,
    list: DisplayList,
  ): void {
    libmupdf._wasm_pdf_set_annot_appearance_from_display_list(
      this.pointer,
      makeCharPtr(appearance),
      STRING2_OPT(state),
      MATRIX(transform),
      list.pointer,
    );
  }

  setAppearance(
    appearance: string | undefined,
    state: string | null,
    transform: Matrix,
    bbox: Rect,
    resources: PDFObjectLike,
    contents: AnyBuffer,
  ): void {
    libmupdf._wasm_pdf_set_annot_appearance(
      this.pointer,
      makeCharPtr(appearance),
      STRING2_OPT(state),
      MATRIX(transform),
      RECT(bbox),
      this._doc._PDFOBJ(resources),
      makeBufferPtr(contents),
    );
  }

  applyRedaction(black_boxes = 1, image_method = 2): void {
    libmupdf._wasm_pdf_apply_redaction(this.pointer, black_boxes, image_method);
  }
}
