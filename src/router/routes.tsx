import {createBrowserRouter, createRoutesFromElements, Route} from 'react-router-dom';
import PrivateRouteWrapper from './components/PrivateRouteWrapper';
import PublicRouteWrapper from './components/PublicRouteWrapper';
import {ParticipantRegistration, Registration, TrainerRegistration} from '../pages/auth';
import { NotFound } from '../pages';
import {APP_ROUTES} from '../constant/APP_ROUTES';
import ErrorBoundary from "../ErrorBoundry.tsx";
import Step2ParticipantAccount from '../pages/auth/registration/Step2ParticipantAccount.tsx';
import Step2ServiceAgreement from '../pages/auth/registration/Step2ServiceAgreement.tsx';
import SignIn from '../pages/auth/SignIn.tsx';


export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<PrivateRouteWrapper />} errorElement={<ErrorBoundary />}>
                <Route path='' element={<SignIn />} errorElement={<ErrorBoundary />} />

            </Route>
            <Route element={<PublicRouteWrapper />} errorElement={<ErrorBoundary />}>
                <Route path={APP_ROUTES.AUTH.SIGN_IN} element={<SignIn />} errorElement={<ErrorBoundary />} />
                <Route path={APP_ROUTES.AUTH.REGISTER} element={<Registration />} errorElement={<ErrorBoundary />} />
                <Route path={APP_ROUTES.AUTH.REGISTER_PARTICIPANT} element={<ParticipantRegistration />} errorElement={<ErrorBoundary />} />
                <Route path={'/auth/register/participant'} element={<Step2ParticipantAccount />} errorElement={<ErrorBoundary />} />
                <Route path={'/auth/register/participant/agreement'} element={<Step2ServiceAgreement />} errorElement={<ErrorBoundary />} />
                <Route path={APP_ROUTES.AUTH.REGISTER_TRAINER} element={<TrainerRegistration />} errorElement={<ErrorBoundary />} />
            </Route>
            <Route path={APP_ROUTES.NOT_FOUND} element={<NotFound />} errorElement={<ErrorBoundary />} />
        </>
    )
);
