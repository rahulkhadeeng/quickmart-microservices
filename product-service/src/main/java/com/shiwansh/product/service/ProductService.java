package com.shiwansh.product.service;

import com.shiwansh.product.dto.ProductDTO;
import com.shiwansh.product.model.Product;
import com.shiwansh.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductDTO.Response> getProducts(String category, String search) {
        List<Product> products;

        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.searchProducts(search.trim());
        } else if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) {
            products = productRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            products = productRepository.findAll();
        }

        return products.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ProductDTO.Response getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    public ProductDTO.Response createProduct(ProductDTO.Request request) {
        Product product = new Product(
                null,
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getCategory(),
                request.getStockQuantity() != null ? request.getStockQuantity() : 0,
                request.getImageUrl(),
                request.getRating() != null ? request.getRating() : 4.5
        );
        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    public ProductDTO.Response updateProduct(Long id, ProductDTO.Request request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getCategory() != null) product.setCategory(request.getCategory());
        if (request.getStockQuantity() != null) product.setStockQuantity(request.getStockQuantity());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getRating() != null) product.setRating(request.getRating());

        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }

    public ProductDTO.Response reduceStock(Long id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
        if (product.getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
        }
        product.setStockQuantity(product.getStockQuantity() - quantity);
        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    public ProductDTO.Response mapToResponse(Product product) {
        return new ProductDTO.Response(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory(),
                product.getStockQuantity(),
                product.getImageUrl(),
                product.getRating(),
                product.getCreatedAt()
        );
    }
}
