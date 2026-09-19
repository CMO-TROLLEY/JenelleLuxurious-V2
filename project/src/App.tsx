import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { BookingProvider } from '@/context/booking-context';
import { AuthProvider } from '@/context/auth-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { StepIndicator } from '@/components/step-indicator';
import { LazyMotion, domAnimation } from 'framer-motion';

import { BookLandingPage } from '@/pages/book-landing';
import { ServicesPage } from '@/pages/services';
import { CategoryPage } from '@/pages/category';
import { AppointmentPage } from '@/pages/appointment';
import { DetailsPage } from '@/pages/details';
import { ConfirmationPage } from '@/pages/confirmation';
import { ManageBookingPage } from '@/pages/manage-booking';

import { AdminLoginPage } from '@/pages/admin/login';
import { ProtectedRoute } from '@/pages/admin/protected-route';
import { AdminDashboard } from '@/pages/admin/dashboard';
import { AdminServices } from '@/pages/admin/services';
import { AdminBookings } from '@/pages/admin/bookings';
import { AdminStaff } from '@/pages/admin/staff';

import { PrivacyPolicyPage } from '@/pages/legal/privacy-policy';
import { CookiePolicyPage } from '@/pages/legal/cookie-policy';
import { TermsConditionsPage } from '@/pages/legal/terms-conditions';
import { BookingCancellationPolicyPage } from '@/pages/legal/booking-cancellation-policy';

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <StepIndicator />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <Routes>
      {/* Admin routes - no customer layout */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
      <Route path="/admin/staff" element={<ProtectedRoute><AdminStaff /></ProtectedRoute>} />

      {/* Customer routes - with navbar/footer */}
      <Route path="/book" element={<CustomerLayout><BookLandingPage /></CustomerLayout>} />
      <Route path="/book/services" element={<CustomerLayout><ServicesPage /></CustomerLayout>} />
      <Route path="/book/:categorySlug" element={<CustomerLayout><CategoryPage /></CustomerLayout>} />
      <Route path="/book/appointment" element={<CustomerLayout><AppointmentPage /></CustomerLayout>} />
      <Route path="/book/details" element={<CustomerLayout><DetailsPage /></CustomerLayout>} />
      <Route path="/book/confirmation" element={<CustomerLayout><ConfirmationPage /></CustomerLayout>} />
      <Route path="/book/manage" element={<CustomerLayout><ManageBookingPage /></CustomerLayout>} />

      {/* Legal routes */}
      <Route path="/legal/privacy-policy" element={<CustomerLayout><PrivacyPolicyPage /></CustomerLayout>} />
      <Route path="/legal/cookie-policy" element={<CustomerLayout><CookiePolicyPage /></CustomerLayout>} />
      <Route path="/legal/terms-conditions" element={<CustomerLayout><TermsConditionsPage /></CustomerLayout>} />
      <Route path="/legal/booking-cancellation-policy" element={<CustomerLayout><BookingCancellationPolicyPage /></CustomerLayout>} />

      <Route path="/" element={<CustomerLayout><BookLandingPage /></CustomerLayout>} />
      <Route path="*" element={<CustomerLayout><BookLandingPage /></CustomerLayout>} />
    </Routes>
  );
}

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <AuthProvider>
        <BrowserRouter>
          <BookingProvider>
            <AppRoutes />
          </BookingProvider>
        </BrowserRouter>
      </AuthProvider>
    </LazyMotion>
  );
}

export default App;
