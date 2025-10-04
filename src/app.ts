    type Todo = {
      id: string;
      text: string;
      completed: boolean;
    };

    const STORAGE_KEY = "todos_tailwind_ts";
    const todoList = document.getElementById("todo-list")!;
    const todoForm = document.getElementById("todo-form")!;
    const todoInput = document.getElementById("todo-input") as HTMLInputElement;
    const clearBtn = document.getElementById("clear-btn")!;
    const toggleAllBtn = document.getElementById("toggle-all")!;

    let todos: Todo[] = [];

    function saveTodos(data: Todo[]) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function loadTodos(): Todo[] {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }

    function initializeTodosFromJSON(initial: Todo[] | (() => Todo[])) {
      const current = loadTodos();
      if (current.length > 0) return current;
      const data = typeof initial === "function" ? initial() : initial;
      saveTodos(data);
      return data;
    }

    function renderTodos() {
      todoList.innerHTML = "";
      if (todos.length === 0) {
        const li = document.createElement("li");
        li.className = "text-center text-gray-500";
        li.textContent = "هیچ کاری ثبت نشده";
        todoList.appendChild(li);
        return;
      }

      todos.forEach(todo => {
        const li = document.createElement("li");
        li.className = "flex items-center justify-between bg-gray-50 p-2 rounded";

        const left = document.createElement("div");
        left.className = "flex items-center gap-2";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.className = "w-4 h-4";
        checkbox.addEventListener("change", () => {
          todo.completed = !todo.completed;
          saveTodos(todos);
          renderTodos();
        });

        const text = document.createElement("span");
        text.textContent = todo.text;
        text.className = todo.completed ? "line-through text-gray-500" : "";
        text.addEventListener("dblclick", () => {
          const newText = prompt("ویرایش کار:", todo.text);
          if (newText && newText.trim()) {
            todo.text = newText.trim();
            saveTodos(todos);
            renderTodos();
          }
        });

        left.appendChild(checkbox);
        left.appendChild(text);

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑";
        delBtn.className = "text-red-500";
        delBtn.addEventListener("click", () => {
          todos = todos.filter(t => t.id !== todo.id);
          saveTodos(todos);
          renderTodos();
        });

        li.append(left, delBtn);
        todoList.appendChild(li);
      });
    }

    // رویداد افزودن
    todoForm.addEventListener("submit", e => {
      e.preventDefault();
      const value = todoInput.value.trim();
      if (!value) return;
      todos.unshift({ id: crypto.randomUUID(), text: value, completed: false });
      saveTodos(todos);
      renderTodos();
      todoInput.value = "";
    });

    // پاک کردن همه
    clearBtn.addEventListener("click", () => {
      if (confirm("همه کارها پاک شوند؟")) {
        todos = [];
        saveTodos(todos);
        renderTodos();
      }
    });

    // تغییر وضعیت همه
    toggleAllBtn.addEventListener("click", () => {
      const allDone = todos.every(t => t.completed);
      todos = todos.map(t => ({ ...t, completed: !allDone }));
      saveTodos(todos);
      renderTodos();
    });

    // مقدار اولیه (اگر localStorage خالی باشه)
    todos = initializeTodosFromJSON(() => [
      { id: "1", text: "خرید شیر", completed: false },
      { id: "2", text: "تمرین تایپ اسکریپت", completed: true }
    ]);

    renderTodos();