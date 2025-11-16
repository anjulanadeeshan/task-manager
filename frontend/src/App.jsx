import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (e) {
      console.log("error : ", e);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      console.log(response.data);
      setTodos(response.data);
    } catch (e) {
      console.log("error fetching todos: ", e);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (e) {
      console.log("error deleting todo: ", e);
    }
  };

  const startEdit = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditedText("");
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText,
      });

      setTodos(todos.map((t) => (t._id === id ? response.data : t)));

      cancelEdit();
    } catch (e) {
      console.log("error editing todo: ", e);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        isCompleted: !todo.isCompleted,
      });
      setTodos(todos.map((t) => (t._id === todo._id ? response.data : t)));
    } catch (e) {
      console.log("error updating todo :", e);
    }
  };

  return (
    <div className="min-h-screen bg-liner-to-br from gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 justify-between text-center">
          Task Manager
        </h1>
        <form
          onSubmit={addTodo}
          className="flex items-center gap-2 shadow-sm border border-gray-200 p-2 rounded-md"
        >
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="what needs to be done? "
            className="flex-1 outline-none px-2 py-2 text-gray-700 placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer "
          >
            Add Task
          </button>
        </form>
        {/*this is updated section*/}
        <div className="mt-8">
          {todos.length === 0 ? (
              <p className="text-center text-gray-500">tasks are empty</p>
          ) : (
            <ul className="space-y-4">
              {todos.map((todo) => (
                <li key={todo._id} className="flex items-center justify-between p-1 bg-gray-50 rounded-md shadow-sm">
                  {editingTodo === todo._id ? (
                    //editing mode
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="flex-1 outline-none px-2 py-1 border rounded"
                      />
                      <button onClick={() => saveEdit(todo._id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Save</button>
                      <button onClick={cancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={todo.isCompleted}
                          onChange={() => toggleComplete(todo)}
                          className="h5 w-5 text-blue-500 rounded"
                        />
                        <span
                          className={`text-lg text-gray-800 ${todo.isCompleted ? "line-through text-gray-400" : ""}`}
                        >
                          {todo.text}
                        </span>
                      </div>
                      <div className="gap-3 flex items-center">
                        <button onClick={() => startEdit(todo)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
                        <button onClick={() => deleteTodo(todo._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
