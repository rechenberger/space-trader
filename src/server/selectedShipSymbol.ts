import { cookies } from 'next/headers'

export const getSelectedShipSymbol = async () => {
  const token = cookies().get('selectedShipSymbol')
  return typeof token?.value === 'string' ? token.value : undefined
}

export const getSelectedShipSymbolOrThrow = async () => {
  const selectedShipSymbol = await getSelectedShipSymbol()
  if (!selectedShipSymbol) {
    throw new Error('No selected ship')
  }
  return selectedShipSymbol
}

export const setSelectedShipSymbol = async ({
  selectedShipSymbol,
}: {
  selectedShipSymbol: string
}) => {
  cookies().set('selectedShipSymbol', selectedShipSymbol)
}
