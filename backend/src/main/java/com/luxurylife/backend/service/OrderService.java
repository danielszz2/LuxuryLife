package com.luxurylife.backend.service;

import com.luxurylife.backend.dto.CreateOrderRequest;
import com.luxurylife.backend.model.*;
import com.luxurylife.backend.repository.OrderRepository;
import com.luxurylife.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;

    public OrderService(OrderRepository orderRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    @Transactional
    public Order create(CreateOrderRequest req, User user) {


        Customer c = new Customer();
        c.setFirstName(req.getCustomer().firstName);
        c.setLastName(req.getCustomer().lastName);
        c.setPhone(req.getCustomer().phone);
        c.setEmail(req.getCustomer().email);
        c.setAddress(req.getCustomer().address);
        c.setCity(req.getCustomer().city);
        c.setZip(req.getCustomer().zip);
        c.setCountry(req.getCustomer().country);

        Order order = new Order();
        order.setUser(user);
        order.setCustomer(c);

        BigDecimal total = BigDecimal.ZERO;

   
        for (CreateOrderRequest.ItemDto item : req.getItems()) {

            if (item.productId == null) {
                throw new RuntimeException("Missing productId in order item.");
            }

            int qty = (item.quantity == null ? 1 : item.quantity);
            if (qty <= 0) {
                throw new RuntimeException("Invalid quantity for productId " + item.productId);
            }

    
            Product p = productRepo.findByIdForUpdate(item.productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.productId));

            int currentStock = (p.getStock() == null ? 0 : p.getStock());


            if (currentStock < qty) {
                throw new RuntimeException(
                        "Not enough stock for: " + p.getName() +
                        ". Available: " + currentStock +
                        ", requested: " + qty
                );
            }

    
            p.setStock(currentStock - qty);

      
            BigDecimal unit = p.getPrice();
            BigDecimal line = unit.multiply(BigDecimal.valueOf(qty));

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(p);
            oi.setQuantity(qty);
            oi.setSize(item.size == null ? "" : item.size);
            oi.setUnitPrice(unit);
            oi.setLineTotal(line);

            order.getItems().add(oi);
            total = total.add(line);
        }

        order.setTotal(total);
        return orderRepo.save(order);
    }
}

