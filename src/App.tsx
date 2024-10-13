import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useRxDb from "./context/RxDb/hook";
import { todoDocumentSchema } from "./lib/appwrite/schema";
import { RxDbTodoDocType } from "./lib/RxDB/schema";
import { convertAppwriteDocToRxDbDoc } from "./lib/utils";
import { useUser } from "./context/user/hook";
import { initReplication } from "./lib/RxDB";

function App() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <AddTaskForm />
        <StartSyncButton />
        <AuthForm />
      </div>
      <Table />
    </>
  );
}

function AddTaskForm() {
  const db = useRxDb();
  const queryClient = useQueryClient();

  const { mutate: addTodo, isPending: isAddingTodo } = useMutation({
    mutationFn: async (task: string) => {
      const { data, success } = todoDocumentSchema.safeParse({
        title: task,
      });
      if (success) {
        const mapped = convertAppwriteDocToRxDbDoc(data);
        return await db?.collections.todo.insert(mapped);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const task = formData.get("task") as string;
        addTodo(task);
        target.reset();
      }}
    >
      <input
        type="text"
        name="task"
        placeholder="Task"
        disabled={!db || isAddingTodo}
      />
      <button type="submit" disabled={!db || isAddingTodo}>
        Add
      </button>
    </form>
  );
}

function StartSyncButton() {
  const { user } = useUser();
  if (!user) {
    return null;
  }
  return (
    <button
      onClick={() => {
        initReplication();
      }}
    >
      Start Sync
    </button>
  );
}
function AuthForm() {
  const { login, logout, user, register } = useUser();
  if (user) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          logout();
        }}
      >
        Logout
      </button>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const isRegister = formData.get("register") === "on";
        if (isRegister) {
          register(email, password);
          return;
        }
        login(email, password);
      }}
    >
      <input type="text" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Submit</button>
      <label>
        <input type="checkbox" name="register" />
        Register
      </label>
    </form>
  );
}
function Table() {
  const db = useRxDb();
  const { data: todos = [], isPending: isPendingTodos } = useQuery({
    enabled: !!db,
    queryKey: ["todos"],
    queryFn: async () => {
      if (!db) {
        return [];
      }
      const todos = await db.collections.todo.find().exec();
      return todos;
    },
  });
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#f2f2f2" }}>
          <th style={{ padding: "8px", border: "1px solid #ddd" }}>Task</th>
          <th style={{ padding: "8px", border: "1px solid #ddd" }}>
            Completed
          </th>
          <th style={{ padding: "8px", border: "1px solid #ddd" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {!db || isPendingTodos ? (
          <tr>
            <td colSpan={3} style={{ textAlign: "center" }}>
              Loading...
            </td>
          </tr>
        ) : null}
        {db && !isPendingTodos && todos?.length === 0 ? (
          <tr>
            <td colSpan={3} style={{ textAlign: "center" }}>
              No Results
            </td>
          </tr>
        ) : null}
        {todos?.map((todo) => (
          <TodoRow key={todo.id} initialTodo={todo} />
        ))}
      </tbody>
    </table>
  );
}

function TodoRow({ initialTodo }: { initialTodo: RxDbTodoDocType }) {
  const db = useRxDb();
  const { data: todo }: { data: RxDbTodoDocType | null } = useQuery({
    // Explicitly define the type for 'todo'
    queryKey: ["todos", initialTodo.id],
    initialData: initialTodo,
    queryFn: async () => {
      const todo = await db?.collections.todo.findOne(initialTodo.id).exec();
      if (!todo) {
        return null;
      }
      return todo?.toJSON() as RxDbTodoDocType;
    },
  });

  const queryClient = useQueryClient();
  const { mutate: deleteTodo } = useMutation({
    mutationFn: () => {
      if (!db || !todo) {
        throw new Error("No database or todo found");
      }
      return db.collections.todo.findOne(todo.id).remove();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  const { mutate: updateTodo } = useMutation({
    mutationFn: ({ completed }: { completed: boolean }) => {
      if (!db || !todo) {
        throw new Error("No database or todo found");
      }
      return db.collections.todo.findOne(todo.id).patch({ completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos", todo?.id || initialTodo.id],
      });
    },
  });
  if (!todo) {
    return null;
  }

  return (
    <tr>
      <td style={{ padding: "8px", border: "1px solid #ddd" }}>{todo.title}</td>
      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(value) => {
            updateTodo({
              completed: value.target.checked,
            });
          }}
        />
      </td>
      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
        <button
          onClick={() => {
            deleteTodo();
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default App;
