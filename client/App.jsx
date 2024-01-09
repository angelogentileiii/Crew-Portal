import React from 'react'
import { AuthProvider } from './contextProviders/AuthContext'

import Home from './screens/Home';

function App() {
  console.log('App executed')

  return (
      <AuthProvider>
        <Home />
      </AuthProvider>
    );
}

export default App;