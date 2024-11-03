import type { Document } from "./document.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";
import { makeCharPtr, STRING2_OPT, toText } from "./string.ts";

export interface OutlineItem {
  title?: string;
  uri?: string;
  open: boolean;
  down?: Iterable<OutlineItem>;
  page?: number;
}
export interface OutlineCursor {
  value?: Omit<OutlineItem, "down">;
  next(): void;
  prev(): void;
  up(): void;
  down(): void;
  remove(): void;
  insert(item: OutlineItem): void;
  update(item: OutlineItem): void;
}

export function* walkOutline(
  document: Document,
): Generator<OutlineCursor, void, unknown> {
  const iteratorPtr = libmupdf._wasm_new_outline_iterator(document.pointer);

  let state: -1 | 0 | 1 = 0;

  const next_ = (): -1 | 0 | 1 =>
    toState(libmupdf._wasm_outline_iterator_next(iteratorPtr));
  const prev_ = (): -1 | 0 | 1 =>
    toState(libmupdf._wasm_outline_iterator_prev(iteratorPtr));
  const up_ = (): -1 | 0 | 1 =>
    toState(libmupdf._wasm_outline_iterator_up(iteratorPtr));
  const down_ = (): -1 | 0 | 1 =>
    toState(libmupdf._wasm_outline_iterator_down(iteratorPtr));

  const next = () => {
    let result = next_();
    if (result === RESULT_DID_NOT_MOVE) result = down_();
    if (result === RESULT_DID_NOT_MOVE) result = up_();
    state = result;
  };
  const prev = () => {
    let result = prev_();
    if (result === RESULT_DID_NOT_MOVE) result = down_();
    if (result === RESULT_DID_NOT_MOVE) result = up_();
    state = result;
  };
  const up = () => {
    let result = up_();
    if (result === RESULT_DID_NOT_MOVE) result = next_();
    state = result;
  };
  const down = () => {
    let result = down_();
    if (result === RESULT_DID_NOT_MOVE) result = next_();
    if (result === RESULT_DID_NOT_MOVE) result = up_();
    state = result;
  };
  const remove = () => {
    let result = toState(
      libmupdf._wasm_outline_iterator_delete(iteratorPtr),
    );
    if (result === RESULT_DID_NOT_MOVE) result = down_();
    if (result === RESULT_DID_NOT_MOVE) result = up_();
    state = result;
  };
  const insert = (item: OutlineItem) =>
    libmupdf._wasm_outline_iterator_insert(
      iteratorPtr,
      makeCharPtr(item.title),
      STRING2_OPT(item.uri),
      item.open,
    );
  const update = (item: OutlineItem) =>
    libmupdf._wasm_outline_iterator_update(
      iteratorPtr,
      makeCharPtr(item.title),
      STRING2_OPT(item.uri),
      item.open,
    );

  try {
    while ((state as -1 | 0 | 1) !== RESULT_DID_NOT_MOVE) {
      const item = libmupdf._wasm_outline_iterator_item(iteratorPtr);
      if (!item && (state as -1 | 0 | 1) !== RESULT_AT_EMPTY) break;
      const cursor: OutlineCursor = structuredClone({
        next,
        prev,
        up,
        down,
        remove,
        insert,
        update,
      });
      if (item) {
        const title_ptr = libmupdf._wasm_outline_item_get_title(item);
        const uri_ptr = libmupdf._wasm_outline_item_get_uri(item);
        const open = libmupdf._wasm_outline_item_get_is_open(item);
        const outline: OutlineItem = { open };
        if (title_ptr) outline.title = toText(title_ptr);
        if (uri_ptr) outline.uri = toText(uri_ptr);
        cursor.value = outline;
      }
      yield cursor;
      next();
    }
  } finally {
    libmupdf._wasm_drop_outline_iterator(iteratorPtr);
  }
}

export const readOutline = (
  document: Document,
): Generator<OutlineItem, void, unknown> =>
  readOutline_(document.pointer, libmupdf._wasm_load_outline(document.pointer));

function* readOutline_(
  document: Pointer<"any_document">,
  outline: Pointer<"fz_outline">,
) {
  while (outline) {
    const title = libmupdf._wasm_outline_get_title(outline);
    const uri = libmupdf._wasm_outline_get_uri(outline);
    const open = libmupdf._wasm_outline_get_is_open(outline);

    const item: OutlineItem = {
      open: !!open,
    };
    if (title) item.title = toText(title);
    if (uri) item.uri = toText(uri);

    const page = libmupdf._wasm_outline_get_page(document, outline);
    if (page >= 0) item.page = page;

    const down = libmupdf._wasm_outline_get_down(outline);
    if (down) item.down = readOutline_(document, down);

    yield item;

    outline = libmupdf._wasm_outline_get_next(outline);
  }
}

const RESULT_DID_NOT_MOVE = -1;
const RESULT_AT_ITEM = 0;
const RESULT_AT_EMPTY = 1;

const toState = (result: number): -1 | 0 | 1 =>
  result === RESULT_AT_ITEM
    ? RESULT_AT_ITEM
    : result === RESULT_AT_EMPTY
    ? RESULT_AT_EMPTY
    : RESULT_DID_NOT_MOVE;
