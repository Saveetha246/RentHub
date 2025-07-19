import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/LeaseAgreementPage.scss';
import api from '../utils/api';
 
const LeaseAgreementPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
 
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agreeToSign, setAgreeToSign] = useState(false);
  const [showPostSignOptions, setShowPostSignOptions] = useState(false);
  const [signedPdfBlob, setSignedPdfBlob] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(null);
 
  const jwtToken = localStorage.getItem('jwt');
 
  useEffect(() => {
    let currentPdfUrl = null;
 
    const fetchLeasePreview = async () => {
      if (!transactionId) {
        setError('Transaction ID not found in URL.');
        setLoading(false);
        return;
      }
      if (!jwtToken) {
        navigate('/login');
        return;
      }
 
      try {
        const response = await api.get(`/v1/generate/${transactionId}`, {
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
 
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        currentPdfUrl = url;
      } catch (err) {
        console.error('Error fetching lease agreement preview:', err);
        setError(`Failed to load lease agreement preview: ${err.response?.data?.message || err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
 
    fetchLeasePreview();
 
    return () => {
      if (currentPdfUrl) {
        URL.revokeObjectURL(currentPdfUrl);
      }
    };
  }, [transactionId, jwtToken, navigate]);
 
  const handleCheckboxChange = (event) => {
    setAgreeToSign(event.target.checked);
  };
 
  const handleSignLease = async () => {
    if (!agreeToSign) {
      setError('You must agree to sign the lease agreement.');
      return;
    }
 
    if (!transactionId) {
      setError('Transaction ID is missing. Cannot sign.');
      return;
    }
 
    setLoading(true);
    setError(null);
 
    try {
      const response = await api.post(`/v1/sign/${transactionId}`, null, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
      });
 
      if (response && response.data && response.data.leaseId && response.data.base64PdfContent && response.data.amount) {
        const { leaseId, base64PdfContent, amount } = response.data;
 
        localStorage.setItem('currentLeaseId', leaseId);
        localStorage.setItem('paymentAmount', amount);
        setPaymentAmount(amount);
        console.log('Lease ID stored in localStorage on sign:', leaseId);
        console.log('Payment Amount received and stored:', amount);
 
        const pdfBytes = Uint8Array.from(atob(base64PdfContent), char => char.charCodeAt(0));
        const signedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        setSignedPdfBlob(signedBlob);
        setShowPostSignOptions(true);
 
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
          setPdfUrl(null);
        }
 
      } else {
        console.warn('Lease ID, PDF content, or amount missing from backend response after signing.');
        setError('Failed to retrieve full response after signing.');
      }
 
    } catch (err) {
      console.error('Error signing lease agreement:', err);
      setError(`Failed to sign lease agreement: ${err.response?.data?.message || err.response?.data || err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
 
  const handleDownloadSignedAgreement = () => {
    if (signedPdfBlob) {
      const downloadUrl = URL.createObjectURL(signedPdfBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `lease-agreement-signed-${localStorage.getItem('currentLeaseId') || transactionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
 
    } else {
      setError('No signed agreement to download. Please sign the lease first.');
    }
  };
 
  const handleProceedToPayment = () => {
    const leaseIdForPayment = localStorage.getItem('currentLeaseId');
    if (leaseIdForPayment) {
      navigate('/payment');
    } else {
      console.warn('Lease ID not found in localStorage when navigating to payment.');
      setError('Lease ID is missing. Cannot proceed to payment.');
    }
  };
 
  const handleLogout = () => {
    localStorage.removeItem('currentLeaseId');
    localStorage.removeItem('jwt');
    localStorage.removeItem('paymentAmount');
    navigate('/login');
  };
 
  const LogoutButton = () => (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
 
  if (loading && !showPostSignOptions) {
    return <div className="lease-agreement-container">Loading lease agreement...</div>;
  }
 
  if (error) {
    return <div className="lease-agreement-container"><p className="error-message">{error}</p></div>;
  }
 
  return (
    <div className="lease-agreement-container">
      <h2>Lease Agreement</h2>
 
      {!showPostSignOptions && pdfUrl ? (
        <div className="pdf-viewer">
          <iframe src={pdfUrl} title="Lease Agreement" width="100%" height="600px" frameBorder="0">
            This browser does not support PDFs. Please download the PDF to view it:
            <a href={pdfUrl} download={`lease-agreement-${transactionId}.pdf`}>Download PDF</a>
          </iframe>
        </div>
      ) : null}
 
      {!showPostSignOptions ? (
        <div className="signing-options">
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="agreeToSign"
              checked={agreeToSign}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="agreeToSign">I agree to the terms and wish to sign this lease agreement.</label>
          </div>
          <button
            className="sign-agreement-btn"
            onClick={handleSignLease}
            disabled={!agreeToSign || loading}
          >
            {loading ? 'Signing...' : 'Sign Lease Agreement'}
          </button>
        </div>
      ) : (
        <div className="post-sign-options">
          <p className="signed-message">Agreement Signed Successfully! You can now Download the Agreement and Proceed to Payment.</p>
          <div className="post-sign-buttons">
            <button
              className="download-btn"
              onClick={handleDownloadSignedAgreement}
              disabled={!signedPdfBlob}
            >
              Download Signed Agreement
            </button>
            <button
              className="proceed-payment-btn"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
 
      {!showPostSignOptions && (
        <button onClick={() => navigate('/Tenant/applications')} className="back-to-applications-btn">
          Back to Applications
        </button>
      )}
 
    </div>
  );
};
 
export default LeaseAgreementPage;
 