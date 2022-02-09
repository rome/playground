import "./App.css";
import CodeEditor from "@uiw/react-textarea-code-editor";
import "react-tabs/style/react-tabs.css";
import init, {
  format as formatWithRome,
  get_ast as getAst,
  get_cst as getCst,
} from "../pkg/rome_playground";
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
    console.error(err);
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
      const ast = getAst(code);
      const cst = getCst(code);
      return (
        <div className="flex bg-slate-100">
          <div className="w-1/2 p-5 divide-x-2 divide-slate-200">
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
              </TabList>
              <TabPanel>
                <h1>Rome</h1>
                <CodeEditor
                  value={formatWithRome(code)}
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
            </Tabs>
          </div>
        </div>
      );
  }
}

export default App;
