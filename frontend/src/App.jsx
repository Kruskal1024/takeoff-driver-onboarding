import { Route, Routes } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import PersonalInformationPage from "./pages/PersonalInformationPage";
import IdentityDocumentPage from "./pages/IdentityDocumentPage";
import VehicleInformationPage from "./pages/VehicleInformationPage";
import DocumentsPage from "./pages/DocumentsPage";
import ReviewPage from "./pages/ReviewPage";
import CompletionPage from "./pages/CompletionPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUpPage />} />

      <Route
        path="/verify-otp"
        element={<OtpVerificationPage />}
      />

      <Route
        path="/personal-information"
        element={<PersonalInformationPage />}
      />

      <Route
        path="/identity-document"
        element={<IdentityDocumentPage />}
      />

      <Route
        path="/vehicle-information"
        element={<VehicleInformationPage />}
      />

      <Route
        path="/documents"
        element={<DocumentsPage />}
      />

      <Route
        path="/review"
        element={<ReviewPage />}
      />

      <Route
        path="/submit"
        element={<CompletionPage />}
      />
    </Routes>
  );
}