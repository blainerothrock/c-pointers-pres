/**
 * Slidev C code runner — compiles via Godbolt API and shows:
 *   - Inline Monaco decorations next to printf/puts lines
 *   - Compact stdout/stderr output panel
 *   - Compiler Explorer link
 *
 * Usage in markdown code blocks:
 *
 *   Default (all features):          ```c{monaco-run}
 *   Output panel only:               ```c{monaco-run} { runnerOptions: { inline: false } }
 *   Inline decorations only:         ```c{monaco-run} { runnerOptions: { panel: false } }
 *   No Compiler Explorer link:       ```c{monaco-run} { runnerOptions: { link: false } }
 *   Different compiler/flags:        ```c{monaco-run} { runnerOptions: { compiler: 'cclang1901', flags: '-O2 -Wall' } }
 *   Constrain code block size:       ```c{monaco-run} { runnerOptions: { maxWidth: '480px', maxHeight: '300px' } }
 *
 * Note: use single quotes for string values (Vue compiles the options inside double-quoted v-bind).
 */

import { defineCodeRunnersSetup } from "@slidev/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RunnerOptions {
  compiler: string;
  flags: string;
  inline: boolean;
  panel: boolean;
  link: boolean;
  maxWidth: string;
  maxHeight: string;
}

interface GodboltLine {
  text: string;
}

interface GodboltResponse {
  execResult?: {
    stdout?: GodboltLine[];
    stderr?: GodboltLine[];
  };
  stderr?: GodboltLine[];
}

interface ParsedOutput {
  stdout: string;
  stderr: string;
  stdoutLines: string[];
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULTS: RunnerOptions = {
  compiler: "cg141",
  flags: "-O0",
  inline: true,
  panel: true,
  link: true,
  maxWidth: "",
  maxHeight: "",
};

// ---------------------------------------------------------------------------
// Promise-based compile cache & run tracking
// ---------------------------------------------------------------------------

const compileCache = new Map<string, Promise<GodboltResponse>>();

// Track which code snippets the user has explicitly run.
// Slidev eagerly mounts all slides and auto-fires every monaco-run runner on
// load — even for off-screen slides. We use this set to skip the initial
// auto-run and only compile when the user clicks ▶ (second+ invocation).
const hasBeenRun = new Set<string>();

function cacheKey(code: string, compiler: string, flags: string): string {
  // Simple string hash — good enough to avoid duplicate in-flight requests
  const raw = `${code}\0${compiler}\0${flags}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0;
  }
  return `${compiler}:${h.toString(36)}`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function callGodbolt(
  code: string,
  compiler: string,
  flags: string,
): Promise<GodboltResponse> {
  const res = await fetch(
    `https://godbolt.org/api/compiler/${encodeURIComponent(compiler)}/compile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        source: code,
        options: {
          userArguments: flags,
          filters: {
            execute: true,
            intel: true,
            demangle: true,
            directives: true,
            commentOnly: true,
          },
        },
      }),
    },
  );
  if (!res.ok) throw new Error(`Godbolt API ${res.status}`);
  return res.json();
}

function parseResponse(data: GodboltResponse): ParsedOutput {
  const stdout =
    data.execResult?.stdout?.map((l) => l.text).join("\n") || "";
  const stderr =
    data.execResult?.stderr?.map((l) => l.text).join("\n") ||
    data.stderr?.map((l) => l.text).join("\n") ||
    "";

  const stdoutLines = stdout ? stdout.split("\n") : [];
  if (stdoutLines.length && stdoutLines[stdoutLines.length - 1] === "") {
    stdoutLines.pop();
  }

  return { stdout, stderr, stdoutLines };
}

function buildGodboltUrl(
  code: string,
  compiler: string,
  flags: string,
): string {
  const clientState = {
    sessions: [
      {
        id: 1,
        language: "c",
        source: code,
        compilers: [],
        executors: [{ compiler: { id: compiler, options: flags } }],
      },
    ],
  };
  return `https://godbolt.org/clientstate/${btoa(JSON.stringify(clientState))}`;
}

function mapOutputToLines(
  code: string,
  stdoutLines: string[],
): { l: number; t: string }[] {
  const sourceLines = code.split("\n");
  const printLineNums: number[] = [];
  sourceLines.forEach((line, i) => {
    if (/\b(printf|puts)\s*\(/.test(line)) {
      printLineNums.push(i + 1);
    }
  });

  const inlineOutputs: { l: number; t: string }[] = [];
  for (let i = 0; i < printLineNums.length; i++) {
    if (i < printLineNums.length - 1) {
      if (i < stdoutLines.length) {
        inlineOutputs.push({ l: printLineNums[i], t: stdoutLines[i] });
      }
    } else {
      const rest = stdoutLines.slice(i);
      if (rest.length) {
        inlineOutputs.push({ l: printLineNums[i], t: rest.join(", ") });
      }
    }
  }
  return inlineOutputs;
}

function buildInlineJs(uid: string): string {
  // Readable source — joined into a single minified string for img onload
  return [
    "(function(img){",
    "try{",
    `var d=document.getElementById('io-${uid}');`,
    "if(!d)return;",
    "var o=JSON.parse(d.getAttribute('data-o'));",
    "var c=img.closest('.slidev-monaco-container');",
    "if(!c||!window.monaco)return;",
    "var el=c.querySelector('.monaco-editor');",
    "if(!el)return;",
    "var eds=window.monaco.editor.getEditors(),ed;",
    "for(var i=0;i<eds.length;i++){",
    "var n=eds[i].getDomNode();",
    "if(n&&(n===el||el.contains(n)||n.contains(el))){ed=eds[i];break}",
    "}",
    "if(!ed)return;",
    "if(ed._ioDeco)ed._ioDeco.clear();",
    "ed._ioDeco=ed.createDecorationsCollection(o.map(function(x){",
    "return{range:new monaco.Range(x.l,1,x.l,9999),",
    `options:{after:{content:'\\u00a0\\u00a0\\u2192 '+x.t,`,
    `inlineClassName:'io-${uid}'}}}`,
    "}));",
    "}catch(e){console.error('inline-output',e)}",
    "})(this)",
  ].join("");
}

// ---------------------------------------------------------------------------
// HTML builders
// ---------------------------------------------------------------------------

function buildOutputPanel(stdout: string, stderr: string): string {
  const parts: string[] = [];

  if (stdout) {
    parts.push(
      `<pre style="color:inherit;margin:0;white-space:pre-wrap;word-break:break-all;">${escHtml(stdout)}</pre>`,
    );
  }
  if (stderr) {
    parts.push(
      `<pre style="color:#b58900;margin:0;white-space:pre-wrap;word-break:break-all;">${escHtml(stderr)}</pre>`,
    );
  }

  if (!parts.length) return "";

  return `<div style="max-height:80px;overflow-y:auto;font-family:monospace;font-size:11px;padding:6px 12px;background:rgba(128,128,128,0.12);border-top:1px solid rgba(128,128,128,0.2);">${parts.join("")}</div>`;
}

function buildGodboltLink(url: string, uid: string): string {
  // Inject a CE button into the play-button toolbar via img onload,
  // since our output HTML renders below the editor, not in the toolbar.
  const js = [
    "(function(img){",
    "try{",
    "var c=img.closest('.slidev-monaco-container');",
    "if(!c)return;",
    "var bar=c.querySelector('.absolute.right-1.top-1');",
    "if(!bar)return;",
    "var old=bar.querySelector('[id^=\"ce-\"]');if(old)old.remove();",
    "var a=document.createElement('a');",
    `a.id='ce-${uid}';`,
    `a.href='${url.replace(/'/g, "\\'")}';`,
    "a.target='_blank';",
    "a.title='Open in Compiler Explorer';",
    "a.className='slidev-icon-btn';",
    "a.style.cssText='width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:bold;color:#e0e0e0;text-decoration:none;opacity:0.75;';",
    "a.textContent='CE';",
    "bar.prepend(a);",
    "}catch(e){}",
    "})(this)",
  ].join("");
  return `<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="display:none" onload="${escHtml(js)}">`;
}

function buildErrorHtml(stderr: string, linkHtml: string): string {
  return `<pre style="color:#f44747;font-family:monospace;font-size:11px;padding:6px 12px;margin:0;white-space:pre-wrap;word-break:break-all;">${escHtml(stderr)}</pre>${linkHtml}`;
}

function buildInlineHtml(
  uid: string,
  inlineOutputs: { l: number; t: string }[],
  inlineJs: string,
): string {
  const dataAttr = escHtml(JSON.stringify(inlineOutputs));
  return [
    `<style>.io-${uid}{color:#4ec9b0 !important;font-style:italic;opacity:0.8;}</style>`,
    `<div id="io-${uid}" data-o="${dataAttr}" style="display:none"></div>`,
    `<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="display:none" onload="${escHtml(inlineJs)}">`,
  ].join("");
}

function buildContainerStyle(opts: RunnerOptions): string {
  if (!opts.maxWidth && !opts.maxHeight) return "";
  const jsParts: string[] = [];

  if (opts.maxWidth) {
    jsParts.push(
      `var c=img.closest('.slidev-monaco-container');`,
      `if(c)c.style.cssText+=';max-width:${opts.maxWidth}';`,
    );
  }
  if (opts.maxHeight) {
    jsParts.push(
      `var inner=img.closest('.slidev-monaco-container')`,
      `&&img.closest('.slidev-monaco-container').querySelector('.slidev-monaco-container-inner');`,
      `if(inner)inner.style.cssText+=';max-height:${opts.maxHeight};overflow:auto';`,
    );
  }

  const js = `(function(img){try{${jsParts.join("")}}catch(e){}})(this)`;
  return `<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="display:none" onload="${escHtml(js)}">`;
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

export default defineCodeRunnersSetup(() => {
  return {
    async c(code, ctx) {
      // 1. Merge options
      const opts: RunnerOptions = { ...DEFAULTS, ...(ctx.options as Partial<RunnerOptions>) };

      // 2. Build pieces that appear even before first run
      const uid = Math.random().toString(36).slice(2, 8);
      const godboltUrl = buildGodboltUrl(code, opts.compiler, opts.flags);
      const linkHtml = opts.link ? buildGodboltLink(godboltUrl, uid) : "";
      const containerHtml = buildContainerStyle(opts);

      // 3. Guard: skip the auto-run that Slidev fires on mount for every slide.
      //    The first call per code snippet returns just the CE button + container
      //    sizing; actual compilation only happens when the user clicks ▶.
      const runKey = cacheKey(code, opts.compiler, opts.flags);
      if (!hasBeenRun.has(runKey)) {
        hasBeenRun.add(runKey);
        return { html: containerHtml + linkHtml };
      }

      // 4. Compile (cache-aware)
      const key = runKey;
      if (!compileCache.has(key)) {
        compileCache.set(
          key,
          callGodbolt(code, opts.compiler, opts.flags).catch((err) => {
            compileCache.delete(key); // evict on failure so retry works
            throw err;
          }),
        );
      }
      const data = await compileCache.get(key)!;

      // 5. Parse response
      const { stdout, stderr, stdoutLines } = parseResponse(data);

      // 6. Compilation error with no stdout — show error directly
      if (stderr && !stdout) {
        return { html: buildErrorHtml(stderr, linkHtml) };
      }

      // 7. Assemble output (CE button in linkHtml, sizing in containerHtml)
      const parts: string[] = [containerHtml];

      if (opts.inline && stdoutLines.length) {
        const mapped = mapOutputToLines(code, stdoutLines);
        if (mapped.length) {
          parts.push(buildInlineHtml(uid, mapped, buildInlineJs(uid)));
        }
      }

      if (opts.panel && (stdout || stderr)) {
        parts.push(buildOutputPanel(stdout, stderr));
      }

      if (stderr && !opts.panel) {
        // Show inline warning badge when panel is off but there are warnings
        parts.push(
          `<span style="color:#cca700;font-family:monospace;font-size:10px;padding:0 8px;" title="${escHtml(stderr)}">⚠ warnings</span>`,
        );
      }

      parts.push(linkHtml);

      return { html: parts.join("") };
    },
  };
});
