use rome_formatter::{format as format_code, FormatOptions, IndentStyle};
use rslint_errors::file::SimpleFiles;
use rslint_errors::termcolor::{ColorSpec, WriteColor};
use rslint_errors::{Formatter, LongFormatter};
use rslint_parser::parse_module;
use std::io;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct PlaygroundResult {
    ast: String,
    cst: String,
    formatted_code: String,
    errors: String,
}

#[wasm_bindgen]
impl PlaygroundResult {
    #[wasm_bindgen(getter)]
    pub fn ast(&self) -> String {
        self.ast.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn cst(&self) -> String {
        self.cst.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn formatted_code(&self) -> String {
        self.formatted_code.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn errors(&self) -> String {
        self.errors.clone()
    }
}

struct ErrorOutput(Vec<u8>);

impl io::Write for ErrorOutput {
    fn write(&mut self, buf: &[u8]) -> io::Result<usize> {
        self.0.write(buf)
    }

    fn flush(&mut self) -> io::Result<()> {
        self.0.flush()
    }
}

impl WriteColor for ErrorOutput {
    fn supports_color(&self) -> bool {
        false
    }

    fn set_color(&mut self, _spec: &ColorSpec) -> io::Result<()> {
        Ok(())
    }

    fn reset(&mut self) -> io::Result<()> {
        Ok(())
    }
}

#[wasm_bindgen]
pub fn run(code: String) -> PlaygroundResult {
    let mut simple_files = SimpleFiles::new();
    let main_file_id = simple_files.add("main.js".to_string(), code.clone());

    let parse = parse_module(&code, main_file_id);
    let syntax = parse.syntax();
    let options = FormatOptions {
        indent_style: IndentStyle::Tab,
        line_width: 80,
    };

    let cst = format!("{:#?}", syntax);
    let ast = format!("{:#?}", parse.tree());
    let formatted_code = format_code(options, &syntax)
        // TODO: impl Error for FormatError
        .unwrap()
        .into_code();

    let mut errors = ErrorOutput(Vec::new());
    let mut error_formatter = LongFormatter;
    error_formatter.emit_with_writer(parse.errors(), &simple_files, &mut errors);

    PlaygroundResult {
        cst,
        ast,
        formatted_code,
        errors: String::from_utf8(errors.0).unwrap(),
    }
}
