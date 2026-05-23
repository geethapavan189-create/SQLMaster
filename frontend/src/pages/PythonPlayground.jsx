import { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Code2, Play, RotateCcw, Loader2 } from 'lucide-react';

const sampleCode = `# Python Playground - Write and test your code here!

# Example: Variables and printing
name = "Alice"
age = 25
print(f"Hello, {name}! You are {age} years old.")

# Try modifying the code above and click Run!
`;

export default function PythonPlayground() {
  const [code, setCode] = useState(sampleCode);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  const runCode = () => {
    setRunning(true);
    // Simple Python interpreter simulation
    try {
      let result = [];
      const lines = code.split('\n');
      const vars = {};
      
      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue;
        
        // Handle print statements
        const printMatch = line.match(/^print\((.+)\)$/);
        if (printMatch) {
          let content = printMatch[1];
          // Handle f-strings simply
          content = content.replace(/f["'](.+?)["']/, (_, inner) => {
            return inner.replace(/\{(.+?)\}/g, (__, expr) => {
              return vars[expr.trim()] || expr;
            });
          });
          // Handle string literals
          content = content.replace(/^["'](.+)["']$/, '$1');
          // Handle variables
          if (vars[content] !== undefined) content = vars[content];
          result.push(String(content));
          continue;
        }
        
        // Handle variable assignment
        const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
        if (assignMatch) {
          let val = assignMatch[2].trim();
          if (val.startsWith('"') || val.startsWith("'")) {
            val = val.slice(1, -1);
          } else if (!isNaN(val)) {
            val = Number(val);
          } else if (val === 'True') val = true;
          else if (val === 'False') val = false;
          vars[assignMatch[1]] = val;
        }
      }
      
      setOutput(result.length > 0 ? result.join('\n') : '(No output - add print() statements to see results)');
    } catch (e) {
      setOutput(`Error: ${e.message}`);
    }
    setRunning(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-dark-800 border-b border-dark-700 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <Code2 size={20} className="text-yellow-400" />
          Python Playground
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => { setCode(sampleCode); setOutput(''); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600">
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={runCode} disabled={running}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 font-medium">
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Run
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-dark-700">
          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={(v) => setCode(v || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'JetBrains Mono, monospace',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
            }}
          />
        </div>
        <div className="h-1/3 lg:h-full lg:w-2/5 bg-dark-900 p-4 overflow-auto">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Output</div>
          {output ? (
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
          ) : (
            <p className="text-sm text-gray-500">Click "Run" to execute your code</p>
          )}
        </div>
      </div>
    </div>
  );
}
