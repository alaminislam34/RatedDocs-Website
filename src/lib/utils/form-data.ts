export function objectToFormData<T extends object>(obj: T): FormData {
  const formData = new FormData();

  function append(key: string, value: unknown) {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        append(`${key}[${index}]`, item);
      });
    } else if (typeof value === "object" && value !== null) {
      Object.entries(value as Record<string, unknown>).forEach(([subKey, subValue]) => {
        append(`${key}[${subKey}]`, subValue);
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }

  Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
    append(key, value);
  });

  return formData;
}
