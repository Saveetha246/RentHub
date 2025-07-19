package com.example.rentalsystem.service;

import com.rental.property.dto.PaymentDTO;
import com.rental.property.dto.PaymentTenantResponse;
import com.rental.property.entity.*;
import com.rental.property.exception.PaymentNotFoundException;
import com.rental.property.repo.LeaseRepository;
import com.rental.property.repo.PaymentRepository;
import com.rental.property.service.PaymentServiceImpl;
import com.rental.property.util.PaymentMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private LeaseRepository leaseRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private Lease lease;
    private Payment payment;
    private PaymentDTO paymentDTO;

    @BeforeEach
    void setUp() {
        lease = new Lease();
        lease.setProperty(new Property());
        lease.setRentalTransaction(new RentalTransaction());

        payment = new Payment();
        payment.setPaymentId(1L);
        payment.setLease(lease);
        payment.setAmount(10000.0);
        payment.setPaymentDate(LocalDate.now());
        payment.setStatus("Completed");
        payment.setPaymentInfo(new PaymentInfo(1234567890123456L, "12/25", 123, "John Doe"));

        paymentDTO = PaymentDTO.builder()
                .paymentId(1L)
                .amount(10000.0)
                .paymentDate(LocalDate.now())
                .paymentInfo(new PaymentInfo(1234567890123456L, "12/25", 123, "John Doe"))
                .status("Completed")
                .bhk("2BHK")
                .propertyType("Apartment")
                .address(new Address())
                .build();
    }



    @Test
    void testCreatePayment_Success() {
        when(leaseRepository.findById(anyLong())).thenReturn(Optional.of(lease));
        when(paymentRepository.findPaymentByLeaseIdAndDate(anyLong(), any(LocalDate.class))).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        PaymentDTO result = paymentService.createPayment(1L, paymentDTO);

        assertNotNull(result);
        assertEquals("Completed", result.getStatus());
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void testCreatePayment_LeaseNotFound() {
        when(leaseRepository.findById(anyLong())).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> paymentService.createPayment(1L, paymentDTO));
        assertEquals("Lease not found with ID: 1", exception.getMessage());
    }

    @Test
    void testGetPaymentById_Success() {
        when(paymentRepository.findById(anyLong())).thenReturn(Optional.of(payment));

        PaymentDTO result = paymentService.getPaymentById(1L);

        assertNotNull(result);
        assertEquals("Completed", result.getStatus());
    }

    @Test
    void testGetPaymentById_NotFound() {
        when(paymentRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(PaymentNotFoundException.class, () -> paymentService.getPaymentById(1L));
    }

    @Test
    void testGetAllPayments() {
        when(paymentRepository.findAll()).thenReturn(List.of(payment));

        List<PaymentDTO> result = paymentService.getAllPayments();

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void testGetAllPaymentsByUserId() {
        when(paymentRepository.findAllByUserId_Id(anyLong())).thenReturn(List.of(payment));

        List<PaymentTenantResponse> result = paymentService.getAllpaymentsByUserId(1L);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }
}
