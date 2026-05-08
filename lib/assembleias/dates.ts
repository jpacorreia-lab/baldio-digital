export const ANTECEDENCIA_EDITAL_DIAS = 15;

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function editalDeadline(data: string) {
  return toDateInputValue(addDays(new Date(`${data}T12:00:00`), -ANTECEDENCIA_EDITAL_DIAS));
}

export function daysUntil(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${date}T00:00:00`);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

export function formatDatePt(value: string) {
  return new Intl.DateTimeFormat("pt-PT").format(new Date(`${value}T12:00:00`));
}
