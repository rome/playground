import "./App.css";
import CodeEditor from "@uiw/react-textarea-code-editor";
import "react-tabs/style/react-tabs.css";
import init, { run } from "../pkg/rome_playground";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import { useEffect, useState } from "react";
import prettier from "prettier";
// @ts-ignore
import parserBabel from "prettier/esm/parser-babel";
import IndentStyleSelect from "./IndentStyleSelect";
import LineWidthInput from "./LineWidthInput";
import { IndentStyle } from "./types";

enum LoadingState {
  Loading,
  Success,
  Error,
}

function formatWithPrettier(
  code: string,
  options: { lineWidth: number; indentType: IndentStyle }
) {
  try {
    return prettier.format(code, {
      useTabs: options.indentType === IndentStyle.Tab,
      printWidth: options.lineWidth,
      parser: "babel",
      plugins: [parserBabel],
    });
  } catch (err) {
    return code;
  }
}

function App() {
  useEffect(() => {
    init()
      .then(() => {
        setLoadingState(LoadingState.Success);
      })
      .catch(() => {
        setLoadingState(LoadingState.Error);
      });
  }, []);

  const [loadingState, setLoadingState] = useState(LoadingState.Loading);
  const [code, setCode] = useState(
    window.location.hash !== "#" ? atob(window.location.hash.substring(1)) : ""
  );
  const [lineWidth, setLineWidth] = useState(80);
  const [indentType, setIndentType] = useState(IndentStyle.Tab);

  switch (loadingState) {
    case LoadingState.Error:
      return <div>Error loading. Please refresh</div>;
    case LoadingState.Loading:
      return (
        <div className="h-screen w-screen flex align-center justify-center">
          Loading...
        </div>
      );
    default:
      const { cst, ast, formatted_code, errors } = run(
        code,
        lineWidth,
        indentType === IndentStyle.Tab
      );
      return (
        <div className="divide-y divide-slate-300">
          <h1 className="p-4 text-xl">Rome Playground</h1>
          <div>
            <LineWidthInput lineWidth={lineWidth} setLineWidth={setLineWidth} />
            <IndentStyleSelect
              indentType={indentType}
              setIndentType={setIndentType}
            />
          </div>
          <div className="box-border flex h-screen divide-x divide-slate-300">
            <div className="w-1/2 p-5">
              <CodeEditor
                value={code}
                language="js"
                placeholder="Enter JS here"
                onChange={(evn) => {
                  setCode(evn.target.value);
                  window.location.hash = btoa(evn.target.value);
                }}
                style={{
                  fontSize: 12,
                  height: "100vh",
                  fontFamily:
                    "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                }}
              />
            </div>
            <div className="w-1/2 p-5 flex flex-col">
              <Tabs>
                <TabList>
                  <Tab selectedClassName="bg-slate-300">Formatter</Tab>
                  <Tab selectedClassName="bg-slate-300">CST</Tab>
                  <Tab selectedClassName="bg-slate-300">AST</Tab>
                  <Tab
                    disabled={errors === ""}
                    selectedClassName="bg-slate-300"
                  >
                    Errors
                  </Tab>
                </TabList>
                <TabPanel>
                  <h1>Rome</h1>
                  <CodeEditor
                    value={formatted_code}
                    language="js"
                    placeholder="Rome Output"
                    style={{
                      fontSize: 12,
                      height: "40vh",
                      fontFamily:
                        "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }}
                  />
                  <h1>Prettier</h1>
                  <CodeEditor
                    value={formatWithPrettier(code, { lineWidth, indentType })}
                    language="js"
                    placeholder="Prettier Output"
                    style={{
                      fontSize: 12,
                      height: "50vh",
                      fontFamily:
                        "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }}
                  />
                </TabPanel>
                <TabPanel>
                  <pre className="h-screen overflow-y-scroll">{cst}</pre>
                </TabPanel>
                <TabPanel>
                  <pre className="h-screen overflow-y-scroll">{ast}</pre>
                </TabPanel>
                <TabPanel>
                  <pre className="h-screen overflow-y-scroll whitespace-pre-wrap text-red-500 text-xs">
                    {errors}
                  </pre>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      );
  }
}

export default App;
