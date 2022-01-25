# Playground

A simple playground for Rome. Right now just to test
the formatter, but we could use this as a potential dogfood for Rome

## Installation

[wasm-pack](https://github.com/rustwasm/wasm-pack) is 
required to build the playground. It's assumed that you've
cloned the playground repo in the same director as the tools repo.

To build run:
```
wasm-pack build --target web
```

Then open `index.html` in your browser.

If you have python3 installed you can run:
```
python3 -m http.server
```
and go to http://localhost:8000.