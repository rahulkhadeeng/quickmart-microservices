package com.shiwansh.order.service;

import com.shiwansh.order.dto.OrderDTO;
import com.shiwansh.order.model.Order;
import com.shiwansh.order.model.OrderItem;
import com.shiwansh.order.repository.OrderRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    public OrderService(OrderRepository orderRepository, RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.restTemplate = restTemplate;
    }

    @Transactional
    public OrderDTO.Response createOrder(OrderDTO.CreateOrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item.");
        }

        // 1. Fetch User details from User Service via Eureka load-balancer
        String userName = "QuickMart Customer";
        String userEmail = "customer@quickmart.com";
        try {
            ResponseEntity<Map<String, Object>> userResponse = restTemplate.exchange(
                    "http://USER-SERVICE/users/" + request.getUserId(),
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            if (userResponse.getStatusCode().is2xxSuccessful() && userResponse.getBody() != null) {
                Map<String, Object> userData = userResponse.getBody();
                if (userData.containsKey("name")) userName = (String) userData.get("name");
                if (userData.containsKey("email")) userEmail = (String) userData.get("email");
            }
        } catch (Exception e) {
            // Graceful fallback if user service unreachable directly
            userName = "Customer #" + request.getUserId();
        }

        // 2. Process Items and verify with Product Service
        String orderNumber = "QM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUserId(request.getUserId());
        order.setUserName(userName);
        order.setUserEmail(userEmail);
        order.setShippingAddress(request.getShippingAddress() != null ? request.getShippingAddress() : "Standard Delivery Address");
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "ONLINE");
        order.setStatus("CONFIRMED");

        double totalAmount = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderDTO.ItemRequest itemReq : request.getItems()) {
            String productName = "Product #" + itemReq.getProductId();
            double price = 100.0;

            try {
                // Fetch product details from product-service
                ResponseEntity<Map<String, Object>> prodResponse = restTemplate.exchange(
                        "http://PRODUCT-SERVICE/products/" + itemReq.getProductId(),
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<Map<String, Object>>() {}
                );

                if (prodResponse.getStatusCode().is2xxSuccessful() && prodResponse.getBody() != null) {
                    Map<String, Object> prodData = prodResponse.getBody();
                    if (prodData.containsKey("name")) productName = (String) prodData.get("name");
                    if (prodData.containsKey("price")) {
                        Number num = (Number) prodData.get("price");
                        price = num.doubleValue();
                    }

                    // Reduce stock in product service
                    try {
                        restTemplate.postForLocation(
                                "http://PRODUCT-SERVICE/products/" + itemReq.getProductId() + "/reduce-stock?quantity=" + itemReq.getQuantity(),
                                null
                        );
                    } catch (Exception ignored) {}
                }
            } catch (Exception e) {
                // Fallback price if product-service mock
            }

            double subtotal = price * itemReq.getQuantity();
            totalAmount += subtotal;

            OrderItem orderItem = new OrderItem(
                    null,
                    order,
                    itemReq.getProductId(),
                    productName,
                    price,
                    itemReq.getQuantity(),
                    subtotal
            );
            orderItems.add(orderItem);
        }

        order.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    public List<OrderDTO.Response> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderDTO.Response> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrderDTO.Response getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
        return mapToResponse(order);
    }

    public OrderDTO.Response updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
        order.setStatus(status.toUpperCase());
        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    public OrderDTO.Response mapToResponse(Order order) {
        List<OrderDTO.ItemResponse> itemResponses = order.getItems().stream()
                .map(item -> new OrderDTO.ItemResponse(
                        item.getId(),
                        item.getProductId(),
                        item.getProductName(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());

        return new OrderDTO.Response(
                order.getId(),
                order.getOrderNumber(),
                order.getUserId(),
                order.getUserName(),
                order.getUserEmail(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getShippingAddress(),
                order.getPaymentMethod(),
                itemResponses,
                order.getCreatedAt()
        );
    }
}
