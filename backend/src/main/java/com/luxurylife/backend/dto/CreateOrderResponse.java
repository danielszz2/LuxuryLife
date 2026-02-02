package com.luxurylife.backend.dto;

import java.math.BigDecimal;

public class CreateOrderResponse {

    private Long id;
    private BigDecimal total;
    private String status;

    public CreateOrderResponse(Long id, BigDecimal total, String status) {
        this.id = id;
        this.total = total;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public String getStatus() {
        return status;
    }
}
