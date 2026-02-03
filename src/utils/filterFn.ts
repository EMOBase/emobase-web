export const isNotUndefined = <T>(value: T | undefined): value is T =>
  value !== undefined;

export const isNotNull = <T>(value: T | null): value is T => value !== null;

export const isNotNullable = <T>(value: T | null | undefined): value is T =>
  value != null;

export const isNotFalsy = <T>(
  value: T | null | undefined | false,
): value is T => !!value;
