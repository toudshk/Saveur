export type BookingStatus = 'idle' | 'loading' | 'success'

export type TimeSlot =
  | '12:00'
  | '13:00'
  | '14:00'
  | '15:00'
  | '16:00'
  | '17:00'
  | '18:00'
  | '19:00'
  | '20:00'
  | '21:00'
  | '22:00'

export interface BookingFormData {
  name: string
  phone: string
  date: string
  time: TimeSlot | ''
  guests: number
}

export type BookingField = keyof BookingFormData

export type BookingErrors = Partial<Record<BookingField, string>>

export type SuccessfulBooking = Omit<BookingFormData, 'time'> & {
  time: TimeSlot
}
