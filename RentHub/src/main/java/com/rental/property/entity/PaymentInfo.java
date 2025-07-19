package com.rental.property.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class PaymentInfo {
    @Column(name="cardNumber")
    private long cardNumber;
    @Column(name="expiryDate")
    private String expiryDate;
    @Column(name="cvvNumber")
    private int cvv;
    @Column(name="fullName")
    private String name;
}
