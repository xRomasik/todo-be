import { TaskPage } from "./pages/TasksPage";
import { ToastContainer } from "./lib/components/ToastContainer";
import "./styles/index.css";

export const App = () => {
  return (
    <div className="container">
      <TaskPage />
      <ToastContainer />
    </div>
  );
};
