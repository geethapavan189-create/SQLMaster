import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { playgroundAPI } from '../services/api';
import { Play, RotateCcw, Database, Info, Table, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Playground() {
  const [query, setQuery] = useState('SELECT * FROM employees LIMIT 10;');
  const [dataset, setDataset] = useState('employees');
  const [result, setResult] = useState(null);
  const [schema, setSchema] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [explanation, setExplanation] = useState(null);

  useEffect(() => {
    loadSchema();
  }, [dataset]);

  const loadSchema = async () => {
    try {
      const res = await playgroundAPI.getSchema(dataset);
      setSchema(res.data);
    } catch (err) {
      console.error('Failed to load schema:', err);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }
    setExecuting(true);
    setExplanation(null);
    try {
      const res = await playgroundAPI.execute({ query, dataset });
      setResult(res.data);
      if (!res.data.success) {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Execution failed');
    } finally {
      setExecuting(false);
    }
  };

  const explainQuery = async () => {
    try {
      const res = await playgroundAPI.explain({ query, dataset });
      setExplanation(res.data);
    } catch (err) {
      toast.error('Failed to explain query');
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      executeQuery();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Toolbar */}
      <div className="bg-dark-800 border-b border-dark-700 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-display font-semibold text-white flex items-center gap-2">
            <Database size={20} className="text-primary-400" />
            SQL Playground
          </h1>
          <select
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
            className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-primary-500"
          >
            <option value="employees">Employees DB</option>
            <option value="ecommerce">E-Commerce DB</option>
            <option value="students">Students DB</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSchema(!showSchema)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-all"
          >
            <Table size={14} /> Schema
          </button>
          <button
            onClick={explainQuery}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-all"
          >
            <Info size={14} /> Explain
          </button>
          <button
            onClick={() => { setQuery(''); setResult(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-all"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={executeQuery}
            disabled={executing}
            className="btn-primary py-1.5 px-4 text-sm flex items-center gap-1.5"
          >
            {executing ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Run (⌘+Enter)
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Schema Panel */}
        {showSchema && schema && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-dark-800 border-r border-dark-700 overflow-y-auto p-4"
          >
            <h3 className="text-sm font-semibold text-white mb-3">Tables</h3>
            {schema.tables?.map((table, i) => (
              <div key={i} className="mb-4">
                <div className="text-sm font-medium text-primary-400 mb-1">{table.name}</div>
                <div className="space-y-0.5">
                  {table.columns?.map((col, j) => (
                    <div key={j} className="flex items-center justify-between text-xs px-2 py-1 rounded hover:bg-dark-700">
                      <span className="text-gray-300">{col.name}</span>
                      <span className="text-gray-500">{col.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="h-1/2 border-b border-dark-700" onKeyDown={handleKeyDown}>
            <Editor
              height="100%"
              defaultLanguage="sql"
              value={query}
              onChange={(value) => setQuery(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 16 },
              }}
            />
          </div>

          {/* Results */}
          <div className="h-1/2 overflow-auto bg-dark-900 p-4">
            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-dark-800 rounded-lg border border-primary-500/30"
              >
                <h4 className="text-sm font-semibold text-primary-400 mb-2">Query Explanation</h4>
                <p className="text-sm text-gray-300">{explanation.explanation}</p>
                {explanation.optimization_tips?.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-yellow-400">Tips:</span>
                    <ul className="text-xs text-gray-400 mt-1">
                      {explanation.optimization_tips.map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {result ? (
              <div>
                <div className={`text-sm mb-3 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? '✓' : '✗'} {result.message}
                  {result.execution_time > 0 && (
                    <span className="text-gray-500 ml-2">({result.execution_time}ms)</span>
                  )}
                </div>
                {result.columns?.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-dark-700">
                          {result.columns.map((col, i) => (
                            <th key={i} className="text-left py-2 px-3 text-gray-400 font-medium whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows?.map((row, i) => (
                          <tr key={i} className="border-b border-dark-800 hover:bg-dark-800/50">
                            {row.map((cell, j) => (
                              <td key={j} className="py-2 px-3 text-gray-300 whitespace-nowrap">
                                {cell === null ? <span className="text-gray-600 italic">NULL</span> : String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Database size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Run a query to see results</p>
                  <p className="text-xs mt-1">Press ⌘+Enter or click Run</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
