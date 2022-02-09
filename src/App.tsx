import "./App.css";
import CodeEditor from "@uiw/react-textarea-code-editor";
import "react-tabs/style/react-tabs.css";
import init, { format as formatWithRome, run } from "../pkg/rome_playground";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import { useEffect, useState } from "react";
import prettier from "prettier";
// @ts-ignore
import parserBabel from "prettier/esm/parser-babel";

enum LoadingState {
  Loading,
  Success,
  Error,
}

function formatWithPrettier(code: string) {
  try {
    return prettier.format(code, {
      useTabs: true,
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

  switch (loadingState) {
    case LoadingState.Error:
      return <div>Error loading. Please refresh</div>;
    case LoadingState.Loading:
      return <div>Loading...</div>;
    default:
      const { cst, ast, formatted_code, errors } = run(code);
      return (
        <div className="divide-y divide-slate-300">
          <h1 className="p-4 text-xl">Rome Playground</h1>
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
                    value={formatWithPrettier(code)}
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
