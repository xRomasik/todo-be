import { useAppSelector, useAppDispatch } from "../../../store/redux";
import { useGetTasksQuery } from "../../../store/tasksSlice";
import { setFilter } from "../../../store/uiSlice";

export type FilterType = "all" | "pending" | "completed";

export const TaskFilter = () => {
  const { data: tasks = [] } = useGetTasksQuery();
  const currentFilter = useAppSelector((state) => state.ui.filter);
  const dispatch = useAppDispatch();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const filterOptions: {
    filterType: FilterType;
    label: string;
    color: string;
    count: number;
  }[] = [
    {
      filterType: "all",
      label: "Celkem",
      color: "info",
      count: totalTasks,
    },
    {
      filterType: "pending",
      label: "Nedokončené",
      color: "warning",
      count: pendingTasks,
    },
    {
      filterType: "completed",
      label: "Dokončené",
      color: "success",
      count: completedTasks,
    },
  ];

  return (
    <nav className="filter">
      {filterOptions.map(({ filterType, label, color, count }) => (
        <button
          type="button"
          key={filterType}
          onClick={() => dispatch(setFilter(filterType))}
          className={`filter__tab ${
            currentFilter === filterType ? "filter__tab--active" : ""
          }`}
        >
          <div className={`filter__count filter__count--${color}`}>{count}</div>
          <div className="filter__label">{label}</div>
        </button>
      ))}
    </nav>
  );
};
