import { defineMonacoSetup } from "@slidev/types";

export default defineMonacoSetup(() => {
  return {
    editorOptions: {
      lineNumbers: "on",
    },
  };
});
