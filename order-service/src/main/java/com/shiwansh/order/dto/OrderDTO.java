package com.shiwansh.order.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {

    public static class ItemRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class CreateOrderRequest {
        private Long userId;
        private String shippingAddress;
        private String paymentMethod;
        private List<ItemRequest> items;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public List<ItemRequest> getItems() { return items; }
        public void setItems(List<ItemRequest> items) { this.items = items; }
    }

    public static class ItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private Double unitPrice;
        private Integer quantity;
        private Double subtotal;

        public ItemResponse() {}

        public ItemResponse(Long id, Long productId, String productName, Double unitPrice, Integer quantity, Double subtotal) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.unitPrice = unitPrice;
            this.quantity = quantity;
            this.subtotal = subtotal;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public Double getUnitPrice() { return unitPrice; }
        public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public Double getSubtotal() { return subtotal; }
        public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    }

    public static class Response {
        private Long id;
        private String orderNumber;
        private Long userId;
        private String userName;
        private String userEmail;
        private Double totalAmount;
        private String status;
        private String shippingAddress;
        private String paymentMethod;
        private List<ItemResponse> items;
        private LocalDateTime createdAt;

        public Response() {}

        public Response(Long id, String orderNumber, Long userId, String userName, String userEmail, Double totalAmount, String status, String shippingAddress, String paymentMethod, List<ItemResponse> items, LocalDateTime createdAt) {
            this.id = id;
            this.orderNumber = orderNumber;
            this.userId = userId;
            this.userName = userName;
            this.userEmail = userEmail;
            this.totalAmount = totalAmount;
            this.status = status;
            this.shippingAddress = shippingAddress;
            this.paymentMethod = paymentMethod;
            this.items = items;
            this.createdAt = createdAt;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getOrderNumber() { return orderNumber; }
        public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
        public Double getTotalAmount() { return totalAmount; }
        public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public List<ItemResponse> getItems() { return items; }
        public void setItems(List<ItemResponse> items) { this.items = items; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
