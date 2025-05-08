import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PencilIcon, TrashIcon, CheckIcon } from "@heroicons/react/outline"; // Import Heroicons

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === "") return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditId(null);
    setEditText("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-200 via-purple-200 to-pink-200 p-4">
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">To-Do List</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={addTodo}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto mb-4">
          <ul className="space-y-3">
            <AnimatePresence>
              {todos.map((todo, index) => (
                <motion.li
                  key={todo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm"
                >
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">{index + 1}.</span> {/* Display Index */}
                    {editId === todo.id ? (
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => saveEdit(todo.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(todo.id);
                        }}
                        autoFocus
                        className="flex-1 px-2 py-1 rounded border focus:outline-none focus:ring"
                      />
                    ) : (
                      <span
                        onClick={() => toggleTodo(todo.id)}
                        className={`flex-1 cursor-pointer ${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 ml-2">
                    {/* Edit Icon */}
                    <button
                      onClick={() => startEdit(todo)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>

                    {/* Delete Icon */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 font-bold text-lg"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>

                    {/* Check Icon (for completed task) */}
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`${
                        todo.completed ? "text-green-500" : "text-gray-500"
                      } hover:text-green-600`}
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}
