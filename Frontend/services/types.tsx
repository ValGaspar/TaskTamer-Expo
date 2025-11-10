export type Task = {
  _id: string;
  title?: string;
  description?: string;
  date?: Date;
  priority?: string;
  done?: boolean;
  type?: 'tarefa';
  userId?: string;
};

export type TaskPayload = {
	title?: string;
	description?: string;
	date?: Date;
	priority?: string;
	done?: boolean;
}