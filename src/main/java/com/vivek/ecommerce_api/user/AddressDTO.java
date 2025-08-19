package com.vivek.ecommerce_api.user;

import lombok.Data;

@Data
public class AddressDTO {
    private Long id; // Add this ID field
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}