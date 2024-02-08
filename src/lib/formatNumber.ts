export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    // maximumFractionDigits: 0,
  }).format(number)
}
