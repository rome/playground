import { IndentStyle } from "./types";

interface Props {
  setIndentType: (indentType: IndentStyle) => void;
  indentType: IndentStyle;
}

export default function IndentStyleSelect({
  indentType,
  setIndentType,
}: Props) {
  return (
    <div className="w-[300px] pl-5 pb-5">
      <label
        htmlFor="location"
        className="block text-sm font-medium text-gray-700"
      >
        Indent Type
      </label>
      <select
        id="location"
        name="location"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        value={indentType}
        onChange={(e) => {
          setIndentType(e.target.value as IndentStyle);
        }}
      >
        <option value={IndentStyle.Tab}>Tabs</option>
        <option value={IndentStyle.Space}>Spaces</option>
      </select>
    </div>
  );
}
