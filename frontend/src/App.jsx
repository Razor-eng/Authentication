import { Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import FloatingShape from "./components/FloatingShape"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import EmailVerification from "./pages/EmailVerification"
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={'/login'} replace />
  }
  if (!user.isVerified) {
    return <Navigate to={'/verify-email'} replace />
  }

  return children;
}

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to={'/'} replace />
  }

  return children;
}

const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  if (isCheckingAuth) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-sky-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <Toaster />
      <FloatingShape color="bg-blue-400" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-400" size="w-32 h-32" top="40%" left="-10%" delay={2} />
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={
          <RedirectAuthenticatedUser>
            <Signup />
          </RedirectAuthenticatedUser>
        } />
        <Route path="/login" element={
          <RedirectAuthenticatedUser>
            <Login />
          </RedirectAuthenticatedUser>
        } />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={
          <RedirectAuthenticatedUser>
            <ForgotPassword />
          </RedirectAuthenticatedUser>
        } />
        <Route path="/reset-password/:token" element={
          <RedirectAuthenticatedUser>
            <ResetPassword />
          </RedirectAuthenticatedUser>
        } />
        <Route path="*" element={
          <Navigate to={'/'} replace />
        } />
      </Routes>
    </div>
  )
}

export default App
