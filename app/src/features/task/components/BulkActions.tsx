import { useAppSelector } from "../../../store/redux";
import {
  useGetTasksQuery,
  useCompleteAllTasksMutation,
  useDeleteAllCompletedMutation,
} from "../../../store/tasksSlice";

export const BulkActions = () => {
  const { data: tasks = [] } = useGetTasksQuery();
  const [completeAllTasks] = useCompleteAllTasksMutation();
  const [deleteAllCompleted] = useDeleteAllCompletedMutation();
  const { isCompletingAll, isDeletingAll } = useAppSelector(
    (state) => state.ui.bulkOperations
  );
  const isUILocked = useAppSelector((state) => state.ui.isUILocked);

  const handleCompleteAll = async () => {
    const incompleteIds = tasks
      .filter((task) => !task.completed)
      .map((task) => task.id);

    if (incompleteIds.length > 0) {
      await completeAllTasks(incompleteIds);
    }
  };

  const handleDeleteAllCompleted = async () => {
    const completedCount = tasks.filter((task) => task.completed).length;
    if (completedCount > 0) {
      await deleteAllCompleted();
    }
  };

  const hasCompleted = tasks.some((task) => task.completed);
  const hasInCompleted = tasks.some((task) => !task.completed);

  return (
    <div className="bulk">
      <button
        onClick={handleCompleteAll}
        disabled={!hasInCompleted || isUILocked}
        className="btn btn--primary btn--small"
      >
        {isCompletingAll ? (
          <>
            <span className="spinning__icon">⏳</span> Označuji
            <span className="loading__dots"></span>
          </>
        ) : (
          "✓ Označit vše jako hotové"
        )}
      </button>
      <button
        onClick={handleDeleteAllCompleted}
        disabled={!hasCompleted || isUILocked}
        className="btn btn--danger btn--small"
      >
        {isDeletingAll ? (
          <>
            <span className="spinning__icon">⏳</span> Mažu
            <span className="loading__dots"></span>
          </>
        ) : (
          "🗑️ Smazat hotové úkoly"
        )}
      </button>
    </div>
  );
};
