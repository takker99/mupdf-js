export default libmupdf_wasm;
declare function libmupdf_wasm(): Promise<Libmupdf>;
declare const _brand: unique symbol;
export type Pointer<B> = number & { readonly [_brand]: B };
export { libmupdf_wasm };
interface Libmupdf {
  UTF8ToString(ptr: Pointer<"char">): string;
  stringToUTF8(
    str: string,
    outPtr: Pointer<"char">,
    maxBytesToWrite: number,
  ): number;
  lengthBytesUTF8(str: string): number;
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAP32: Int32Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;

  _wasm_init_context(): void;
  _wasm_malloc(size: number): Pointer<"void">;
  _wasm_free(p: Pointer<"void">): void;
  _wasm_enable_icc(): void;
  _wasm_disable_icc(): void;
  _wasm_set_user_css(text: Pointer<"char">): void;
  _wasm_keep_buffer(p: Pointer<"fz_buffer">): Pointer<"fz_buffer">;
  _wasm_drop_buffer(p: Pointer<"fz_buffer">): void;
  _wasm_keep_stream(p: Pointer<"fz_stream">): Pointer<"fz_stream">;
  _wasm_drop_stream(p: Pointer<"fz_stream">): void;
  _wasm_keep_colorspace(p: Pointer<"fz_colorspace">): Pointer<"fz_colorspace">;
  _wasm_drop_colorspace(p: Pointer<"fz_colorspace">): void;
  _wasm_keep_pixmap(p: Pointer<"fz_pixmap">): Pointer<"fz_pixmap">;
  _wasm_drop_pixmap(p: Pointer<"fz_pixmap">): void;
  _wasm_keep_font(p: Pointer<"fz_font">): Pointer<"fz_font">;
  _wasm_drop_font(p: Pointer<"fz_font">): void;
  _wasm_keep_stroke_state(
    p: Pointer<"fz_stroke_state">,
  ): Pointer<"fz_stroke_state">;
  _wasm_drop_stroke_state(p: Pointer<"fz_stroke_state">): void;
  _wasm_keep_image(p: Pointer<"fz_image">): Pointer<"fz_image">;
  _wasm_drop_image(p: Pointer<"fz_image">): void;
  _wasm_keep_shade(p: Pointer<"fz_shade">): Pointer<"fz_shade">;
  _wasm_drop_shade(p: Pointer<"fz_shade">): void;
  _wasm_keep_path(p: Pointer<"fz_path">): Pointer<"fz_path">;
  _wasm_drop_path(p: Pointer<"fz_path">): void;
  _wasm_keep_text(p: Pointer<"fz_text">): Pointer<"fz_text">;
  _wasm_drop_text(p: Pointer<"fz_text">): void;
  _wasm_keep_device(p: Pointer<"fz_device">): Pointer<"fz_device">;
  _wasm_drop_device(p: Pointer<"fz_device">): void;
  _wasm_keep_display_list(
    p: Pointer<"fz_display_list">,
  ): Pointer<"fz_display_list">;
  _wasm_drop_display_list(p: Pointer<"fz_display_list">): void;
  _wasm_drop_stext_page(p: Pointer<"fz_stext_page">): void;
  _wasm_drop_document_writer(p: Pointer<"fz_document_writer">): void;
  _wasm_drop_outline_iterator(p: Pointer<"fz_outline_iterator">): void;
  _wasm_keep_document(p: Pointer<"any_document">): Pointer<"any_document">;
  _wasm_drop_document(p: Pointer<"any_document">): void;
  _wasm_keep_page(p: Pointer<"any_page">): Pointer<"any_page">;
  _wasm_drop_page(p: Pointer<"any_page">): void;
  _wasm_keep_link(p: Pointer<"fz_link">): Pointer<"fz_link">;
  _wasm_drop_link(p: Pointer<"fz_link">): void;
  _wasm_keep_outline(p: Pointer<"fz_outline">): Pointer<"fz_outline">;
  _wasm_drop_outline(p: Pointer<"fz_outline">): void;
  _wasm_pdf_keep_annot(p: Pointer<"pdf_annot">): Pointer<"pdf_annot">;
  _wasm_pdf_drop_annot(p: Pointer<"pdf_annot">): void;
  _wasm_pdf_keep_obj(p: Pointer<"pdf_obj">): Pointer<"pdf_obj">;
  _wasm_pdf_drop_obj(p: Pointer<"pdf_obj">): void;
  _wasm_pdf_keep_graft_map(
    p: Pointer<"pdf_graft_map">,
  ): Pointer<"pdf_graft_map">;
  _wasm_pdf_drop_graft_map(p: Pointer<"pdf_graft_map">): void;
  _wasm_buffer_get_data(p: Pointer<"fz_buffer">): Pointer<"void">;
  _wasm_buffer_get_len(p: Pointer<"fz_buffer">): number;
  _wasm_colorspace_get_type(p: Pointer<"fz_colorspace">): number;
  _wasm_colorspace_get_n(p: Pointer<"fz_colorspace">): number;
  _wasm_colorspace_get_name(p: Pointer<"fz_colorspace">): Pointer<"char">;
  _wasm_pixmap_get_w(p: Pointer<"fz_pixmap">): number;
  _wasm_pixmap_get_h(p: Pointer<"fz_pixmap">): number;
  _wasm_pixmap_get_x(p: Pointer<"fz_pixmap">): number;
  _wasm_pixmap_get_y(p: Pointer<"fz_pixmap">): number;
  _wasm_pixmap_get_n(p: Pointer<"fz_pixmap">): number;
  _wasm_pixmap_get_stride(p: Pointer<"fz_pixmap">): number;
  _wasm_pixmap_get_alpha(p: Pointer<"fz_pixmap">): number;
  _wasm_pixmap_get_xres(p: Pointer<"fz_pixmap">): number;
  _wasm_pixmap_get_yres(p: Pointer<"fz_pixmap">): number;
  _wasm_pixmap_get_colorspace(
    p: Pointer<"fz_pixmap">,
  ): Pointer<"fz_colorspace">;
  _wasm_pixmap_get_samples(p: Pointer<"fz_pixmap">): Pointer<"char">;
  _wasm_pixmap_set_xres(p: Pointer<"fz_pixmap">, v: number): void;
  _wasm_pixmap_set_yres(p: Pointer<"fz_pixmap">, v: number): void;
  _wasm_font_get_name(p: Pointer<"fz_font">): Pointer<"char">;
  _wasm_stroke_state_get_start_cap(p: Pointer<"fz_stroke_state">): number;
  _wasm_stroke_state_set_start_cap(
    p: Pointer<"fz_stroke_state">,
    v: number,
  ): void;
  _wasm_stroke_state_get_dash_cap(p: Pointer<"fz_stroke_state">): number;
  _wasm_stroke_state_set_dash_cap(
    p: Pointer<"fz_stroke_state">,
    v: number,
  ): void;
  _wasm_stroke_state_get_end_cap(p: Pointer<"fz_stroke_state">): number;
  _wasm_stroke_state_set_end_cap(
    p: Pointer<"fz_stroke_state">,
    v: number,
  ): void;
  _wasm_stroke_state_get_linejoin(p: Pointer<"fz_stroke_state">): number;
  _wasm_stroke_state_set_linejoin(
    p: Pointer<"fz_stroke_state">,
    v: number,
  ): void;
  _wasm_stroke_state_get_linewidth(p: Pointer<"fz_stroke_state">): number;
  _wasm_stroke_state_set_linewidth(
    p: Pointer<"fz_stroke_state">,
    v: number,
  ): void;
  _wasm_stroke_state_get_miterlimit(p: Pointer<"fz_stroke_state">): number;
  _wasm_stroke_state_set_miterlimit(
    p: Pointer<"fz_stroke_state">,
    v: number,
  ): void;
  _wasm_stroke_state_get_dash_phase(p: Pointer<"fz_stroke_state">): number;
  _wasm_stroke_state_set_dash_phase(
    p: Pointer<"fz_stroke_state">,
    v: number,
  ): void;
  _wasm_image_get_w(p: Pointer<"fz_image">): number;
  _wasm_image_get_h(p: Pointer<"fz_image">): number;
  _wasm_image_get_n(p: Pointer<"fz_image">): number;
  _wasm_image_get_bpc(p: Pointer<"fz_image">): number;
  _wasm_image_get_xres(p: Pointer<"fz_image">): number;
  _wasm_image_get_yres(p: Pointer<"fz_image">): number;
  _wasm_image_get_imagemask(p: Pointer<"fz_image">): boolean;
  _wasm_image_get_colorspace(p: Pointer<"fz_image">): Pointer<"fz_colorspace">;
  _wasm_image_get_mask(p: Pointer<"fz_image">): Pointer<"fz_image">;
  _wasm_outline_get_title(p: Pointer<"fz_outline">): Pointer<"char">;
  _wasm_outline_get_uri(p: Pointer<"fz_outline">): Pointer<"char">;
  _wasm_outline_get_next(p: Pointer<"fz_outline">): Pointer<"fz_outline">;
  _wasm_outline_get_down(p: Pointer<"fz_outline">): Pointer<"fz_outline">;
  _wasm_outline_get_is_open(p: Pointer<"fz_outline">): boolean;
  _wasm_outline_item_get_title(p: Pointer<"fz_outline_item">): Pointer<"char">;
  _wasm_outline_item_get_uri(p: Pointer<"fz_outline_item">): Pointer<"char">;
  _wasm_outline_item_get_is_open(p: Pointer<"fz_outline_item">): boolean;
  _wasm_link_get_rect(p: Pointer<"fz_link">): Pointer<"fz_rect">;
  _wasm_link_get_uri(p: Pointer<"fz_link">): Pointer<"char">;
  _wasm_link_get_next(p: Pointer<"fz_link">): Pointer<"fz_link">;
  _wasm_stext_page_get_mediabox(
    p: Pointer<"fz_stext_page">,
  ): Pointer<"fz_rect">;
  _wasm_stext_page_get_first_block(
    p: Pointer<"fz_stext_page">,
  ): Pointer<"fz_stext_block">;
  _wasm_stext_block_get_next(
    p: Pointer<"fz_stext_block">,
  ): Pointer<"fz_stext_block">;
  _wasm_stext_block_get_type(p: Pointer<"fz_stext_block">): number;
  _wasm_stext_block_get_bbox(p: Pointer<"fz_stext_block">): Pointer<"fz_rect">;
  _wasm_stext_block_get_first_line(
    p: Pointer<"fz_stext_block">,
  ): Pointer<"fz_stext_line">;
  _wasm_stext_block_get_transform(
    p: Pointer<"fz_stext_block">,
  ): Pointer<"fz_matrix">;
  _wasm_stext_block_get_image(
    p: Pointer<"fz_stext_block">,
  ): Pointer<"fz_image">;
  _wasm_stext_line_get_next(
    p: Pointer<"fz_stext_line">,
  ): Pointer<"fz_stext_line">;
  _wasm_stext_line_get_wmode(p: Pointer<"fz_stext_line">): number;
  _wasm_stext_line_get_dir(p: Pointer<"fz_stext_line">): Pointer<"fz_point">;
  _wasm_stext_line_get_bbox(p: Pointer<"fz_stext_line">): Pointer<"fz_rect">;
  _wasm_stext_line_get_first_char(
    p: Pointer<"fz_stext_line">,
  ): Pointer<"fz_stext_char">;
  _wasm_stext_char_get_next(
    p: Pointer<"fz_stext_char">,
  ): Pointer<"fz_stext_char">;
  _wasm_stext_char_get_c(p: Pointer<"fz_stext_char">): number;
  _wasm_stext_char_get_origin(p: Pointer<"fz_stext_char">): Pointer<"fz_point">;
  _wasm_stext_char_get_quad(p: Pointer<"fz_stext_char">): Pointer<"fz_quad">;
  _wasm_stext_char_get_size(p: Pointer<"fz_stext_char">): number;
  _wasm_stext_char_get_font(p: Pointer<"fz_stext_char">): Pointer<"fz_font">;
  _wasm_link_dest_get_chapter(p: Pointer<"fz_link_dest">): number;
  _wasm_link_dest_get_page(p: Pointer<"fz_link_dest">): number;
  _wasm_link_dest_get_type(p: Pointer<"fz_link_dest">): number;
  _wasm_link_dest_get_x(p: Pointer<"fz_link_dest">): number;
  _wasm_link_dest_get_y(p: Pointer<"fz_link_dest">): number;
  _wasm_link_dest_get_w(p: Pointer<"fz_link_dest">): number;
  _wasm_link_dest_get_h(p: Pointer<"fz_link_dest">): number;
  _wasm_link_dest_get_zoom(p: Pointer<"fz_link_dest">): number;
  _wasm_pdf_embedded_file_params_get_filename(
    p: Pointer<"pdf_embedded_file_params">,
  ): Pointer<"char">;
  _wasm_pdf_embedded_file_params_get_mimetype(
    p: Pointer<"pdf_embedded_file_params">,
  ): Pointer<"char">;
  _wasm_pdf_embedded_file_params_get_size(
    p: Pointer<"pdf_embedded_file_params">,
  ): number;
  _wasm_pdf_embedded_file_params_get_created(
    p: Pointer<"pdf_embedded_file_params">,
  ): number;
  _wasm_pdf_embedded_file_params_get_modified(
    p: Pointer<"pdf_embedded_file_params">,
  ): number;
  _wasm_pdf_page_get_obj(p: Pointer<"any_page">): Pointer<"pdf_obj">;
  _wasm_new_buffer(capacity: number): Pointer<"fz_buffer">;
  _wasm_new_buffer_from_data(
    data: Pointer<"char">,
    size: number,
  ): Pointer<"fz_buffer">;
  _wasm_append_string(buf: Pointer<"fz_buffer">, str: Pointer<"char">): void;
  _wasm_append_byte(buf: Pointer<"fz_buffer">, c: number): void;
  _wasm_append_buffer(
    buf: Pointer<"fz_buffer">,
    src: Pointer<"fz_buffer">,
  ): void;
  _wasm_slice_buffer(
    buf: Pointer<"fz_buffer">,
    start: number,
    end: number,
  ): Pointer<"fz_buffer">;
  _wasm_string_from_buffer(buf: Pointer<"fz_buffer">): Pointer<"char">;
  _wasm_device_gray(): Pointer<"fz_colorspace">;
  _wasm_device_rgb(): Pointer<"fz_colorspace">;
  _wasm_device_bgr(): Pointer<"fz_colorspace">;
  _wasm_device_cmyk(): Pointer<"fz_colorspace">;
  _wasm_device_lab(): Pointer<"fz_colorspace">;
  _wasm_new_icc_colorspace(
    name: Pointer<"char">,
    buffer: Pointer<"fz_buffer">,
  ): Pointer<"fz_colorspace">;
  _wasm_new_stroke_state(): Pointer<"fz_stroke_state">;
  _wasm_new_base14_font(name: Pointer<"char">): Pointer<"fz_font">;
  _wasm_new_font_from_buffer(
    name: Pointer<"char">,
    buf: Pointer<"fz_buffer">,
    subfont: number,
  ): Pointer<"fz_font">;
  _wasm_encode_character(font: Pointer<"fz_font">, unicode: number): number;
  _wasm_advance_glyph(
    font: Pointer<"fz_font">,
    glyph: number,
    wmode: number,
  ): number;
  _wasm_font_is_monospaced(font: Pointer<"fz_font">): number;
  _wasm_font_is_serif(font: Pointer<"fz_font">): number;
  _wasm_font_is_bold(font: Pointer<"fz_font">): number;
  _wasm_font_is_italic(font: Pointer<"fz_font">): number;
  _wasm_new_image_from_pixmap(
    pix: Pointer<"fz_pixmap">,
    mask: Pointer<"fz_image">,
  ): Pointer<"fz_image">;
  _wasm_new_image_from_buffer(buf: Pointer<"fz_buffer">): Pointer<"fz_image">;
  _wasm_get_pixmap_from_image(image: Pointer<"fz_image">): Pointer<"fz_pixmap">;
  _wasm_new_pixmap_from_page(
    page: Pointer<"any_page">,
    ctm: Pointer<"fz_matrix">,
    colorspace: Pointer<"fz_colorspace">,
    alpha: boolean,
  ): Pointer<"fz_pixmap">;
  _wasm_new_pixmap_from_page_contents(
    page: Pointer<"any_page">,
    ctm: Pointer<"fz_matrix">,
    colorspace: Pointer<"fz_colorspace">,
    alpha: boolean,
  ): Pointer<"fz_pixmap">;
  _wasm_pdf_new_pixmap_from_page_with_usage(
    page: Pointer<"any_page">,
    ctm: Pointer<"fz_matrix">,
    colorspace: Pointer<"fz_colorspace">,
    alpha: boolean,
    usage: Pointer<"char">,
    box: number,
  ): Pointer<"fz_pixmap">;
  _wasm_pdf_new_pixmap_from_page_contents_with_usage(
    page: Pointer<"any_page">,
    ctm: Pointer<"fz_matrix">,
    colorspace: Pointer<"fz_colorspace">,
    alpha: boolean,
    usage: Pointer<"char">,
    box: number,
  ): Pointer<"fz_pixmap">;
  _wasm_new_pixmap_with_bbox(
    colorspace: Pointer<"fz_colorspace">,
    bbox: Pointer<"fz_rect">,
    alpha: boolean,
  ): Pointer<"fz_pixmap">;
  _wasm_clear_pixmap(pix: Pointer<"fz_pixmap">): void;
  _wasm_clear_pixmap_with_value(pix: Pointer<"fz_pixmap">, value: number): void;
  _wasm_invert_pixmap(pix: Pointer<"fz_pixmap">): void;
  _wasm_invert_pixmap_luminance(pix: Pointer<"fz_pixmap">): void;
  _wasm_gamma_pixmap(pix: Pointer<"fz_pixmap">, gamma: number): void;
  _wasm_tint_pixmap(
    pix: Pointer<"fz_pixmap">,
    black_hex_color: number,
    white_hex_color: number,
  ): void;
  _wasm_new_buffer_from_pixmap_as_png(
    pix: Pointer<"fz_pixmap">,
  ): Pointer<"fz_buffer">;
  _wasm_new_buffer_from_pixmap_as_pam(
    pix: Pointer<"fz_pixmap">,
  ): Pointer<"fz_buffer">;
  _wasm_new_buffer_from_pixmap_as_psd(
    pix: Pointer<"fz_pixmap">,
  ): Pointer<"fz_buffer">;
  _wasm_new_buffer_from_pixmap_as_jpeg(
    pix: Pointer<"fz_pixmap">,
    quality: number,
    invert_cmyk: boolean,
  ): Pointer<"fz_buffer">;
  _wasm_convert_pixmap(
    pixmap: Pointer<"fz_pixmap">,
    colorspace: Pointer<"fz_colorspace">,
    keep_alpha: boolean,
  ): Pointer<"fz_pixmap">;
  _wasm_warp_pixmap(
    pixmap: Pointer<"fz_pixmap">,
    points: Pointer<"fz_quad">,
    w: number,
    h: number,
  ): Pointer<"fz_pixmap">;
  _wasm_bound_shade(shade: Pointer<"fz_shade">): Pointer<"fz_rect">;
  _wasm_new_display_list(
    mediabox: Pointer<"fz_rect">,
  ): Pointer<"fz_display_list">;
  _wasm_bound_display_list(
    list: Pointer<"fz_display_list">,
  ): Pointer<"fz_rect">;
  _wasm_run_display_list(
    display_list: Pointer<"fz_display_list">,
    dev: Pointer<"fz_device">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_new_pixmap_from_display_list(
    display_list: Pointer<"fz_display_list">,
    ctm: Pointer<"fz_matrix">,
    colorspace: Pointer<"fz_colorspace">,
    alpha: boolean,
  ): Pointer<"fz_pixmap">;
  _wasm_new_stext_page_from_display_list(
    display_list: Pointer<"fz_display_list">,
    option_string: Pointer<"char">,
  ): Pointer<"fz_stext_page">;
  _wasm_search_display_list(
    display_list: Pointer<"fz_display_list">,
    needle: Pointer<"char">,
    marks: Pointer<"int">,
    hits: Pointer<"fz_quad">,
    hit_max: number,
  ): number;
  _wasm_new_path(): Pointer<"fz_path">;
  _wasm_moveto(path: Pointer<"fz_path">, x: number, y: number): void;
  _wasm_lineto(path: Pointer<"fz_path">, x: number, y: number): void;
  _wasm_curveto(
    path: Pointer<"fz_path">,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
  ): void;
  _wasm_curvetov(
    path: Pointer<"fz_path">,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): void;
  _wasm_curvetoy(
    path: Pointer<"fz_path">,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): void;
  _wasm_closepath(path: Pointer<"fz_path">): void;
  _wasm_rectto(
    path: Pointer<"fz_path">,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): void;
  _wasm_transform_path(
    path: Pointer<"fz_path">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_bound_path(
    path: Pointer<"fz_path">,
    stroke: Pointer<"fz_stroke_state">,
    ctm: Pointer<"fz_matrix">,
  ): Pointer<"fz_rect">;
  _wasm_new_text(): Pointer<"fz_text">;
  _wasm_bound_text(
    text: Pointer<"fz_text">,
    stroke: Pointer<"fz_stroke_state">,
    ctm: Pointer<"fz_matrix">,
  ): Pointer<"fz_rect">;
  _wasm_show_glyph(
    text: Pointer<"fz_text">,
    font: Pointer<"fz_font">,
    trm: Pointer<"fz_matrix">,
    gid: number,
    ucs: number,
    wmode: number,
  ): void;
  _wasm_show_string(
    text: Pointer<"fz_text">,
    font: Pointer<"fz_font">,
    trm: Pointer<"fz_matrix">,
    string: Pointer<"char">,
    wmode: number,
  ): Pointer<"fz_matrix">;
  _wasm_new_draw_device(
    ctm: Pointer<"fz_matrix">,
    dest: Pointer<"fz_pixmap">,
  ): Pointer<"fz_device">;
  _wasm_new_display_list_device(
    list: Pointer<"fz_display_list">,
  ): Pointer<"fz_device">;
  _wasm_close_device(dev: Pointer<"fz_device">): void;
  _wasm_fill_path(
    dev: Pointer<"fz_device">,
    path: Pointer<"fz_path">,
    evenOdd: boolean,
    ctm: Pointer<"fz_matrix">,
    colorspace: Pointer<"fz_colorspace">,
    color: Pointer<"float">,
    alpha: number,
  ): void;
  _wasm_stroke_path(
    dev: Pointer<"fz_device">,
    path: Pointer<"fz_path">,
    stroke: Pointer<"fz_stroke_state">,
    ctm: Pointer<"fz_matrix">,
    colorspace: Pointer<"fz_colorspace">,
    color: Pointer<"float">,
    alpha: number,
  ): void;
  _wasm_clip_path(
    dev: Pointer<"fz_device">,
    path: Pointer<"fz_path">,
    evenOdd: boolean,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_clip_stroke_path(
    dev: Pointer<"fz_device">,
    path: Pointer<"fz_path">,
    stroke: Pointer<"fz_stroke_state">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_fill_text(
    dev: Pointer<"fz_device">,
    text: Pointer<"fz_text">,
    ctm: Pointer<"fz_matrix">,
    colorspace: Pointer<"fz_colorspace">,
    color: Pointer<"float">,
    alpha: number,
  ): void;
  _wasm_stroke_text(
    dev: Pointer<"fz_device">,
    text: Pointer<"fz_text">,
    stroke: Pointer<"fz_stroke_state">,
    ctm: Pointer<"fz_matrix">,
    colorspace: Pointer<"fz_colorspace">,
    color: Pointer<"float">,
    alpha: number,
  ): void;
  _wasm_clip_text(
    dev: Pointer<"fz_device">,
    text: Pointer<"fz_text">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_clip_stroke_text(
    dev: Pointer<"fz_device">,
    text: Pointer<"fz_text">,
    stroke: Pointer<"fz_stroke_state">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_ignore_text(
    dev: Pointer<"fz_device">,
    text: Pointer<"fz_text">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_fill_shade(
    dev: Pointer<"fz_device">,
    shade: Pointer<"fz_shade">,
    ctm: Pointer<"fz_matrix">,
    alpha: number,
  ): void;
  _wasm_fill_image(
    dev: Pointer<"fz_device">,
    image: Pointer<"fz_image">,
    ctm: Pointer<"fz_matrix">,
    alpha: number,
  ): void;
  _wasm_fill_image_mask(
    dev: Pointer<"fz_device">,
    image: Pointer<"fz_image">,
    ctm: Pointer<"fz_matrix">,
    colorspace: Pointer<"fz_colorspace">,
    color: Pointer<"float">,
    alpha: number,
  ): void;
  _wasm_clip_image_mask(
    dev: Pointer<"fz_device">,
    image: Pointer<"fz_image">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_pop_clip(dev: Pointer<"fz_device">): void;
  _wasm_begin_mask(
    dev: Pointer<"fz_device">,
    area: Pointer<"fz_rect">,
    luminosity: boolean,
    colorspace: Pointer<"fz_colorspace">,
    color: Pointer<"float">,
  ): void;
  _wasm_end_mask(dev: Pointer<"fz_device">): void;
  _wasm_begin_group(
    dev: Pointer<"fz_device">,
    area: Pointer<"fz_rect">,
    colorspace: Pointer<"fz_colorspace">,
    isolated: boolean,
    knockout: boolean,
    blendmode: number,
    alpha: number,
  ): void;
  _wasm_end_group(dev: Pointer<"fz_device">): void;
  _wasm_begin_tile(
    dev: Pointer<"fz_device">,
    area: Pointer<"fz_rect">,
    view: Pointer<"fz_rect">,
    xstep: number,
    ystep: number,
    ctm: Pointer<"fz_matrix">,
    id: number,
  ): number;
  _wasm_end_tile(dev: Pointer<"fz_device">): void;
  _wasm_begin_layer(dev: Pointer<"fz_device">, name: Pointer<"char">): void;
  _wasm_end_layer(dev: Pointer<"fz_device">): void;
  _wasm_new_document_writer_with_buffer(
    buf: Pointer<"fz_buffer">,
    format: Pointer<"char">,
    options: Pointer<"char">,
  ): Pointer<"fz_document_writer">;
  _wasm_begin_page(
    wri: Pointer<"fz_document_writer">,
    mediabox: Pointer<"fz_rect">,
  ): Pointer<"fz_device">;
  _wasm_end_page(wri: Pointer<"fz_document_writer">): void;
  _wasm_close_document_writer(wri: Pointer<"fz_document_writer">): void;
  _wasm_print_stext_page_as_json(
    page: Pointer<"fz_stext_page">,
    scale: number,
  ): Pointer<"char">;
  _wasm_search_stext_page(
    text: Pointer<"fz_stext_page">,
    needle: Pointer<"char">,
    marks: Pointer<"int">,
    hits: Pointer<"fz_quad">,
    hit_max: number,
  ): number;
  _wasm_copy_selection(
    text: Pointer<"fz_stext_page">,
    a: Pointer<"fz_point">,
    b: Pointer<"fz_point">,
  ): Pointer<"char">;
  _wasm_highlight_selection(
    text: Pointer<"fz_stext_page">,
    a: Pointer<"fz_point">,
    b: Pointer<"fz_point">,
    hits: Pointer<"fz_quad">,
    n: number,
  ): number;
  _wasm_print_stext_page_as_html(
    page: Pointer<"fz_stext_page">,
    id: number,
  ): Pointer<"char">;
  _wasm_print_stext_page_as_text(
    page: Pointer<"fz_stext_page">,
  ): Pointer<"char">;
  _wasm_open_document_with_buffer(
    magic: Pointer<"char">,
    buffer: Pointer<"fz_buffer">,
  ): Pointer<"any_document">;
  _wasm_open_document_with_stream(
    magic: Pointer<"char">,
    stream: Pointer<"fz_stream">,
  ): Pointer<"any_document">;
  _wasm_format_link_uri(
    doc: Pointer<"any_document">,
    ch: number,
    pg: number,
    ty: number,
    x: number,
    y: number,
    w: number,
    h: number,
    z: number,
  ): Pointer<"char">;
  _wasm_needs_password(doc: Pointer<"any_document">): number;
  _wasm_authenticate_password(
    doc: Pointer<"any_document">,
    password: Pointer<"char">,
  ): number;
  _wasm_has_permission(doc: Pointer<"any_document">, perm: number): number;
  _wasm_count_pages(doc: Pointer<"any_document">): number;
  _wasm_load_page(
    doc: Pointer<"any_document">,
    number: number,
  ): Pointer<"any_page">;
  _wasm_lookup_metadata(
    doc: Pointer<"any_document">,
    key: Pointer<"char">,
  ): Pointer<"char">;
  _wasm_set_metadata(
    doc: Pointer<"any_document">,
    key: Pointer<"char">,
    value: Pointer<"char">,
  ): void;
  _wasm_resolve_link(
    doc: Pointer<"any_document">,
    uri: Pointer<"char">,
  ): number;
  _wasm_resolve_link_dest(
    doc: Pointer<"any_document">,
    uri: Pointer<"char">,
  ): Pointer<"fz_link_dest">;
  _wasm_load_outline(doc: Pointer<"any_document">): Pointer<"fz_outline">;
  _wasm_outline_get_page(
    doc: Pointer<"any_document">,
    outline: Pointer<"fz_outline">,
  ): number;
  _wasm_layout_document(
    doc: Pointer<"any_document">,
    w: number,
    h: number,
    em: number,
  ): void;
  _wasm_is_document_reflowable(doc: Pointer<"any_document">): boolean;
  _wasm_link_set_rect(link: Pointer<"fz_link">, rect: Pointer<"fz_rect">): void;
  _wasm_link_set_uri(link: Pointer<"fz_link">, uri: Pointer<"char">): void;
  _wasm_bound_page(
    page: Pointer<"any_page">,
    box_type: number,
  ): Pointer<"fz_rect">;
  _wasm_load_links(page: Pointer<"any_page">): Pointer<"fz_link">;
  _wasm_create_link(
    page: Pointer<"any_page">,
    bbox: Pointer<"fz_rect">,
    uri: Pointer<"char">,
  ): Pointer<"fz_link">;
  _wasm_delete_link(page: Pointer<"any_page">, link: Pointer<"fz_link">): void;
  _wasm_run_page(
    page: Pointer<"any_page">,
    dev: Pointer<"fz_device">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_run_page_contents(
    page: Pointer<"any_page">,
    dev: Pointer<"fz_device">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_run_page_annots(
    page: Pointer<"any_page">,
    dev: Pointer<"fz_device">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_run_page_widgets(
    page: Pointer<"any_page">,
    dev: Pointer<"fz_device">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_new_stext_page_from_page(
    page: Pointer<"any_page">,
    option_string: Pointer<"char">,
  ): Pointer<"fz_stext_page">;
  _wasm_new_display_list_from_page(
    page: Pointer<"any_page">,
  ): Pointer<"fz_display_list">;
  _wasm_new_display_list_from_page_contents(
    page: Pointer<"any_page">,
  ): Pointer<"fz_display_list">;
  _wasm_page_label(page: Pointer<"any_page">): Pointer<"char">;
  _wasm_search_page(
    page: Pointer<"any_page">,
    needle: Pointer<"char">,
    marks: Pointer<"int">,
    hits: Pointer<"fz_quad">,
    hit_max: number,
  ): number;
  _wasm_new_outline_iterator(
    doc: Pointer<"any_document">,
  ): Pointer<"fz_outline_iterator">;
  _wasm_outline_iterator_next(iter: Pointer<"fz_outline_iterator">): number;
  _wasm_outline_iterator_prev(iter: Pointer<"fz_outline_iterator">): number;
  _wasm_outline_iterator_up(iter: Pointer<"fz_outline_iterator">): number;
  _wasm_outline_iterator_down(iter: Pointer<"fz_outline_iterator">): number;
  _wasm_outline_iterator_delete(iter: Pointer<"fz_outline_iterator">): number;
  _wasm_outline_iterator_item(
    iter: Pointer<"fz_outline_iterator">,
  ): Pointer<"fz_outline_item">;
  _wasm_outline_iterator_insert(
    iter: Pointer<"fz_outline_iterator">,
    title: Pointer<"char">,
    uri: Pointer<"char">,
    is_open: boolean,
  ): number;
  _wasm_outline_iterator_update(
    iter: Pointer<"fz_outline_iterator">,
    title: Pointer<"char">,
    uri: Pointer<"char">,
    is_open: boolean,
  ): void;
  _wasm_pdf_document_from_fz_document(
    document: Pointer<"any_document">,
  ): Pointer<"any_document">;
  _wasm_pdf_page_from_fz_page(page: Pointer<"any_page">): Pointer<"any_page">;
  _wasm_pdf_create_document(): Pointer<"any_document">;
  _wasm_pdf_version(doc: Pointer<"any_document">): number;
  _wasm_pdf_was_repaired(doc: Pointer<"any_document">): number;
  _wasm_pdf_has_unsaved_changes(doc: Pointer<"any_document">): number;
  _wasm_pdf_can_be_saved_incrementally(doc: Pointer<"any_document">): number;
  _wasm_pdf_count_versions(doc: Pointer<"any_document">): number;
  _wasm_pdf_count_unsaved_versions(doc: Pointer<"any_document">): number;
  _wasm_pdf_validate_change_history(doc: Pointer<"any_document">): number;
  _wasm_pdf_enable_journal(doc: Pointer<"any_document">): void;
  _wasm_pdf_undoredo_state_position(doc: Pointer<"any_document">): number;
  _wasm_pdf_undoredo_state_count(doc: Pointer<"any_document">): number;
  _wasm_pdf_undoredo_step(
    doc: Pointer<"any_document">,
    step: number,
  ): Pointer<"char">;
  _wasm_pdf_begin_operation(
    doc: Pointer<"any_document">,
    op: Pointer<"char">,
  ): void;
  _wasm_pdf_begin_implicit_operation(doc: Pointer<"any_document">): void;
  _wasm_pdf_end_operation(doc: Pointer<"any_document">): void;
  _wasm_pdf_abandon_operation(doc: Pointer<"any_document">): void;
  _wasm_pdf_undo(doc: Pointer<"any_document">): void;
  _wasm_pdf_redo(doc: Pointer<"any_document">): void;
  _wasm_pdf_can_undo(doc: Pointer<"any_document">): number;
  _wasm_pdf_can_redo(doc: Pointer<"any_document">): number;
  _wasm_pdf_document_language(doc: Pointer<"any_document">): Pointer<"char">;
  _wasm_pdf_set_document_language(
    doc: Pointer<"any_document">,
    str: Pointer<"char">,
  ): void;
  _wasm_pdf_trailer(doc: Pointer<"any_document">): Pointer<"pdf_obj">;
  _wasm_pdf_xref_len(doc: Pointer<"any_document">): number;
  _wasm_pdf_lookup_page_obj(
    doc: Pointer<"any_document">,
    index: number,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_add_object(
    doc: Pointer<"any_document">,
    obj: Pointer<"pdf_obj">,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_create_object(doc: Pointer<"any_document">): number;
  _wasm_pdf_delete_object(doc: Pointer<"any_document">, num: number): void;
  _wasm_pdf_add_stream(
    doc: Pointer<"any_document">,
    buf: Pointer<"fz_buffer">,
    obj: Pointer<"pdf_obj">,
    compress: number,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_add_simple_font(
    doc: Pointer<"any_document">,
    font: Pointer<"fz_font">,
    encoding: number,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_add_cjk_font(
    doc: Pointer<"any_document">,
    font: Pointer<"fz_font">,
    ordering: number,
    wmode: number,
    serif: boolean,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_add_cid_font(
    doc: Pointer<"any_document">,
    font: Pointer<"fz_font">,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_add_image(
    doc: Pointer<"any_document">,
    image: Pointer<"fz_image">,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_load_image(
    doc: Pointer<"any_document">,
    ref: Pointer<"pdf_obj">,
  ): Pointer<"fz_image">;
  _wasm_pdf_add_page(
    doc: Pointer<"any_document">,
    mediabox: Pointer<"fz_rect">,
    rotate: number,
    resources: Pointer<"pdf_obj">,
    contents: Pointer<"fz_buffer">,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_insert_page(
    doc: Pointer<"any_document">,
    index: number,
    obj: Pointer<"pdf_obj">,
  ): void;
  _wasm_pdf_delete_page(doc: Pointer<"any_document">, index: number): void;
  _wasm_pdf_set_page_labels(
    doc: Pointer<"any_document">,
    index: number,
    style: number,
    prefix: Pointer<"char">,
    start: number,
  ): void;
  _wasm_pdf_delete_page_labels(
    doc: Pointer<"any_document">,
    index: number,
  ): void;
  _wasm_pdf_is_embedded_file(ref: Pointer<"pdf_obj">): number;
  _wasm_pdf_get_embedded_file_params(
    ref: Pointer<"pdf_obj">,
  ): Pointer<"pdf_embedded_file_params">;
  _wasm_pdf_add_embedded_file(
    doc: Pointer<"any_document">,
    filename: Pointer<"char">,
    mimetype: Pointer<"char">,
    contents: Pointer<"fz_buffer">,
    created: number,
    modified: number,
    checksum: boolean,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_load_embedded_file_contents(
    fs: Pointer<"pdf_obj">,
  ): Pointer<"fz_buffer">;
  _wasm_pdf_write_document_buffer(
    doc: Pointer<"any_document">,
    options: Pointer<"char">,
  ): Pointer<"fz_buffer">;
  _wasm_pdf_js_supported(doc: Pointer<"any_document">): number;
  _wasm_pdf_enable_js(doc: Pointer<"any_document">): void;
  _wasm_pdf_disable_js(doc: Pointer<"any_document">): void;
  _wasm_pdf_rearrange_pages(
    doc: Pointer<"any_document">,
    n: number,
    pages: Pointer<"int">,
  ): void;
  _wasm_pdf_bake_document(
    doc: Pointer<"any_document">,
    bake_annots: boolean,
    bake_widgets: boolean,
  ): void;
  _wasm_pdf_page_transform(page: Pointer<"any_page">): Pointer<"fz_matrix">;
  _wasm_pdf_set_page_box(
    page: Pointer<"any_page">,
    which: number,
    rect: Pointer<"fz_rect">,
  ): void;
  _wasm_pdf_first_annot(page: Pointer<"any_page">): Pointer<"pdf_annot">;
  _wasm_pdf_next_annot(annot: Pointer<"pdf_annot">): Pointer<"pdf_annot">;
  _wasm_pdf_first_widget(page: Pointer<"any_page">): Pointer<"pdf_annot">;
  _wasm_pdf_next_widget(annot: Pointer<"pdf_annot">): Pointer<"pdf_annot">;
  _wasm_pdf_create_annot(
    page: Pointer<"any_page">,
    type: number,
  ): Pointer<"pdf_annot">;
  _wasm_pdf_delete_annot(
    page: Pointer<"any_page">,
    annot: Pointer<"pdf_annot">,
  ): void;
  _wasm_pdf_update_page(page: Pointer<"any_page">): number;
  _wasm_pdf_redact_page(
    page: Pointer<"any_page">,
    black_boxes: number,
    image_method: number,
  ): void;
  _wasm_pdf_new_graft_map(
    doc: Pointer<"any_document">,
  ): Pointer<"pdf_graft_map">;
  _wasm_pdf_graft_mapped_object(
    map: Pointer<"pdf_graft_map">,
    obj: Pointer<"pdf_obj">,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_graft_object(
    dst: Pointer<"any_document">,
    obj: Pointer<"pdf_obj">,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_graft_mapped_page(
    map: Pointer<"pdf_graft_map">,
    to: number,
    src: Pointer<"any_document">,
    from: number,
  ): void;
  _wasm_pdf_graft_page(
    dst: Pointer<"any_document">,
    to: number,
    src: Pointer<"any_document">,
    from: number,
  ): void;
  _wasm_pdf_bound_annot(annot: Pointer<"pdf_annot">): Pointer<"fz_rect">;
  _wasm_pdf_run_annot(
    annot: Pointer<"pdf_annot">,
    dev: Pointer<"fz_device">,
    ctm: Pointer<"fz_matrix">,
  ): void;
  _wasm_pdf_new_pixmap_from_annot(
    annot: Pointer<"pdf_annot">,
    ctm: Pointer<"fz_matrix">,
    colorspace: Pointer<"fz_colorspace">,
    alpha: boolean,
  ): Pointer<"fz_pixmap">;
  _wasm_pdf_new_display_list_from_annot(
    annot: Pointer<"pdf_annot">,
  ): Pointer<"fz_display_list">;
  _wasm_pdf_update_annot(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_obj(annot: Pointer<"pdf_annot">): Pointer<"pdf_obj">;
  _wasm_pdf_annot_type(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_flags(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_flags(annot: Pointer<"pdf_annot">, v: number): void;
  _wasm_pdf_annot_contents(annot: Pointer<"pdf_annot">): Pointer<"char">;
  _wasm_pdf_set_annot_contents(
    annot: Pointer<"pdf_annot">,
    v: Pointer<"char">,
  ): void;
  _wasm_pdf_annot_author(annot: Pointer<"pdf_annot">): Pointer<"char">;
  _wasm_pdf_set_annot_author(
    annot: Pointer<"pdf_annot">,
    v: Pointer<"char">,
  ): void;
  _wasm_pdf_annot_creation_date(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_creation_date(
    annot: Pointer<"pdf_annot">,
    v: number,
  ): void;
  _wasm_pdf_annot_modification_date(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_modification_date(
    annot: Pointer<"pdf_annot">,
    v: number,
  ): void;
  _wasm_pdf_annot_border_width(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_border_width(
    annot: Pointer<"pdf_annot">,
    v: number,
  ): void;
  _wasm_pdf_annot_border_style(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_border_style(
    annot: Pointer<"pdf_annot">,
    v: number,
  ): void;
  _wasm_pdf_annot_border_effect(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_border_effect(
    annot: Pointer<"pdf_annot">,
    v: number,
  ): void;
  _wasm_pdf_annot_border_effect_intensity(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_border_effect_intensity(
    annot: Pointer<"pdf_annot">,
    v: number,
  ): void;
  _wasm_pdf_annot_opacity(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_opacity(annot: Pointer<"pdf_annot">, v: number): void;
  _wasm_pdf_annot_filespec(annot: Pointer<"pdf_annot">): Pointer<"pdf_obj">;
  _wasm_pdf_set_annot_filespec(
    annot: Pointer<"pdf_annot">,
    v: Pointer<"pdf_obj">,
  ): void;
  _wasm_pdf_annot_quadding(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_quadding(annot: Pointer<"pdf_annot">, v: number): void;
  _wasm_pdf_annot_is_open(annot: Pointer<"pdf_annot">): boolean;
  _wasm_pdf_set_annot_is_open(annot: Pointer<"pdf_annot">, v: boolean): void;
  _wasm_pdf_annot_hidden_for_editing(annot: Pointer<"pdf_annot">): boolean;
  _wasm_pdf_set_annot_hidden_for_editing(
    annot: Pointer<"pdf_annot">,
    v: boolean,
  ): void;
  _wasm_pdf_annot_icon_name(annot: Pointer<"pdf_annot">): Pointer<"char">;
  _wasm_pdf_set_annot_icon_name(
    annot: Pointer<"pdf_annot">,
    v: Pointer<"char">,
  ): void;
  _wasm_pdf_annot_intent(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_intent(annot: Pointer<"pdf_annot">, v: number): void;
  _wasm_pdf_annot_callout_style(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_callout_style(
    annot: Pointer<"pdf_annot">,
    v: number,
  ): void;
  _wasm_pdf_annot_line_leader(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_line_leader(annot: Pointer<"pdf_annot">, v: number): void;
  _wasm_pdf_annot_line_leader_extension(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_line_leader_extension(
    annot: Pointer<"pdf_annot">,
    v: number,
  ): void;
  _wasm_pdf_annot_line_leader_offset(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_line_leader_offset(
    annot: Pointer<"pdf_annot">,
    v: number,
  ): void;
  _wasm_pdf_annot_line_caption(annot: Pointer<"pdf_annot">): boolean;
  _wasm_pdf_set_annot_line_caption(
    annot: Pointer<"pdf_annot">,
    v: boolean,
  ): void;
  _wasm_pdf_annot_callout_point(
    annot: Pointer<"pdf_annot">,
  ): Pointer<"fz_point">;
  _wasm_pdf_annot_line_caption_offset(
    annot: Pointer<"pdf_annot">,
  ): Pointer<"fz_point">;
  _wasm_pdf_annot_rect(annot: Pointer<"pdf_annot">): Pointer<"fz_rect">;
  _wasm_pdf_annot_popup(annot: Pointer<"pdf_annot">): Pointer<"fz_rect">;
  _wasm_pdf_annot_quad_point_count(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_quad_point(
    annot: Pointer<"pdf_annot">,
    idx: number,
  ): Pointer<"fz_quad">;
  _wasm_pdf_annot_vertex_count(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_vertex(
    annot: Pointer<"pdf_annot">,
    idx: number,
  ): Pointer<"fz_point">;
  _wasm_pdf_annot_ink_list_count(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_ink_list_stroke_count(
    annot: Pointer<"pdf_annot">,
    idx: number,
  ): number;
  _wasm_pdf_annot_ink_list_stroke_vertex(
    annot: Pointer<"pdf_annot">,
    a: number,
    b: number,
  ): Pointer<"fz_point">;
  _wasm_pdf_annot_border_dash_count(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_border_dash_item(
    annot: Pointer<"pdf_annot">,
    idx: number,
  ): number;
  _wasm_pdf_annot_has_rect(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_ink_list(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_quad_points(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_vertices(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_line(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_interior_color(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_line_ending_styles(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_border(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_border_effect(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_icon_name(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_open(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_author(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_filespec(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_has_callout(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_language(doc: Pointer<"pdf_annot">): Pointer<"char">;
  _wasm_pdf_set_annot_language(
    doc: Pointer<"pdf_annot">,
    str: Pointer<"char">,
  ): void;
  _wasm_pdf_set_annot_popup(
    annot: Pointer<"pdf_annot">,
    rect: Pointer<"fz_rect">,
  ): void;
  _wasm_pdf_set_annot_rect(
    annot: Pointer<"pdf_annot">,
    rect: Pointer<"fz_rect">,
  ): void;
  _wasm_pdf_clear_annot_quad_points(annot: Pointer<"pdf_annot">): void;
  _wasm_pdf_clear_annot_vertices(annot: Pointer<"pdf_annot">): void;
  _wasm_pdf_clear_annot_ink_list(annot: Pointer<"pdf_annot">): void;
  _wasm_pdf_clear_annot_border_dash(annot: Pointer<"pdf_annot">): void;
  _wasm_pdf_add_annot_quad_point(
    annot: Pointer<"pdf_annot">,
    quad: Pointer<"fz_quad">,
  ): void;
  _wasm_pdf_add_annot_vertex(
    annot: Pointer<"pdf_annot">,
    point: Pointer<"fz_point">,
  ): void;
  _wasm_pdf_add_annot_ink_list_stroke(annot: Pointer<"pdf_annot">): void;
  _wasm_pdf_add_annot_ink_list_stroke_vertex(
    annot: Pointer<"pdf_annot">,
    point: Pointer<"fz_point">,
  ): void;
  _wasm_pdf_add_annot_border_dash_item(
    annot: Pointer<"pdf_annot">,
    v: number,
  ): void;
  _wasm_pdf_annot_line_ending_styles_start(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_line_1(annot: Pointer<"pdf_annot">): Pointer<"fz_point">;
  _wasm_pdf_annot_line_2(annot: Pointer<"pdf_annot">): Pointer<"fz_point">;
  _wasm_pdf_set_annot_line(
    annot: Pointer<"pdf_annot">,
    a: Pointer<"fz_point">,
    b: Pointer<"fz_point">,
  ): void;
  _wasm_pdf_set_annot_callout_point(
    annot: Pointer<"pdf_annot">,
    point: Pointer<"fz_point">,
  ): void;
  _wasm_pdf_annot_callout_line(
    annot: Pointer<"pdf_annot">,
    line: Pointer<"fz_point">,
  ): number;
  _wasm_pdf_set_annot_callout_line(
    annot: Pointer<"pdf_annot">,
    n: number,
    a: Pointer<"fz_point">,
    b: Pointer<"fz_point">,
    c: Pointer<"fz_point">,
  ): void;
  _wasm_pdf_set_annot_line_caption_offset(
    annot: Pointer<"pdf_annot">,
    point: Pointer<"fz_point">,
  ): void;
  _wasm_pdf_annot_line_ending_styles_end(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_line_ending_styles(
    annot: Pointer<"pdf_annot">,
    start: number,
    end: number,
  ): void;
  _wasm_pdf_annot_color(
    annot: Pointer<"pdf_annot">,
    color: Pointer<"float">,
  ): number;
  _wasm_pdf_annot_interior_color(
    annot: Pointer<"pdf_annot">,
    color: Pointer<"float">,
  ): number;
  _wasm_pdf_set_annot_color(
    annot: Pointer<"pdf_annot">,
    n: number,
    color: Pointer<"float">,
  ): void;
  _wasm_pdf_set_annot_interior_color(
    annot: Pointer<"pdf_annot">,
    n: number,
    color: Pointer<"float">,
  ): void;
  _wasm_pdf_set_annot_default_appearance(
    annot: Pointer<"pdf_annot">,
    font: Pointer<"char">,
    size: number,
    ncolor: number,
    color: Pointer<"float">,
  ): void;
  _wasm_pdf_annot_default_appearance_font(
    annot: Pointer<"pdf_annot">,
  ): Pointer<"char">;
  _wasm_pdf_annot_default_appearance_size(annot: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_default_appearance_color(
    annot: Pointer<"pdf_annot">,
    color: Pointer<"float">,
  ): number;
  _wasm_pdf_set_annot_appearance_from_display_list(
    annot: Pointer<"pdf_annot">,
    appearance: Pointer<"char">,
    state: Pointer<"char">,
    ctm: Pointer<"fz_matrix">,
    list: Pointer<"fz_display_list">,
  ): void;
  _wasm_pdf_set_annot_appearance(
    annot: Pointer<"pdf_annot">,
    appearance: Pointer<"char">,
    state: Pointer<"char">,
    ctm: Pointer<"fz_matrix">,
    bbox: Pointer<"fz_rect">,
    resources: Pointer<"pdf_obj">,
    contents: Pointer<"fz_buffer">,
  ): void;
  _wasm_pdf_apply_redaction(
    annot: Pointer<"pdf_annot">,
    black_boxes: number,
    image_method: number,
  ): void;
  _wasm_pdf_annot_field_type(widget: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_field_flags(widget: Pointer<"pdf_annot">): number;
  _wasm_pdf_annot_field_label(annot: Pointer<"pdf_annot">): Pointer<"char">;
  _wasm_pdf_annot_field_value(annot: Pointer<"pdf_annot">): Pointer<"char">;
  _wasm_pdf_load_field_name(widget: Pointer<"pdf_annot">): Pointer<"char">;
  _wasm_pdf_annot_text_widget_max_len(widget: Pointer<"pdf_annot">): number;
  _wasm_pdf_set_annot_text_field_value(
    widget: Pointer<"pdf_annot">,
    value: Pointer<"char">,
  ): number;
  _wasm_pdf_set_annot_choice_field_value(
    widget: Pointer<"pdf_annot">,
    value: Pointer<"char">,
  ): number;
  _wasm_pdf_annot_choice_field_option_count(
    widget: Pointer<"pdf_annot">,
  ): number;
  _wasm_pdf_annot_choice_field_option(
    widget: Pointer<"pdf_annot">,
    is_export: boolean,
    i: number,
  ): Pointer<"char">;
  _wasm_pdf_toggle_widget(widget: Pointer<"pdf_annot">): number;
  _wasm_pdf_is_indirect(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_is_bool(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_is_int(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_is_number(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_is_name(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_is_string(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_is_array(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_is_dict(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_is_stream(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_to_num(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_to_bool(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_to_real(obj: Pointer<"pdf_obj">): number;
  _wasm_pdf_to_name(obj: Pointer<"pdf_obj">): Pointer<"char">;
  _wasm_pdf_to_text_string(obj: Pointer<"pdf_obj">): Pointer<"char">;
  _wasm_pdf_new_indirect(
    doc: Pointer<"any_document">,
    num: number,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_new_array(
    doc: Pointer<"any_document">,
    cap: number,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_new_dict(
    doc: Pointer<"any_document">,
    cap: number,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_new_bool(v: boolean): Pointer<"pdf_obj">;
  _wasm_pdf_new_int(v: number): Pointer<"pdf_obj">;
  _wasm_pdf_new_real(v: number): Pointer<"pdf_obj">;
  _wasm_pdf_new_name(v: Pointer<"char">): Pointer<"pdf_obj">;
  _wasm_pdf_new_text_string(v: Pointer<"char">): Pointer<"pdf_obj">;
  _wasm_pdf_new_string(ptr: Pointer<"char">, len: number): Pointer<"pdf_obj">;
  _wasm_pdf_resolve_indirect(obj: Pointer<"pdf_obj">): Pointer<"pdf_obj">;
  _wasm_pdf_array_len(obj: Pointer<"pdf_obj">): Pointer<"pdf_obj">;
  _wasm_pdf_array_get(obj: Pointer<"pdf_obj">, idx: number): Pointer<"pdf_obj">;
  _wasm_pdf_dict_get(
    obj: Pointer<"pdf_obj">,
    key: Pointer<"pdf_obj">,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_dict_len(obj: Pointer<"pdf_obj">): Pointer<"pdf_obj">;
  _wasm_pdf_dict_get_key(
    obj: Pointer<"pdf_obj">,
    idx: number,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_dict_get_val(
    obj: Pointer<"pdf_obj">,
    idx: number,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_dict_get_inheritable(
    obj: Pointer<"pdf_obj">,
    key: Pointer<"pdf_obj">,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_dict_gets(
    obj: Pointer<"pdf_obj">,
    key: Pointer<"char">,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_dict_gets_inheritable(
    obj: Pointer<"pdf_obj">,
    key: Pointer<"char">,
  ): Pointer<"pdf_obj">;
  _wasm_pdf_dict_put(
    obj: Pointer<"pdf_obj">,
    key: Pointer<"pdf_obj">,
    val: Pointer<"pdf_obj">,
  ): void;
  _wasm_pdf_dict_puts(
    obj: Pointer<"pdf_obj">,
    key: Pointer<"char">,
    val: Pointer<"pdf_obj">,
  ): void;
  _wasm_pdf_dict_del(obj: Pointer<"pdf_obj">, key: Pointer<"pdf_obj">): void;
  _wasm_pdf_dict_dels(obj: Pointer<"pdf_obj">, key: Pointer<"char">): void;
  _wasm_pdf_array_put(
    obj: Pointer<"pdf_obj">,
    key: number,
    val: Pointer<"pdf_obj">,
  ): void;
  _wasm_pdf_array_push(obj: Pointer<"pdf_obj">, val: Pointer<"pdf_obj">): void;
  _wasm_pdf_array_delete(obj: Pointer<"pdf_obj">, key: number): void;
  _wasm_pdf_sprint_obj(
    obj: Pointer<"pdf_obj">,
    tight: boolean,
    ascii: boolean,
  ): Pointer<"char">;
  _wasm_pdf_load_stream(obj: Pointer<"pdf_obj">): Pointer<"fz_buffer">;
  _wasm_pdf_load_raw_stream(obj: Pointer<"pdf_obj">): Pointer<"fz_buffer">;
  _wasm_pdf_update_object(
    doc: Pointer<"any_document">,
    num: number,
    obj: Pointer<"pdf_obj">,
  ): void;
  _wasm_pdf_update_stream(
    doc: Pointer<"any_document">,
    ref: Pointer<"pdf_obj">,
    buf: Pointer<"fz_buffer">,
    raw: number,
  ): void;
  _wasm_pdf_to_string(
    obj: Pointer<"pdf_obj">,
    size: Pointer<"int">,
  ): Pointer<"char">;
  _wasm_new_stream(id: number): Pointer<"fz_stream">;
}
