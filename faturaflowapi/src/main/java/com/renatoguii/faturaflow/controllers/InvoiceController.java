package com.renatoguii.faturaflow.controllers;

import com.renatoguii.faturaflow.dtos.InvoiceDTO;
import com.renatoguii.faturaflow.entities.invoice.InvoiceEntity;
import com.renatoguii.faturaflow.services.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/invoice")
public class InvoiceController {

    @Autowired
    InvoiceService invoiceService;

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceEntity> getInvoiceById (@PathVariable(value = "id") String id) {
        InvoiceEntity invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.status(HttpStatus.OK).body(invoice);
    }

    @GetMapping
    public ResponseEntity<List<InvoiceEntity>> getAllInvoices () {
        List<InvoiceEntity> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.status(HttpStatus.OK).body(invoices);
    }

    @PostMapping
    public ResponseEntity<String> saveInvoice (@Valid InvoiceDTO data) {
        Boolean itsSaved = invoiceService.saveInvoice(data);

        if (itsSaved) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Fatura adicionada com sucesso!");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao adicionar fatura!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInvoiceById (@PathVariable(value = "id") String id) {
        invoiceService.deleteInvoiceById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Fatura deletada com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvoiceEntity> editInvoiceById (@PathVariable(name = "id") String id, @Valid InvoiceDTO data) {
        InvoiceEntity editedInvoice = invoiceService.editInvoiceById(id, data);
        return ResponseEntity.status(HttpStatus.OK).body(editedInvoice);
    }

}
