import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import PrivateRouteWrapper from './components/PrivateRouteWrapper';
import PublicRouteWrapper from './components/PublicRouteWrapper';
import { ParticipantRegistration, Registration, TrainerRegistration } from '../pages/auth';
import { NotFound } from '../pages';
import { APP_ROUTES } from '../constant/APP_ROUTES';
import ErrorBoundary from "../ErrorBoundry.tsx";
import Step2ParticipantAccount from '../pages/auth/registration/Step2ParticipantAccount.tsx';
import Step2ServiceAgreement from '../pages/auth/registration/Step2ServiceAgreement.tsx';
import SignIn from '../pages/auth/SignIn.tsx';
import Step3CreateLogin from '../pages/auth/registration/Step3CreateLogin.tsx';
import RoleBasedDashboard from '../layouts/RoleBasedDashboard.tsx';
import UpcomingShifts from '../pages/dashboard/participant/upcoming/index.tsx';
import RequestShiftPage from '../components/shifts/RequestShiftPage.tsx';
import PreviousShiftsPage from '../components/shifts/PreviousShiftsPage.tsx';
import OwnerInterviewBookingPage from '../pages/auth/registration/components/BookInterview.tsx';
import ThankYouPage from '../pages/ThankYouPage.tsx';
import TrainerOnboardingWizard from '../pages/auth/registration/trainers/onboarding/TrainerOnboardingWizard.tsx';
import ParticipantNotesPage from '../pages/dashboard/participant/support-notes/index.tsx';
import TrainerDashboardPage from '../pages/dashboard/trainer/dashboard/index.tsx';
import TrainerSchedulePage from '../pages/dashboard/trainer/my-schedule/index.tsx';
import TrainerBookingPage from '../pages/dashboard/trainer/booking/index.tsx';
import TrainerTimesheetPage from '../pages/dashboard/trainer/time-sheet/index.tsx';
import TrainerReportsPage from '../pages/dashboard/trainer/shift-reports/index.tsx';
import TrainerProfile from '../pages/dashboard/trainer/profile/index.tsx';
import ParticipantProfile from '../pages/dashboard/participant/profile/index.tsx';
import TrainerListPage from '../pages/dashboard/admin/trainer/index.tsx';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
     <Route index element={<Navigate to={'/dashboard'} replace />} />
      {/* 🔓 Public routes (no auth required, redirected if already logged in) */}
      <Route element={<PublicRouteWrapper />} errorElement={<ErrorBoundary />}>
        <Route path={APP_ROUTES.AUTH.SIGN_IN} element={<SignIn />} />
        <Route path={APP_ROUTES.AUTH.REGISTER} element={<Registration />} />
        <Route path={APP_ROUTES.AUTH.REGISTER_PARTICIPANT} element={<ParticipantRegistration />} />
        <Route path={'/auth/register/participant'} element={<Step2ParticipantAccount />} />
        <Route path={'/auth/register/participant/agreement'} element={<Step2ServiceAgreement />} />
        <Route path={'/auth/register/participant/create-login'} element={<Step3CreateLogin />} />
        <Route path={APP_ROUTES.AUTH.REGISTER_TRAINER} element={<TrainerRegistration />} />
          <Route path="/auth/participant/book-interview" element={<OwnerInterviewBookingPage />} />


          <Route path="/auth/register/trainer" element={<TrainerOnboardingWizard />} />
          
          
          <Route path="/thank-you" element={<ThankYouPage />} />


      </Route>

      {/* 🔒 Private routes (must be logged in) */}
      <Route element={<PrivateRouteWrapper />} errorElement={<ErrorBoundary />}>
        <Route path="/dashboard" element={<RoleBasedDashboard />}>
          {/* participant pages */}
          <Route path="upcoming" element={<UpcomingShifts />} />
          <Route path="request" element={<RequestShiftPage />} />
          <Route path="previous" element={<PreviousShiftsPage />} />
          <Route path="notes" element={<ParticipantNotesPage />} />
          <Route path="profile/participant" element={<ParticipantProfile />} />

          {/* admin pages */}
          <Route path="admin" element={<div>ADMIN</div>} />
          <Route path="participants" element={<div>Participants</div>} />
          <Route path="trainers" element={<TrainerListPage />} />
          <Route path="calendar" element={<div>Calendar</div>} />

          {/* trainer pages */}
          <Route path="trainer" element={<TrainerDashboardPage />} />
          <Route path="schedule" element={<TrainerSchedulePage />} />
          <Route path="previous-shifts" element={<TrainerBookingPage />} />
          <Route path="reports" element={<TrainerReportsPage />} />
          <Route path="time-sheets" element={<TrainerTimesheetPage />} />
          <Route path="profile/trainer" element={<TrainerProfile />} />



        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path={APP_ROUTES.NOT_FOUND} element={<NotFound />} />
    </>
  )
);
