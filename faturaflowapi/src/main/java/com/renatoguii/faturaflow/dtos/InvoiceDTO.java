package com.renatoguii.faturaflow.dtos;

import com.renatoguii.faturaflow.entities.invoice.InvoiceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public record InvoiceDTO(@NotBlank @RequestParam("name") String name,
                         @NotNull @RequestParam("totalAmount") Double totalAmount,
                         @NotBlank @RequestParam("dueDate") String dueDate,
                         @RequestParam("status") InvoiceStatus status,
                         @RequestParam("items") List<InvoiceItemDTO> items) {
}
