import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout, AuthLayout, ProtectedRoute } from '@/components/layout';
import { Spinner } from '@/components/ui';
import { UserRole } from '@/types';

// Lazy-loaded pages
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardHome = lazy(() => import('@/pages/DashboardHome'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const PropertiesPage = lazy(() => import('@/pages/PropertiesPage'));
const CreatePropertyPage = lazy(() => import('@/pages/CreatePropertyPage'));
const InquiriesPage = lazy(() => import('@/pages/InquiriesPage'));
const BuySellPage = lazy(() => import('@/pages/BuySellPage'));
const RentalsPage = lazy(() => import('@/pages/RentalsPage'));
const LegalPage = lazy(() => import('@/pages/LegalPage'));
const JointVenturesPage = lazy(() => import('@/pages/JointVenturesPage'));
const PackersPage = lazy(() => import('@/pages/PackersPage'));
const PropManagementPage = lazy(() => import('@/pages/PropManagementPage'));
const MarketingPage = lazy(() => import('@/pages/MarketingPage'));
const SchedulingPage = lazy(() => import('@/pages/SchedulingPage'));
const PaymentsPage = lazy(() => import('@/pages/PaymentsPage'));
const DocumentsPage = lazy(() => import('@/pages/DocumentsPage'));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

const ALL_ROLES = Object.values(UserRole);

const Loading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Dashboard routes (all protected) */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />

          <Route path="properties" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUILDER, UserRole.PROPERTY_MANAGER]}>
              <PropertiesPage />
            </ProtectedRoute>
          } />
          <Route path="properties/create" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUILDER, UserRole.PROPERTY_MANAGER]}>
              <CreatePropertyPage />
            </ProtectedRoute>
          } />

          <Route path="inquiries" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUYER, UserRole.TENANT, UserRole.BUILDER]}>
              <InquiriesPage />
            </ProtectedRoute>
          } />

          <Route path="buy-sell" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUYER, UserRole.BUILDER]}>
              <BuySellPage />
            </ProtectedRoute>
          } />

          <Route path="rentals" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.TENANT, UserRole.PROPERTY_MANAGER]}>
              <RentalsPage />
            </ProtectedRoute>
          } />

          <Route path="legal" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUYER, UserRole.TENANT, UserRole.LEGAL_ADVISOR, UserRole.BUILDER]}>
              <LegalPage />
            </ProtectedRoute>
          } />

          <Route path="joint-ventures" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUILDER]}>
              <JointVenturesPage />
            </ProtectedRoute>
          } />

          <Route path="packers" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.BUYER, UserRole.TENANT, UserRole.PACKERS_MOVERS]}>
              <PackersPage />
            </ProtectedRoute>
          } />

          <Route path="prop-management" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.PROPERTY_MANAGER]}>
              <PropManagementPage />
            </ProtectedRoute>
          } />

          <Route path="marketing" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.BUILDER, UserRole.MARKETING_PARTNER]}>
              <MarketingPage />
            </ProtectedRoute>
          } />

          <Route path="scheduling" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUYER, UserRole.TENANT, UserRole.LEGAL_ADVISOR, UserRole.BUILDER]}>
              <SchedulingPage />
            </ProtectedRoute>
          } />

          <Route path="payments" element={<PaymentsPage />} />
          <Route path="documents" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUYER, UserRole.LEGAL_ADVISOR, UserRole.BUILDER, UserRole.PROPERTY_MANAGER]}>
              <DocumentsPage />
            </ProtectedRoute>
          } />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />

          <Route path="admin" element={
            <ProtectedRoute roles={[UserRole.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
