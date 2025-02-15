package com.renatoguii.faturaflow.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.RequestParam;

public record InvoiceItemDTO(@NotBlank @RequestParam("description") String description,
                             @NotNull @RequestParam("amount") Double amount) {
}
