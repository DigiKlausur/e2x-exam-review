export function asDate(val: Date | string | null | undefined): Date | null | undefined {
  if(val === null) return null;
  else if(!val) return undefined;
  return new Date(val);
}
