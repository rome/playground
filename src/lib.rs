use rome_formatter::{FormatOptions, Formatter, IndentStyle};
use rslint_parser::parse_script;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn format(code: &str) -> String {
    let tree = parse_script(code, 0).syntax();

    let options = FormatOptions {
        indent_style: IndentStyle::Tab,
        line_width: 80,
    };

    Formatter::new(options)
        .format_root(&tree)
        // TODO: impl Error for FormatError
        .unwrap()
        .code()
        .to_string()
}

