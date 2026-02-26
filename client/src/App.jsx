import './App.css';
import Dashboard from './Components/Dashboard/Dashboard';

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  }
])

function App() {
  return (
      <div>
        <RouterProvider router={router} />
      </div>
  )
}

export default App;