package com.luxurylife.backend.service;

import com.luxurylife.backend.model.Product;
import com.luxurylife.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> getAll(String category) {
        if (category == null || category.isBlank()) {
            return repo.findAll();
        }
        return repo.findByCategoryIgnoreCase(category.trim());
    }

    public Product getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }
    

}
