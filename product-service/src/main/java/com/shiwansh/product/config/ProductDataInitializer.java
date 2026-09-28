package com.shiwansh.product.config;

import com.shiwansh.product.model.Product;
import com.shiwansh.product.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class ProductDataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    public ProductDataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            List<Product> initialProducts = List.of(
                    new Product(
                            null,
                            "Sony WH-1000XM5 Wireless Headphones",
                            "Industry-leading noise canceling with two processors and 8 microphones for exceptional sound quality.",
                            399.99,
                            "Electronics",
                            25,
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
                            4.8
                    ),
                    new Product(
                            null,
                            "Apple Watch Ultra 2 GPS + Cellular",
                            "The most rugged and capable Apple Watch. Designed for outdoor adventure, endurance training, and water sports.",
                            799.00,
                            "Electronics",
                            18,
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
                            4.9
                    ),
                    new Product(
                            null,
                            "Nike Air Max 270 React",
                            "Nike's first lifestyle Air unit meets the softest, smoothest, and most resilient foam for supreme comfort.",
                            159.50,
                            "Footwear",
                            40,
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
                            4.7
                    ),
                    new Product(
                            null,
                            "Minimalist Leather Everyday Backpack",
                            "Handcrafted full-grain leather backpack with dedicated 15-inch laptop sleeve and weather-resistant zipper.",
                            129.99,
                            "Fashion",
                            30,
                            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
                            4.6
                    ),
                    new Product(
                            null,
                            "Mechanical Gaming Keyboard RGB",
                            "Custom mechanical switches, aircraft-grade aluminum frame, dynamic per-key RGB backlighting.",
                            89.99,
                            "Gaming",
                            50,
                            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
                            4.5
                    ),
                    new Product(
                            null,
                            "AeroPress Go Travel Coffee Maker",
                            "Delicious coffee anywhere. Brews smooth, rich espresso-style and cold brew in about a minute.",
                            39.95,
                            "Home & Kitchen",
                            35,
                            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
                            4.8
                    ),
                    new Product(
                            null,
                            "Sony Alpha A7 IV Mirrorless Camera",
                            "33MP Full-Frame Exmor R CMOS Sensor, 4K 60p Video, Real-Time Eye AF for Photo and Video.",
                            2498.00,
                            "Electronics",
                            10,
                            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
                            4.9
                    ),
                    new Product(
                            null,
                            "Polarized Classic Sunglasses UV400",
                            "Timeless aviator design with lightweight metal frame and high-definition polarized glare-free lenses.",
                            45.00,
                            "Fashion",
                            65,
                            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
                            4.4
                    )
            );
            productRepository.saveAll(initialProducts);
        }
    }
}
