import { Font } from "./font.ts";
import { fromMatrix, type Matrix } from "./Matrix.ts";
import { free, malloc } from "./memory.ts";
import { Image } from "./image.ts";
import { libmupdf } from "./module.ts";
import { fromPoint, POINT, type Point, POINT2 } from "./point.ts";
import type { Pointer } from "./Pointer.ts";
import { fromQuad, type Quad } from "./quad.ts";
import { fromRect, type Rect } from "./Rect.ts";
import { runSearch } from "./search.ts";
import { pop } from "./string.ts";

export type StructuredTextBlock = ImageBlock | TextBlock;

export interface ImageBlock {
  type: "image";
  bbox: Rect;
  transform: Matrix;
  image: Image;
}
export interface TextBlock extends Iterable<Line> {
  type: "text";
  bbox: Rect;
}
export interface Line extends Iterable<Char> {
  bbox: Rect;
  wmode: number;
  direction: Point;
}

export interface Char {
  char: string;
  origin: Point;
  font: Font;
  size: number;
  quad: Quad;
}

export const SELECT_CHARS = 0;
export const SELECT_WORDS = 1;
export const SELECT_LINES = 2;

export class StructuredText implements Disposable {
  constructor(public pointer: Pointer<"fz_stext_page">) {}
  [Symbol.dispose](): void {
    libmupdf._wasm_drop_stext_page(this.pointer);
  }

  *walk(): Generator<StructuredTextBlock, void, unknown> {
    let block = libmupdf._wasm_stext_page_get_first_block(this.pointer);
    while (block) {
      const block_type = libmupdf._wasm_stext_block_get_type(block);
      const bbox = fromRect(libmupdf._wasm_stext_block_get_bbox(block));

      if (block_type === 1) {
        const transform = fromMatrix(
          libmupdf._wasm_stext_block_get_transform(block),
        );
        const image = new Image(libmupdf._wasm_stext_block_get_image(block));
        yield { type: "image", bbox, transform, image };
      }
      const iterator: Iterator<Line> = function* () {
        let line = libmupdf._wasm_stext_block_get_first_line(block);
        while (line) {
          const bbox = fromRect(
            libmupdf._wasm_stext_line_get_bbox(line),
          );
          const wmode = libmupdf._wasm_stext_line_get_wmode(line);
          const direction = fromPoint(
            libmupdf._wasm_stext_line_get_dir(line),
          );

          const iterator: Iterator<Char> = function* () {
            let ch = libmupdf._wasm_stext_line_get_first_char(line);
            while (ch) {
              yield makeStructuredTextChar(ch);
              ch = libmupdf._wasm_stext_char_get_next(ch);
            }
          }();

          yield {
            bbox,
            wmode,
            direction,
            [Symbol.iterator]: () => iterator,
          };
          consume(iterator);

          line = libmupdf._wasm_stext_line_get_next(line);
        }
      }();

      yield {
        type: "text",
        bbox,
        [Symbol.iterator]: () => iterator,
      };
      consume(iterator);

      block = libmupdf._wasm_stext_block_get_next(block);
    }
  }

  test() {
    for (const block of this.walk()) {
      console.log(block);
      if (block.type === "text") {
        for (const line of block) {
          console.log(line);
          for (const char of line) {
            console.log(char);
          }
        }
      }
    }
  }

  asJSON(scale = 1): string {
    return pop(
      libmupdf._wasm_print_stext_page_as_json(this.pointer, scale),
    );
  }

  asHTML(id: number): string {
    return pop(
      libmupdf._wasm_print_stext_page_as_html(this.pointer, id),
    );
  }

  asText(): string {
    return pop(
      libmupdf._wasm_print_stext_page_as_text(this.pointer),
    );
  }

  copy(p: Point, q: Point): string {
    return pop(
      libmupdf._wasm_copy_selection(this.pointer, POINT(p), POINT2(q)),
    );
  }

  highlight(p: Point, q: Point, max_hits = 100): Quad[] {
    let hits = 0 as Pointer<"fz_quad">;
    const result: Quad[] = [];
    try {
      hits = malloc<"fz_quad">(32 * max_hits);
      const n = libmupdf._wasm_highlight_selection(
        this.pointer,
        POINT(p),
        POINT2(q),
        hits,
        max_hits,
      );
      for (let i = 0; i < n; ++i) {
        result.push(fromQuad(hits + i * 32 as Pointer<"fz_quad">));
      }
    } finally {
      free(hits);
    }
    return result;
  }

  search(needle: string, max_hits = 500): Quad[][] {
    return runSearch(
      libmupdf._wasm_search_stext_page,
      this.pointer,
      needle,
      max_hits,
    );
  }
}

const makeStructuredTextChar = (ch: Pointer<"fz_stext_char">): Char => {
  const char = String.fromCharCode(
    libmupdf._wasm_stext_char_get_c(ch),
  );
  const origin = fromPoint(
    libmupdf._wasm_stext_char_get_origin(ch),
  );
  const font = new Font(
    libmupdf._wasm_stext_char_get_font(ch),
  );
  const size = libmupdf._wasm_stext_char_get_size(ch);
  const quad = fromQuad(
    libmupdf._wasm_stext_char_get_quad(ch),
  );
  return {
    char,
    origin,
    font,
    size,
    quad,
  };
};

const consume = <T>(iterator: Iterator<T>): void => {
  // deno-lint-ignore no-empty
  while (!iterator.next().done) {}
};
