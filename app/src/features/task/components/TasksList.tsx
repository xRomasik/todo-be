import { useGetTasksQuery } from "../../../store/tasksSlice";
import { TaskItem } from "./TaskItem";
import { Spinner } from "../../../lib/components/Spinner";
import { useAppSelector } from "../../../store/redux";
import type { FilterType } from "./TaskFilter";

export const TasksList = () => {
  const { data: tasks = [], isLoading, error } = useGetTasksQuery();
  const filter = useAppSelector((state) => state.ui.filter);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.completed;
    }

    if (filter === "pending") {
      return !task.completed;
    }

    return true;
  });

  if (isLoading) {
    return <Spinner loadingMessage="Načítání úkolů..." />;
  }

  if (error) {
    return (
      <div className="error">
        <strong>Chyba:</strong> Něco se pokazilo při načítání úkolů. Zkuste to
        prosím znovu.
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    const emptyMessages: Record<FilterType, string> = {
      all: "Zatím nemáte žádné úkoly. Přidejte svůj první úkol!",
      pending: "Žádné nedokončené úkoly. Skvělá práce! 🎉",
      completed: "Zatím jste nedokončili žádné úkoly.",
    };

    return (
      <div className="empty">
        <div className="empty__icon">📝</div>
        <p className="empty__message">{emptyMessages[filter]}</p>
      </div>
    );
  }

  return (
    <section>
      <ul className="tasks__list">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </section>
  );
};
