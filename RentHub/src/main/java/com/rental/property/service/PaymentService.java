package com.rental.property.service;

import com.rental.property.dto.PaymentDTO;
import com.rental.property.dto.PaymentTenantResponse;

import java.util.List;

public interface PaymentService {
    PaymentDTO createPayment(Long leaseId, PaymentDTO dto);
    PaymentDTO getPaymentById(Long id);
    List<PaymentDTO> getAllPayments();
    List<PaymentDTO> getAllPaymentsByPropertyId(Long propertyId);
    List<PaymentDTO> getPaymentsByPropertyIdAndTransactionId(Long propertyId, Long transactionId);

    List<PaymentTenantResponse> getAllpaymentsByUserId(Long userId);
}