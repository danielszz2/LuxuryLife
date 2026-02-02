package com.luxurylife.backend.config;

import com.luxurylife.backend.model.Product;
import com.luxurylife.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class ProductSeeder {

    @Bean
    CommandLineRunner seedProducts(ProductRepository repo) {
        return args -> {
            if (repo.count() > 0) return;

            String sizes = "S,M,L,XL";

            List<Product> products = List.of(
                // WOMEN
                new Product("Woman Dress Heart", new BigDecimal("100.00"), "assets/images/cloth1.jpg",
                        "women", "dress", "Romantic dress with heart patterns.", sizes, 100),
                new Product("Woman Dress Pink", new BigDecimal("120.00"), "assets/images/cloth2.avif",
                        "women", "dress", "Pink dress for stylish occasions.", sizes, 100),
                new Product("Woman Dress White", new BigDecimal("150.00"), "assets/images/cloth3.jpg",
                        "women", "dress", "Elegant white dress.", sizes, 100),
                new Product("Woman Dress Red", new BigDecimal("200.00"), "assets/images/cloth5.webp",
                        "women", "dress", "Bold red satin dress.", sizes, 100),
                new Product("Woman Costume White", new BigDecimal("250.00"), "assets/images/cloth6.jpg",
                        "women", "costume", "White costume outfit.", sizes, 100),
                new Product("Woman Costume Modern", new BigDecimal("300.00"), "assets/images/cloth7.webp",
                        "women", "costume", "Modern costume outfit.", sizes, 100),

                // MEN
                new Product("Man Hoodie", new BigDecimal("20.00"), "assets/images/clM.webp",
                        "men", "hoodie", "Premium quality hoodie.", sizes, 100),
                new Product("Man Jacket Blue", new BigDecimal("150.00"), "assets/images/clM2.jpg",
                        "men", "jacket", "Premium blue men's jacket.", sizes, 100),
                new Product("Men Watch", new BigDecimal("299.00"), "assets/images/men_watch.webp",
                        "men", "watch", "Luxury men watch.", sizes, 100),
                new Product("Men Watch Blue", new BigDecimal("299.00"), "assets/images/men_watch_2.webp",
                        "men", "watch", "Luxury men watch (blue).", sizes, 100),
                new Product("Men Shoes", new BigDecimal("199.00"), "assets/images/men_shoes.jpg",
                        "men", "shoes", "Comfortable premium shoes.", sizes, 100),
                new Product("Men Jeans", new BigDecimal("199.00"), "assets/images/men_jeans.jpg",
                        "men", "jeans", "Classic premium jeans.", sizes, 100),

                // KIDS
                new Product("Kid Costume", new BigDecimal("10.00"), "assets/images/cloth.webp",
                        "kids", "costume", "Fun costume for kids.", sizes, 100),
                new Product("Kid Jacket", new BigDecimal("129.00"), "assets/images/kid_jacket.webp",
                        "kids", "jacket", "Cozy durable jacket.", sizes, 100),
                new Product("Kid Sneakers", new BigDecimal("89.00"), "assets/images/kid_sneakers.jpg",
                        "kids", "sneakers", "Comfortable sneakers.", sizes, 100),
                new Product("Kid Shirt", new BigDecimal("129.00"), "assets/images/kid_shirt.avif",
                        "kids", "shirt", "Soft cotton shirt.", sizes, 100),
                new Product("Kid Hoodie", new BigDecimal("89.00"), "assets/images/kid_hoodie.jpg",
                        "kids", "hoodie", "Warm hoodie.", sizes, 100),
                new Product("Kid Hat", new BigDecimal("129.00"), "assets/images/kid_hat.webp",
                        "kids", "hat", "Stylish hat.", sizes, 100)
            );

            repo.saveAll(products);
            System.out.println("✅ Seeded products: " + repo.count());
        };
    }
}
