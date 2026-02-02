package com.luxurylife.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String name;

    @Column(nullable=false, precision=10, scale=2)
    private BigDecimal price;

    // e.g. "assets/images/cloth1.jpg"
    @Column(nullable=false)
    private String imagePath;

    // men | women | kids
    @Column(nullable=false)
    private String category;

    // jeans | shoes | watch | dress | costume | hoodie | jacket | hat | sneakers | shirt
    @Column(nullable=false)
    private String subCategory;

    @Column(nullable=false, length=1000)
    private String description;

    // Keep Step A simple: store sizes as CSV: "S,M,L,XL"
    @Column(nullable=false)
    private String sizesCsv;

    @Column(nullable=false)
    private Integer stock = 999;

    public Product() {}

    public Product(String name, BigDecimal price, String imagePath,
                   String category, String subCategory, String description,
                   String sizesCsv, Integer stock) {
        this.name = name;
        this.price = price;
        this.imagePath = imagePath;
        this.category = category;
        this.subCategory = subCategory;
        this.description = description;
        this.sizesCsv = sizesCsv;
        this.stock = stock;
    }

    // getters/setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public String getImagePath() { return imagePath; }
    public String getCategory() { return category; }
    public String getSubCategory() { return subCategory; }
    public String getDescription() { return description; }
    public String getSizesCsv() { return sizesCsv; }
    public Integer getStock() { return stock; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
    public void setCategory(String category) { this.category = category; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }
    public void setDescription(String description) { this.description = description; }
    public void setSizesCsv(String sizesCsv) { this.sizesCsv = sizesCsv; }
    public void setStock(Integer stock) { this.stock = stock; }
}
