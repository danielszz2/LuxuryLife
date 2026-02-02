package com.luxurylife.backend.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class CreateOrderRequest {

    @NotNull
    private CustomerDto customer;

    @NotEmpty
    private List<ItemDto> items;

    public CustomerDto getCustomer() { return customer; }
    public List<ItemDto> getItems() { return items; }
    public void setCustomer(CustomerDto customer) { this.customer = customer; }
    public void setItems(List<ItemDto> items) { this.items = items; }

    public static class CustomerDto {
        @NotBlank public String firstName;
        @NotBlank public String lastName;
        public String phone;
        @Email @NotBlank public String email;
        @NotBlank public String address;
        @NotBlank public String city;
        @NotBlank public String zip;
        @NotBlank public String country;
    }
    public static class ItemDto {
        public Long productId;
        public Integer quantity;
        public String size;
    }

}
