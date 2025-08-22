import AddTask from "../features/task/components/AddTask";
import { TaskFilter } from "../features/task/components/TaskFilter";
import { TasksList } from "../features/task/components/TasksList";
import { BulkActions } from "../features/task/components/BulkActions";

export const TaskPage = () => {
  return (
    <>
      <header className="header">
        <h1 className="header__title">📝 Todo App</h1>
        <p className="header__subtitle">
          Spravujte své úkoly efektivně a jednoduše
        </p>
      </header>
      <main className="card">
        <AddTask />
        <TaskFilter />
        <BulkActions />
        <TasksList />
      </main>
    </>
  );
};
