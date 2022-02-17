/* tslint:disable */
/* eslint-disable */
/**
* @param {string} code
* @param {number} line_width
* @param {boolean} is_tab
* @param {number} indent_width
* @returns {PlaygroundResult}
*/
export function run(code: string, line_width: number, is_tab: boolean, indent_width: number): PlaygroundResult;
/**
*/
export class PlaygroundResult {
  free(): void;
/**
* @returns {string}
*/
  readonly ast: string;
/**
* @returns {string}
*/
  readonly cst: string;
/**
* @returns {string}
*/
  readonly errors: string;
/**
* @returns {string}
*/
  readonly formatted_code: string;
/**
* @returns {string}
*/
  readonly formatter_ir: string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_playgroundresult_free: (a: number) => void;
  readonly playgroundresult_ast: (a: number, b: number) => void;
  readonly playgroundresult_cst: (a: number, b: number) => void;
  readonly playgroundresult_formatted_code: (a: number, b: number) => void;
  readonly playgroundresult_formatter_ir: (a: number, b: number) => void;
  readonly playgroundresult_errors: (a: number, b: number) => void;
  readonly run: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
