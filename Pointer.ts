declare const _brand: unique symbol;
/**
 * Represents a pointer to a memory location.
 *
 * This definition is created by the "branded types" technique.
 */
export type Pointer<B extends string> = number & { readonly [_brand]: B };
