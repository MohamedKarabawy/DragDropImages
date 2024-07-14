import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import DragDropPDF from './DragDropPDF.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App id="1" />
    <DragDropPDF id="2" />
  </React.StrictMode>,
)
