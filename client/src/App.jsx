import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useUserStore } from './store/userStore'
import BottomNav from './components/ui/BottomNav'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Shop from './pages/Shop'
import MyCashback from './pages/MyCashback'
import Wallet from './pages/Wallet'
import Referral from './pages/Referral'
import Profile from './pages/Profile'

function PrivateRoute({ children }) {
  const user = useUserStore((s) => s.user)
  return user ? children : <Navigate to="/onboarding" replace />
}

function AppLayout({ children }) {
  return (
    <div className="max-w-md mx-auto relative min-h-screen">
      {children}
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <PrivateRoute>
              <AppLayout>
                <Shop />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cashback"
          element={
            <PrivateRoute>
              <AppLayout>
                <MyCashback />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <PrivateRoute>
              <AppLayout>
                <Wallet />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/referral"
          element={
            <PrivateRoute>
              <AppLayout>
                <Referral />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
