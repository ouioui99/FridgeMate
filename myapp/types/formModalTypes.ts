//FormModal
export type FormModalProps<T extends Record<string, any>> = {
  visible: boolean;
  onClose: () => void;
  fields: Field[];
  onSubmit: (data: T) => Promise<void | boolean>;
  handleDelete: () => Promise<void>;
  initialData: {};
  validation?: (data: Partial<T>) => ValidationErrors<T> | null;
};

export type Field = {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "number" | "date" | "image"; // 追加可能
};

type ValidationErrors<T> = Partial<Record<keyof T, string>>;
