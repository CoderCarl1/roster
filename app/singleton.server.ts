export const singleton = <Value, Arg>(
  name: string,
  valueFactory: (optionalArg?: Arg) => Value,
  optionalArg?: Arg,
): Value => {
  const g = global as unknown as { __singletons: Record<string, unknown> };
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory(optionalArg);
  return g.__singletons[name] as Value;
};
