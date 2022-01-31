use rome_formatter::{format as format_code, FormatOptions, IndentStyle};
use rslint_parser::parse_script;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn format(code: &str) -> String {
    let tree = parse_script(code, 0).syntax();

    let options = FormatOptions {
        indent_style: IndentStyle::Tab,
        line_width: 80,
    };

    format_code(options, &tree)
        // TODO: impl Error for FormatError
        .unwrap()
        .as_code()
        .to_string()
}

