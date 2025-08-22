import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Task } from "../features/task/entity";
import {
  addToast,
  setBulkCompleteAllLoading,
  setBulkDeleteAllLoading,
} from "./uiSlice";

export const tasksApi = createApi({
  reducerPath: "tasksApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      providesTags: ["Task"],
    }),

    createTask: builder.mutation<Task, string>({
      query: (text) => ({
        url: "/tasks",
        method: "POST",
        body: { text },
      }),
      async onQueryStarted(text, { dispatch, queryFulfilled }) {
        const tempTask: Task = {
          id: `temp-${Date.now()}`,
          text,
          completed: false,
          createdDate: Date.now(),
        };

        dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            if (!draft) {
              return;
            }
            draft.unshift(tempTask);
          })
        );

        try {
          const { data: actualTask } = await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
              if (!draft) {
                return;
              }
              const tempIndex = draft.findIndex(
                (task) => task.id === tempTask.id
              );
              if (tempIndex !== -1) {
                draft[tempIndex] = actualTask;
              }
            })
          );
        } catch {
          dispatch(
            tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
              if (!draft) {
                return;
              }
              const tempIndex = draft.findIndex(
                (task) => task.id === tempTask.id
              );
              if (tempIndex !== -1) {
                draft.splice(tempIndex, 1);
              }
            })
          );
          dispatch(
            addToast({
              message: "Nepodařilo se přidat úkol. Zkuste to prosím znovu.",
              type: "error",
            })
          );
        }
      },
    }),

    updateTask: builder.mutation<Task, { id: string; text: string }>({
      query: ({ id, text }) => ({
        url: `/tasks/${id}`,
        method: "POST",
        body: { text },
      }),
      async onQueryStarted({ id, text }, { dispatch, queryFulfilled }) {
        dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            if (!draft) {
              return;
            }
            const task = draft.find((task) => task.id === id);
            if (task) {
              task.text = text;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          dispatch(tasksApi.util.invalidateTags(["Task"]));
          dispatch(
            addToast({
              message: "Nepodařilo se upravit úkol. Zkuste to prosím znovu.",
              type: "error",
            })
          );
        }
      },
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        let deletedTask: Task | undefined;
        let deletedIndex: number = -1;

        dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            if (!draft) {
              return;
            }
            const index = draft.findIndex((task) => task.id === id);

            if (index === -1) {
              return;
            }

            const taskToDelete = draft.at(index);

            if (taskToDelete) {
              deletedTask = {
                id: taskToDelete.id,
                text: taskToDelete.text,
                completed: taskToDelete.completed,
                createdDate: taskToDelete.createdDate,
                completedDate: taskToDelete.completedDate,
              };
              deletedIndex = index;
              draft.splice(index, 1);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          if (!deletedTask || deletedIndex === -1) {
            return;
          }
          const taskToRestore = deletedTask;

          dispatch(
            tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
              if (!draft) {
                return;
              }
              draft.splice(deletedIndex, 0, taskToRestore);
            })
          );
          dispatch(
            addToast({
              message: "Nepodařilo se smazat úkol. Zkuste to prosím znovu.",
              type: "error",
            })
          );
        }
      },
    }),

    completeTask: builder.mutation<Task, string>({
      query: (id) => ({
        url: `/tasks/${id}/complete`,
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          dispatch(tasksApi.util.invalidateTags(["Task"]));

          dispatch(
            addToast({
              message:
                "Nepodařilo se označit úkol jako dokončený. Zkuste to prosím znovu.",
              type: "error",
            })
          );
        }
      },
    }),

    incompleteTask: builder.mutation<Task, string>({
      query: (id) => ({
        url: `/tasks/${id}/incomplete`,
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          dispatch(tasksApi.util.invalidateTags(["Task"]));

          dispatch(
            addToast({
              message:
                "Nepodařilo se označit úkol jako nedokončený. Zkuste to prosím znovu.",
              type: "error",
            })
          );
        }
      },
    }),

    completeAllTasks: builder.mutation<Task[], string[]>({
      query: (ids) => ({
        url: "/tasks/complete-all",
        method: "POST",
        body: { ids },
      }),
      async onQueryStarted(ids, { dispatch, queryFulfilled }) {
        dispatch(setBulkCompleteAllLoading(true));
        try {
          await queryFulfilled;
          await dispatch(
            tasksApi.endpoints.getTasks.initiate(undefined, {
              forceRefetch: true,
            })
          );
          dispatch(
            addToast({
              message: `Označeno ${ids.length} úkolů jako hotové`,
              type: "success",
            })
          );
        } catch {
          dispatch(
            addToast({
              message:
                "Nepodařilo se označit úkoly jako dokončené. Zkuste to prosím znovu.",
              type: "error",
            })
          );
        } finally {
          dispatch(setBulkCompleteAllLoading(false));
        }
      },
    }),

    deleteAllCompleted: builder.mutation<{ deletedCount: number }, void>({
      query: () => ({
        url: "/tasks/completed",
        method: "DELETE",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setBulkDeleteAllLoading(true));
        try {
          const { data } = await queryFulfilled;
          await dispatch(
            tasksApi.endpoints.getTasks.initiate(undefined, {
              forceRefetch: true,
            })
          );
          dispatch(
            addToast({
              message: `Smazáno ${data.deletedCount} hotových úkolů`,
              type: "success",
            })
          );
        } catch {
          dispatch(
            addToast({
              message:
                "Nepodařilo se smazat hotové úkoly. Zkuste to prosím znovu.",
              type: "error",
            })
          );
        } finally {
          dispatch(setBulkDeleteAllLoading(false));
        }
      },
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCompleteTaskMutation,
  useIncompleteTaskMutation,
  useCompleteAllTasksMutation,
  useDeleteAllCompletedMutation,
} = tasksApi;

export const tasksApiReducer = tasksApi.reducer;
