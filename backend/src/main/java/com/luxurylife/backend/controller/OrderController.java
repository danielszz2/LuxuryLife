package com.luxurylife.backend.controller;

import com.luxurylife.backend.dto.CreateOrderRequest;
import com.luxurylife.backend.dto.CreateOrderResponse;
import com.luxurylife.backend.dto.MyOrderResponse;
import com.luxurylife.backend.model.Order;
import com.luxurylife.backend.model.User;
import com.luxurylife.backend.repository.OrderRepository;
import com.luxurylife.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService,
                           OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

  
    @PostMapping
    public CreateOrderResponse createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        Order order = orderService.create(request, user);

        return new CreateOrderResponse(
                order.getId(),
                order.getTotal(),
                order.getStatus()
        );
    }

    @GetMapping("/my")
    public List<MyOrderResponse> getMyOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(o -> new MyOrderResponse(
                        o.getId(),
                        o.getTotal(),
                        o.getStatus(),
                        o.getCreatedAt()
                ))
                .toList();
    }
}
