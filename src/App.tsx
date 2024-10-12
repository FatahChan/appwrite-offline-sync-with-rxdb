import { useRxCollection, useRxData } from "rxdb-hooks";
import { todoDocumentSchema } from "./lib/appwrite/schema";
import { convertAppwriteDocToRxDbDoc } from "./lib/utils";
import { RxDbTodoDocType } from "./lib/RxDB/schema";

function App() {
  const collection = useRxCollection<RxDbTodoDocType>("todo");

  const { result: todos = [], isFetching } = useRxData<RxDbTodoDocType>(
    "todo",
    (collection) => collection.find()
  );

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const target = e.target as HTMLFormElement;
          const formData = new FormData(target);
          const task = formData.get("task") as string;
          const { data, success } = todoDocumentSchema.safeParse({
            title: task,
            completed: false,
          });
          if (success) {
            const mapped = convertAppwriteDocToRxDbDoc(data);
            collection?.insert(mapped);
          }
          target.reset();
        }}
      >
        <input type="text" name="task" placeholder="Task" />
        <button type="submit">Add</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          {isFetching ? (
            <tr>
              <td colSpan={2}>Loading...</td>
            </tr>
          ) : null}
          {!isFetching && todos?.length == 0 ? (
            <tr>
              <td colSpan={2}> No Results</td>
            </tr>
          ) : null}
          {todos?.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.title}</td>
              <td>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(value) => {
                    collection?.findOne(todo.id).patch({
                      completed: value.target.checked,
                    });
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
