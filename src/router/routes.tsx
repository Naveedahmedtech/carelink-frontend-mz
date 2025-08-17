import {createBrowserRouter, createRoutesFromElements, Route} from 'react-router-dom';
import PrivateRouteWrapper from './components/PrivateRouteWrapper';
import PublicRouteWrapper from './components/PublicRouteWrapper';
import {ForgotPassword, SignIn, ParticipantRegistration, TrainerRegistration} from '../pages/auth';
import { NotFound } from '../pages';
import {APP_ROUTES} from '../constant/APP_ROUTES';
import ErrorBoundary from "../ErrorBoundry.tsx";
import CompareFiles from '../mock/PDFAnnotator.tsx';


export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<PrivateRouteWrapper />} errorElement={<ErrorBoundary />}>
            </Route>
            <Route element={<PublicRouteWrapper />} errorElement={<ErrorBoundary />}>
                <Route path={APP_ROUTES.AUTH.SIGN_IN} element={<SignIn />} errorElement={<ErrorBoundary />} />
                <Route path={APP_ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} errorElement={<ErrorBoundary />} />
                <Route path={APP_ROUTES.AUTH.REGISTER_PARTICIPANT} element={<ParticipantRegistration />} errorElement={<ErrorBoundary />} />
                <Route path={APP_ROUTES.AUTH.REGISTER_TRAINER} element={<TrainerRegistration />} errorElement={<ErrorBoundary />} />
                <Route path={'compare-viewer'} element={<CompareFiles />} errorElement={<ErrorBoundary />} />
            </Route>
            <Route path={APP_ROUTES.NOT_FOUND} element={<NotFound />} errorElement={<ErrorBoundary />} />
        </>
    )
);
