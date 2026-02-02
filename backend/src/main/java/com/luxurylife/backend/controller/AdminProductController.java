package com.luxurylife.backend.controller;

import com.luxurylife.backend.model.Product;
import com.luxurylife.backend.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
public class AdminProductController {

    private final ProductRepository productRepo;

    public AdminProductController(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Product> list() {
        return productRepo.findAll();
    }

 
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Product create(@Valid @RequestBody Product p) {
        p.setId(null); // ensure new
        return productRepo.save(p);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody Product p) {
        Product existing = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        existing.setName(p.getName());
        existing.setPrice(p.getPrice());
        existing.setImagePath(p.getImagePath());
        existing.setCategory(p.getCategory());
        existing.setSubCategory(p.getSubCategory());
        existing.setDescription(p.getDescription());
        existing.setSizesCsv(p.getSizesCsv());
        existing.setStock(p.getStock());

        return productRepo.save(existing);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!productRepo.existsById(id)) {
            throw new RuntimeException("Product not found: " + id);
        }
        productRepo.deleteById(id);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/stock")
    public Product updateStock(@PathVariable Long id, @RequestParam int stock) {
        if (stock < 0) throw new RuntimeException("Stock cannot be negative.");

        Product existing = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        existing.setStock(stock);
        return productRepo.save(existing);
    }
}
