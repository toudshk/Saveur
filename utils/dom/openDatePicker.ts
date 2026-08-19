export function openDatePicker(event: Event): void {
  const target = event.currentTarget

  if (!(target instanceof HTMLInputElement) || target.type !== 'date') {
    return
  }

  if (typeof target.showPicker !== 'function') {
    return
  }

  try {
    target.showPicker()
  } catch {
    // Ignore when the picker is already open.
  }
}
