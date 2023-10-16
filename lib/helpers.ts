
export type RequestMethods = 'GET' | 'PATCH' | 'DELETE' | 'POST';

export function updateIfValueExists(obj: Record<string, any>, key: string, value: any) {
  return value ? { ...obj, [key]: value } : obj;
}