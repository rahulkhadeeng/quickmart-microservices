package com.shiwansh.product.dto;

import java.time.LocalDateTime;

public class ProductDTO {

    public static class Request {
        private String name;
        private String description;
        private Double price;
        private String category;
        private Integer stockQuantity;
        private String imageUrl;
        private Double rating;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public Integer getStockQuantity() { return stockQuantity; }
        public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }
    }

    public static class Response {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private String category;
        private Integer stockQuantity;
        private String imageUrl;
        private Double rating;
        private LocalDateTime createdAt;

        public Response() {}

        public Response(Long id, String name, String description, Double price, String category, Integer stockQuantity, String imageUrl, Double rating, LocalDateTime createdAt) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
            this.category = category;
            this.stockQuantity = stockQuantity;
            this.imageUrl = imageUrl;
            this.rating = rating;
            this.createdAt = createdAt;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public Integer getStockQuantity() { return stockQuantity; }
        public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
