'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Page({ error }: { error: Error }) {
  return (
    <>
      <div className="items-center self-center justify-center flex flex-col gap-4 max-w-lg">
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || 'An error occurred.'}
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => {
            window.location.reload()
          }}
          className=""
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          <span>Reload</span>
        </Button>
      </div>
    </>
  )
}
