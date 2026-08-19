export function preventLetterInput(event: Event): void {
  if (!(event instanceof InputEvent) || event.inputType !== 'insertText' || !event.data) {
    return
  }

  if (/\p{L}/u.test(event.data)) {
    event.preventDefault()
  }
}
