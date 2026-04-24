import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import('../pages/HomePage'))
const LoginPage= lazy(() => import('../HomePageComponent/auth/LoginPage'))
const Register= lazy(() => import('../HomePageComponent/auth/Register'))
const VerifyNotice= lazy(() => import('../pages/auth/VerifyNotice'))
const VerifyEmail= lazy(() => import('../pages/auth/VerifyEmail'))
const AdminRoute= lazy(() => import('../routes/AdminRoute'))
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))

function AppRoutes() {
  return (
     <div>
     <BrowserRouter>

<Suspense fallback={<p>Loading.....</p>}>
  <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/verify-notice" element={<VerifyNotice />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Dashboard />} />
      </Route>
 </Routes>
</Suspense>

</BrowserRouter>
    </div>
  )
}

export default AppRoutes
