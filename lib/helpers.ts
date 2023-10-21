import { ChangeEvent } from "react";

export type RequestMethods = "GET" | "PATCH" | "DELETE" | "POST";

export function updateIfValueExists(
  obj: Record<string, any>,
  key: string,
  value: any
) {
  return value ? { ...obj, [key]: value } : obj;
}

//TODO: get to process multiple images?
export function getImageData(event: ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl };
}
