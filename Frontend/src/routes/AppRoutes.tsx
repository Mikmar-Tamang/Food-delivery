import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import('../pages/HomePage'))
const LoginPage= lazy(() => import('../HomePageComponent/auth/LoginPage'))
const UserForm= lazy(() => import('../HomePageComponent/auth/UserForm'))
const PartnerForm= lazy(() => import('../HomePageComponent/auth/PartnerForm'))
const VerifyNotice= lazy(() => import('../pages/auth/VerifyNotice'))
const PartnerNotice= lazy(() => import('../pages/auth/PartnerNotice'))
const VerifyEmail= lazy(() => import('../pages/auth/VerifyEmail'))
const ProtectedRoute= lazy(() => import('./ProtectedRoute'))
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const FoodPartnerLogin = lazy(() => import('../HomePageComponent/auth/PartnerLogin'));
const PartnerDashboard = lazy(() => import('../pages/admin/PartnerDashboard'));
const PartnerProtectedRoute = lazy(() => import('./PartnerProtectedRoute'));

function AppRoutes() {
  return (
     <div>
     <BrowserRouter>

<Suspense fallback={<p>Loading.....</p>}>
  <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/user-register" element={<UserForm/>}/>
      <Route path="/partner-register" element={<PartnerForm/>}/>
      <Route path="/verify-notice" element={<VerifyNotice />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/partner-notice" element={<PartnerNotice />} />
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/food-partner-login" element={<FoodPartnerLogin />} />
      <Route path="/partner-dashboard" element={<PartnerProtectedRoute />}>
        <Route index element={<PartnerDashboard />} />
      </Route>
 </Routes>
</Suspense>

</BrowserRouter>
    </div>
  )
}

export default AppRoutes
