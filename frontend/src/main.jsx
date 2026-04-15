import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Resume from './Resume'
import Admin from './Admin'
import Login from './Login'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Resume />} />
        
        <Route 
          path="/login" 
          element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} 
        />
        
        <Route 
          path="/admin" 
          element={<ProtectedRoute><Admin /></ProtectedRoute>} 
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)