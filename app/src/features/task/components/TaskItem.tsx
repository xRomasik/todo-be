import { EditTextModal } from "./EditTextModal";
import { formatDate } from "../../../lib/helpers/date";
import { Checkbox } from "../../../lib/components/Checkbox";
import type { Task } from "../entity";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../../../store/tasksSlice";
import { useToggleTask } from "../hooks/useToggleTask";
import { useAppSelector } from "../../../store/redux";

type TaskItemProps = {
  task: Task;
};

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const toggleTask = useToggleTask(task.completed);
  const isUILocked = useAppSelector((state) => state.ui.isUILocked);

  return (
    <li className={`task ${task.completed ? "task--completed" : ""}`}>
      <Checkbox
        checked={task.completed}
        disabled={isUILocked}
        onChange={(checked) => {
          toggleTask(task.id, checked);
        }}
      />
      <div className="task__content">
        <div className="task__text">{task.text}</div>
        <div className="task__meta">
          Vytvořeno: {formatDate(task.createdDate)}
          {task.completedDate && (
            <> • Dokončeno: {formatDate(task.completedDate)}</>
          )}
        </div>
      </div>
      <div className="task__actions">
        <EditTextModal
          initialText={task.text}
          formId={task.id}
          disabled={isUILocked}
          onSave={(updatedText) => {
            updateTask({ id: task.id, text: updatedText });
          }}
        />
        <button
          onClick={() => deleteTask(task.id)}
          className="btn btn--danger btn--small"
          disabled={isUILocked}
        >
          🗑️ Smazat
        </button>
      </div>
    </li>
  );
};
