import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { VoiceFlowProvider } from './voice-agent/VoiceFlowAgent.jsx'
import Services from './pages/Services.jsx'
import Home from './pages/kiosk/Home.jsx'
import Language from './pages/kiosk/Language.jsx'
import ActionSelection from './pages/kiosk/ActionSelection.jsx'
import BillPaymentEntry from './pages/kiosk/BillPaymentEntry.jsx'
import OTPVerification from './pages/kiosk/OTPVerification.jsx'
import BillDetails from './pages/kiosk/BillDetails.jsx'
import PaymentMethod from './pages/kiosk/PaymentMethod.jsx'
import PaymentProcessing from './pages/kiosk/PaymentProcessing.jsx'
import PaymentSuccess from './pages/kiosk/PaymentSuccess.jsx'
import StatusTrackingEntry from './pages/kiosk/StatusTrackingEntry.jsx'
import StatusResult from './pages/kiosk/StatusResult.jsx'
import ComplaintForm from './pages/kiosk/ComplaintForm.jsx'
import ComplaintOTP from './pages/kiosk/ComplaintOTP.jsx'
import ComplaintSuccess from './pages/kiosk/ComplaintSuccess.jsx'
import NewConnectionStart from './pages/kiosk/NewConnectionStart.jsx'
import NewConnectionVerify from './pages/kiosk/NewConnectionVerify.jsx'
import NewConnectionConfigure from './pages/kiosk/NewConnectionConfigure.jsx'
import NewConnectionReview from './pages/kiosk/NewConnectionReview.jsx'
import NewConnectionSuccess from './pages/kiosk/NewConnectionSuccess.jsx'

import Dashboard from './pages/admin/Dashboard.jsx'
import TechLayout from './components/technician/TechLayout.jsx'


function App() {
  return (
    <BrowserRouter>
      <VoiceFlowProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/language" element={<Language />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:service" element={<ActionSelection />} />

          <Route path="/:service/bill" element={<BillPaymentEntry />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/bill-details" element={<BillDetails />} />
          <Route path="/payment-method" element={<PaymentMethod />} />
          <Route path="/payment-processing" element={<PaymentProcessing />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          <Route path="/status" element={<StatusTrackingEntry />} />
          <Route path="/status-result" element={<StatusResult />} />

          <Route path="/:service/complaint" element={<ComplaintForm />} />
          <Route path="/complaint-otp" element={<ComplaintOTP />} />
          <Route path="/complaint-success" element={<ComplaintSuccess />} />

          <Route path="/:service/new-connection" element={<NewConnectionStart />} />
          <Route path="/:service/new-connection/verify" element={<NewConnectionVerify />} />
          <Route path="/:service/new-connection/configure" element={<NewConnectionConfigure />} />
          <Route path="/:service/new-connection/review" element={<NewConnectionReview />} />
          <Route path="/:service/new-connection/success" element={<NewConnectionSuccess />} />


          <Route path="/admin" element={<Dashboard />} />
          <Route path="/technician" element={<TechLayout />} />
        </Routes>
      </VoiceFlowProvider>
    </BrowserRouter>
  )
}

export default App

