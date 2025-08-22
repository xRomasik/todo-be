import { debounce } from "../../../lib/helpers/debounce";
import {
  tasksApi,
  useCompleteTaskMutation,
  useIncompleteTaskMutation,
} from "../../../store/tasksSlice";
import { useAppDispatch } from "../../../store/redux";
import { useCallback, useRef } from "react";

export const useToggleTask = (initialCompleted: boolean) => {
  const serverCompleted = useRef<boolean>(initialCompleted);

  const [completeTaskMutation] = useCompleteTaskMutation();
  const [incompleteTaskMutation] = useIncompleteTaskMutation();
  const dispatch = useAppDispatch();

  const debouncedToggleMutation = useCallback(
    debounce((taskId: string, completeTask: boolean) => {
      if (serverCompleted.current === completeTask) {
        return;
      }

      if (completeTask) {
        completeTaskMutation(taskId);
        serverCompleted.current = true;
      } else {
        incompleteTaskMutation(taskId);
        serverCompleted.current = false;
      }
    }, 500),
    [completeTaskMutation, incompleteTaskMutation]
  );

  const toggleTaskOptimistic = useCallback(
    (taskId: string, completeTask: boolean) => {
      dispatch(
        tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
          if (!draft) {
            return;
          }
          const task = draft.find((task) => task.id === taskId);
          if (!task) {
            return;
          }

          if (completeTask) {
            task.completed = true;
            task.completedDate = Date.now();
          } else {
            task.completed = false;
            task.completedDate = undefined;
          }
        })
      );

      debouncedToggleMutation(taskId, completeTask);
    },
    [debouncedToggleMutation]
  );

  return toggleTaskOptimistic;
};
