'use client'

export const LocalDateTime = ({ datetime }: { datetime: string }) => {
  const date = new Date(datetime)
  return <span suppressHydrationWarning>{date.toLocaleString('de')}</span>
}

export const LocalTime = ({ datetime }: { datetime: string }) => {
  const date = new Date(datetime)
  return <span suppressHydrationWarning>{date.toLocaleTimeString('de')}</span>
}
