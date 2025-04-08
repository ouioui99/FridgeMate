//FormModal
export type FormModalProps<T extends Record<string, any>> = {
  visible: boolean;
  onClose: () => void;
  fields: Field[];
  onSubmit: (data: T) => Promise<void>;
  handleDelete: () => Promise<void>;
  initialData: {};
};

export type Field = {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "number" | "date" | "image"; // 追加可能
};
