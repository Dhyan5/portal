import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import DriveDetails from './pages/DriveDetails';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/drive/:id" element={<DriveDetails />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
