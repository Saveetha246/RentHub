package com.rental.property.service;

import com.rental.property.dto.PaymentDTO;
import com.rental.property.dto.PaymentTenantResponse;
import com.rental.property.entity.Lease;
import com.rental.property.entity.Payment;
import com.rental.property.exception.PaymentNotFoundException;
import com.rental.property.repo.LeaseRepository;
import com.rental.property.repo.PaymentRepository;
import com.rental.property.util.PaymentMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final LeaseRepository leaseRepository;

    @Transactional
    public PaymentDTO createPayment(Long leaseId, PaymentDTO dto) {
        Lease lease = leaseRepository.findById(leaseId)
                .orElseThrow(() -> new RuntimeException("Lease not found with ID: " + leaseId));
        LocalDate paymentDate = dto.getPaymentDate();
        paymentRepository.findPaymentByLeaseIdAndDate(leaseId, paymentDate)
                .ifPresent(existingPayment -> {
                    throw new RuntimeException("Duplicate payment detected! Tenant has already paid on " + paymentDate);
                });
        Payment payment = PaymentMapper.toEntity(dto);
        payment.setLease(lease);
        payment.setStatus("Completed");
        payment.getLease().getRentalTransaction().setStatus("Completed");// Changed status to "Completed" immediately
        payment.setUser(lease.getRentalTransaction().getUser());
        payment.getLease().getProperty().setAvailabilityStatus("Rented");

        Payment savedPayment = paymentRepository.save(payment);
        return PaymentMapper.toDTO(savedPayment);
    }

    @Override
    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with ID: " + id));
        return PaymentMapper.toDTO(payment);
    }

    @Override
    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream().map(PaymentMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getAllPaymentsByPropertyId(Long propertyId) {
        List<Payment> payments = paymentRepository.findByLease_Property_PropertyId(propertyId);
        return payments.stream().map(PaymentMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getPaymentsByPropertyIdAndTransactionId(Long propertyId, Long transactionId) {
        List<Payment> payments = paymentRepository.findByLease_Property_PropertyIdAndLease_RentalTransaction_TransactionId(propertyId, transactionId);
        return payments.stream().map(PaymentMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<PaymentTenantResponse> getAllpaymentsByUserId(Long userId) {
        List<Payment> paymentList=paymentRepository.findAllByUserId_Id(userId);
        return paymentList.stream().map(PaymentMapper::toTenantResponse).collect(Collectors.toList());
    }
}