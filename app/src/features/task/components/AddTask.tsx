import { useCreateTaskMutation } from "../../../store/tasksSlice";
import { useAppSelector } from "../../../store/redux";

const AddTask = () => {
  const [createTask] = useCreateTaskMutation();
  const isUILocked = useAppSelector((state) => state.ui.isUILocked);

  const addTaskAction = (formData: FormData) => {
    const title = formData.get("title")?.toString().trim();

    if (!title) {
      return;
    }

    createTask(title);
  };

  return (
    <form action={addTaskAction} className="add-task">
      <input
        name="title"
        type="text"
        placeholder="Zadejte nový úkol..."
        className="add-task__input"
        disabled={isUILocked}
        required
      />
      <button type="submit" className="btn btn--primary" disabled={isUILocked}>
        Přidat
      </button>
    </form>
  );
};

export default AddTask;
