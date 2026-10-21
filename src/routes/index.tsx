import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

type Todo = { id: string; text: string; done: boolean; due: string };

const KEY = 'todos-v1';

function load(): Todo[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as Todo[];
  } catch {
    return [];
  }
}

function HomePage() {
  const [todos, setTodos] = useState<Todo[]>(load);
  const [text, setText] = useState('');
  const [due, setDue] = useState('');

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(todos));
  }, [todos]);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setTodos([{ id: crypto.randomUUID(), text: t, done: false, due }, ...todos]);
    setText('');
    setDue('');
  }

  const today = new Date().toISOString().slice(0, 10);
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-slate-900">My Tasks</h1>
        <p className="mt-1 text-slate-500">{remaining} task{remaining === 1 ? '' : 's'} left</p>

        <form onSubmit={add} className="mt-6 flex flex-wrap gap-2 rounded-xl bg-white p-3 shadow-sm">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs doing?"
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-500"
          />
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600"
          />
          <button className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">Add</button>
        </form>

        <ul className="mt-6 space-y-2">
          {todos.map((t) => (
            <li key={t.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => setTodos(todos.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                className="h-5 w-5 accent-indigo-600"
              />
              <div className="min-w-0 flex-1">
                <p className={t.done ? 'text-slate-400 line-through' : 'text-slate-800'}>{t.text}</p>
                {t.due && (
                  <p className={`text-xs ${!t.done && t.due < today ? 'text-red-500' : 'text-slate-400'}`}>
                    Due {t.due}
                  </p>
                )}
              </div>
              <button
                onClick={() => setTodos(todos.filter((x) => x.id !== t.id))}
                className="text-slate-400 hover:text-red-500"
                aria-label="Delete"
              >
                ✕
              </button>
            </li>
          ))}
          {todos.length === 0 && <li className="py-8 text-center text-slate-400">No tasks yet. Add your first one!</li>}
        </ul>
      </div>
    </div>
  );
}
