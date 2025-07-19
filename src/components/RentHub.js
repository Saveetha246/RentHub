import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage  from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import Layout from "../Layout/Layout";
import LandlordLayout from "../Layout/LandlordLayout.js"
import TenantLayout from "../Layout/TenantLayout.js";
import LandLordRoute, { TenantRoute } from "./ProtectedRoute";
import PropertyDetails from "./PropertyDetails.js";
import ApplyForm from "./ApplyForm.js";
import TenantApplications from "./TenantApplications.js";
import MyRentals from "./MyRentals.js";
import RaiseMaintenanceRequest from "./RaiseMaintenanceRequest.js";
import LeaseAgreementPage from "../pages/LeaseAgreementPage.js";
import LeaseDetailsTenant from "./LeaseDetailsTenant.js";
import PaymentHistory from "./PaymentHistory.js";
import MaintenanceHistory from "./MaintenanceHistory.js";
import Profile from "./Profile.js";
import InitiatePayment from  "../components/InitiatePayment.js"
import MyProperty from "./MyProperty.js";
import PropertyForm from "./PropertyForm.js";
import PropertyDetailsLandlord from "./PropertyDetailsLandLord.js";
import EditProperty from "./EditProperty.js";
import PaymentHistoryLandLord from "./PaymentHistoryLandLord.js";
import LandlordMaintenanceRequests from "./LandLordMaintenanceRequests.js";

import Application from "./ApplicationLandLord.js";
import PropertyList from "./PropertyList.js";

export default function RentHub(){
    return(
       
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route element={<TenantRoute />}>
              <Route  element={<TenantLayout />} >
                  <Route path="/tenanthome" element={<PropertyList />}/>
                  <Route path="/property/:propertyId" element={<PropertyDetails />} />
                  <Route path="/tenant/profile" element={< Profile/>}/>
                  <Route path="/apply/:propertyId" element={<ApplyForm />} />
                  <Route path="/Tenant/applications" element={<TenantApplications/>}/>
                  <Route path="/Tenant/my-rentals" element={<MyRentals/>}/>
                  <Route path="/Tenant/lease-agreement/:transactionId" element={<LeaseAgreementPage />} />
                  <Route path="/Tenant/lease-details" element={<LeaseDetailsTenant/>}/>
                  <Route path="/Tenant/payment-history" element={<PaymentHistory/>}/>
                  <Route path="/payment" element={<InitiatePayment/>}/>  
                  <Route path="/tenant/maintenance-history" element={<MaintenanceHistory/>}/>
                  <Route path="/tenant/raise-request" element={<RaiseMaintenanceRequest/>}/>        
              </Route>
             
            </Route>

          <Route element={<LandLordRoute />}>
            <Route element={<LandlordLayout />}>
            
                <Route path="/landlord/properties" element={<MyProperty />} />
                <Route path="/landlord/applications" element={<Application />} /> 
                <Route path="/landlord/payment-history" element={<PaymentHistoryLandLord />} />
                <Route path="/landlord/add-property" element={<PropertyForm />} />
                <Route path="/landlord/profile" element={<Profile />} />  
                <Route path="/landlord/maintenance" element={<LandlordMaintenanceRequests />} />
                <Route path="/landlord/property-details/:id" element={<PropertyDetailsLandlord />}>
                <Route path="edit" element={<EditProperty />} />
              </Route>
          </Route>
          </Route>
      

            

        </Routes>
        </BrowserRouter>
       
    );
};