package com.luxurylife.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class MyOrderResponse {
    public Long id;
    public BigDecimal total;
    public String status;
    public Instant createdAt;

    public MyOrderResponse(Long id, BigDecimal total, String status, Instant createdAt) {
        this.id = id;
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;
    }
}
