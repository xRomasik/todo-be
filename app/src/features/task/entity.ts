export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdDate: number;
  completedDate?: number | undefined;
};

export type CreateTaskRequest = {
  text: string;
};

export type UpdateTaskRequest = {
  text: string;
};
