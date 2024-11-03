import { libmupdf } from "./module.ts";
import { PDFAnnotation } from "./PDFAnnotation.ts";
import { makeCharPtr, pop, toText } from "./string.ts";

export class PDFWidget extends PDFAnnotation {
  /* IMPORTANT: Keep in sync with mupdf/pdf/widget.h and PDFWidget.java */
  static readonly WIDGET_TYPES = [
    "widget", // unknown
    "button",
    "checkbox",
    "combobox",
    "listbox",
    "radiobutton",
    "signature",
    "text",
  ];

  /* Field flags */
  static readonly FIELD_IS_READ_ONLY = 1;
  static readonly FIELD_IS_REQUIRED = 1 << 1;
  static readonly FIELD_IS_NO_EXPORT = 1 << 2;

  /* Text fields */
  static readonly TX_FIELD_IS_MULTILINE = 1 << 12;
  static readonly TX_FIELD_IS_PASSWORD = 1 << 13;
  static readonly TX_FIELD_IS_COMB = 1 << 24;

  /* Button fields */
  static readonly BTN_FIELD_IS_NO_TOGGLE_TO_OFF = 1 << 14;
  static readonly BTN_FIELD_IS_RADIO = 1 << 15;
  static readonly BTN_FIELD_IS_PUSHBUTTON = 1 << 16;

  /* Choice fields */
  static readonly CH_FIELD_IS_COMBO = 1 << 17;
  static readonly CH_FIELD_IS_EDIT = 1 << 18;
  static readonly CH_FIELD_IS_SORT = 1 << 19;
  static readonly CH_FIELD_IS_MULTI_SELECT = 1 << 21;

  getFieldType(): string {
    return PDFWidget
      .WIDGET_TYPES[libmupdf._wasm_pdf_annot_field_type(this.pointer)] ||
      "button";
  }

  isButton(): boolean {
    const type = this.getFieldType();
    return type === "button" || type === "checkbox" || type === "radiobutton";
  }

  isPushButton(): boolean {
    return this.getFieldType() === "button";
  }

  isCheckbox(): boolean {
    return this.getFieldType() === "checkbox";
  }

  isRadioButton(): boolean {
    return this.getFieldType() === "radiobutton";
  }

  isText(): boolean {
    return this.getFieldType() === "text";
  }

  isChoice(): boolean {
    const type = this.getFieldType();
    return type === "combobox" || type === "listbox";
  }

  isListBox(): boolean {
    return this.getFieldType() === "listbox";
  }

  isComboBox(): boolean {
    return this.getFieldType() === "combobox";
  }

  getFieldFlags(): number {
    return libmupdf._wasm_pdf_annot_field_flags(this.pointer);
  }

  isMultiline(): boolean {
    return (this.getFieldFlags() & PDFWidget.TX_FIELD_IS_MULTILINE) !== 0;
  }

  isPassword(): boolean {
    return (this.getFieldFlags() & PDFWidget.TX_FIELD_IS_PASSWORD) !== 0;
  }

  isComb(): boolean {
    return (this.getFieldFlags() & PDFWidget.TX_FIELD_IS_COMB) !== 0;
  }

  isReadOnly(): boolean {
    return (this.getFieldFlags() & PDFWidget.FIELD_IS_READ_ONLY) !== 0;
  }

  getLabel(): string {
    return toText(libmupdf._wasm_pdf_annot_field_label(this.pointer));
  }

  getName(): string {
    return pop(libmupdf._wasm_pdf_load_field_name(this.pointer));
  }

  getValue(): string {
    return toText(libmupdf._wasm_pdf_annot_field_value(this.pointer));
  }

  setTextValue(value: string): void {
    libmupdf._wasm_pdf_set_annot_text_field_value(
      this.pointer,
      makeCharPtr(value),
    );
  }

  getMaxLen(): number {
    return libmupdf._wasm_pdf_annot_text_widget_max_len(this.pointer);
  }

  setChoiceValue(value: string): void {
    libmupdf._wasm_pdf_set_annot_choice_field_value(
      this.pointer,
      makeCharPtr(value),
    );
  }

  getOptions(isExport = false): string[] {
    const result: string[] = [];
    const n = libmupdf._wasm_pdf_annot_choice_field_option_count(this.pointer);
    for (let i = 0; i < n; ++i) {
      result.push(
        toText(
          libmupdf._wasm_pdf_annot_choice_field_option(
            this.pointer,
            isExport,
            i,
          ),
        ),
      );
    }
    return result;
  }

  toggle(): void {
    libmupdf._wasm_pdf_toggle_widget(this.pointer);
  }

  // Interactive Text Widget editing in a GUI.
  // TODO: getEditingState()
  // TODO: setEditingState()
  // TODO: clearEditingState()
  // TODO: layoutTextWidget()

  // Interactive form validation Javascript triggers.
  // NOTE: No embedded PDF Javascript engine in WASM build.
  // TODO: eventEnter()
  // TODO: eventExit()
  // TODO: eventDown()
  // TODO: eventUp()
  // TODO: eventFocus()
  // TODO: eventBlur()

  // NOTE: No OpenSSL support in WASM build.
  // TODO: isSigned()
  // TODO: validateSignature()
  // TODO: checkCertificate()
  // TODO: checkDigest()
  // TODO: getSignature()
  // TODO: previewSignature()
  // TODO: clearSignature()
  // TODO: sign()
}
