package com.luxurylife.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderDetailsResponse {
    public Long id;
    public BigDecimal total;
    public String status;
    public Instant createdAt;

    public CustomerDto customer;
    public List<ItemDto> items;

    public OrderDetailsResponse(Long id, BigDecimal total, String status, Instant createdAt,
                                CustomerDto customer, List<ItemDto> items) {
        this.id = id;
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;
        this.customer = customer;
        this.items = items;
    }

    public static class CustomerDto {
        public String firstName;
        public String lastName;
        public String phone;
        public String email;
        public String address;
        public String city;
        public String zip;
        public String country;

        public CustomerDto(String firstName, String lastName, String phone, String email,
                           String address, String city, String zip, String country) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.phone = phone;
            this.email = email;
            this.address = address;
            this.city = city;
            this.zip = zip;
            this.country = country;
        }
    }

    public static class ItemDto {
        public Long productId;
        public String productName;
        public String imagePath;
        public Integer quantity;
        public String size;
        public BigDecimal unitPrice;
        public BigDecimal lineTotal;

        public ItemDto(Long productId, String productName, String imagePath,
                       Integer quantity, String size, BigDecimal unitPrice, BigDecimal lineTotal) {
            this.productId = productId;
            this.productName = productName;
            this.imagePath = imagePath;
            this.quantity = quantity;
            this.size = size;
            this.unitPrice = unitPrice;
            this.lineTotal = lineTotal;
        }
    }
}
