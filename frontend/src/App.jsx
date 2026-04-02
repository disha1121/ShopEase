import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" />
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />
    return children
}

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                        <ProtectedRoute allowedRoles={['customer']}>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/seller" element={
                        <ProtectedRoute allowedRoles={['seller']}>
                            <SellerDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App