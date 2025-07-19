package com.rental.property.util;

import com.rental.property.dto.PaymentDTO;
import com.rental.property.dto.PaymentTenantResponse;
import com.rental.property.entity.Payment;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@NoArgsConstructor
public class PaymentMapper {

    public static PaymentDTO toDTO(Payment payment) {
        return new PaymentDTO(
                payment.getLease() != null ? payment.getLease().getLeaseId() : null,
                payment.getAmount(),
                payment.getPaymentDate(),
                payment.getPaymentInfo(),
                payment.getStatus(),
                payment.getLease().getProperty().getBhk(),
                payment.getLease().getProperty().getPropertyType(),
                payment.getLease().getProperty().getAddress()
        );
    }

    public static Payment toEntity(PaymentDTO dto) {
        Payment payment = new Payment();
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setStatus(dto.getStatus());
        payment.setPaymentInfo(dto.getPaymentInfo());
        return payment;
    }

    public  static PaymentTenantResponse toTenantResponse(Payment payment){
        return PaymentTenantResponse.builder().bhk(payment.getLease().getProperty().getBhk())
                .propertyType(payment.getLease().getProperty().getPropertyType()).address(payment.getLease().getProperty().getAddress()).amount(payment.getAmount()).
                paymentDate(payment.getPaymentDate()).status(payment.getStatus()).build();
    }
}