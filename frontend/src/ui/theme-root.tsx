// Add provider to the root of your app
https://www.npmjs.com/package/@rbnd/react-dark-mode 
'use client'

import { DarkModeProvider } from "@rbnd/react-dark-mode"

const App = () => {

  // ...

  return (
    <DarkModeProvider>
      {/* Your other components */}
    </DarkModeProvider>
  )
}