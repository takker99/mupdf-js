// Copyright (C) 2004-2023 Artifex Software, Inc.
//
// This file is part of MuPDF WASM Library.
//
// MuPDF is free software: you can redistribute it and/or modify it under the
// terms of the GNU Affero General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
//
// MuPDF is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License
// along with MuPDF. If not, see <https://www.gnu.org/licenses/agpl-3.0.en.html>
//
// Alternative licensing terms are available from the licensor.
// For commercial licensing, see <https://www.artifex.com/> or contact
// Artifex Software, Inc., 39 Mesa Street, Suite 108A, San Francisco,
// CA 94129, USA, for further information.

import { libmupdf } from "./module.ts";
import { MATRIX, type Matrix } from "./Matrix.ts";
import { makeCharPtr } from "./string.ts";
import type { Pixmap } from "./Pixmap.ts";
import type { _wasm_point } from "./point.ts";
import { Device } from "./device.ts";
import type { DisplayList } from "./DisplayList.ts";

export * from "./Userdata.ts";
export * from "./Pointer.ts";
export * from "./document.ts";
export { PDFDocument } from "./PDFDocument.ts";

/*
--------------------------------------------------------------------------------

How to call into WASM and convert values between JS and WASM (libmupdf) worlds:

Passing values into WASM needs to either copy primitive values into WASM memory
or passing around pointer values.

	Wrap and/or copy non-Userdata values into WASM:

		STRING(stringValue)
		STRING2(stringValue) -- if you need to pass more than one string
		MATRIX(matrixArray)
		RECT(rectArray)
		BUFFER(bufferValue)
		etc.

	Look up an enum value by string:

		ENUM<EnumType>(string, listOfValidValues)

	Pass the pointer when the value is a Userdata object:

		userdataObject.pointer

Convert WASM pointer into a JS value (for simple types like strings and matrices).

	fromType(pointer)

Wrap a WASM pointer in a new Userdata object (for complex types):

	new Wrapper(pointer)

PDFObjects are always bound to a PDFDocument, so must be accessed via a document:

	doc._fromPDFObjectNew(new_ptr)
	doc._fromPDFObjectKeep(borrowed_ptr)
	doc._PDFOBJ(value)

Type checking of input arguments at runtime.

	checkType(value, "string")
	checkType(value, Class)
	checkRect(value)
	checkMatrix(value)

	This code needs to work type safely from plain Javascript too,
	so do NOT rely on Typescript to do all the type checking.

--------------------------------------------------------------------------------
*/

/**
 * Enables ICC (International Color Consortium) profile support in the MuPDF library.
 *
 * @remarks
 * ICC profiles are used for color management in digital imaging systems.
 */
export const enableICC = (): void => {
  libmupdf._wasm_enable_icc();
};

/**
 * Disable ICC (International Color Consortium) profile support in the MuPDF library.
 *
 * @remarks
 * ICC profiles are used for color management in digital imaging systems.
 */
export const disableICC = (): void => {
  libmupdf._wasm_disable_icc();
};

/**
 * Set User CSS (Cascading Style Sheets) for rendering HTML content.
 */
export const setUserCSS = (text: string): void => {
  libmupdf._wasm_set_user_css(makeCharPtr(text));
};

/* -------------------------------------------------------------------------- */

export class DrawDevice extends Device {
  constructor(matrix: Matrix, pixmap: Pixmap) {
    super(libmupdf._wasm_new_draw_device(MATRIX(matrix), pixmap.pointer));
  }
}

export class DisplayListDevice extends Device {
  constructor(displayList: DisplayList) {
    super(libmupdf._wasm_new_display_list_device(displayList.pointer));
  }
}
