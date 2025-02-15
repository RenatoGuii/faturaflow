package com.renatoguii.faturaflow.entities.invoiceitem;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.renatoguii.faturaflow.entities.invoice.InvoiceEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invoice_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String description;

    @Column
    private Double amount;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "invoice_id", nullable = false)
    private InvoiceEntity invoice;

    public InvoiceItemEntity (String description, Double amount, InvoiceEntity invoice) {
        this.description = description;
        this.amount = amount;
        this.invoice = invoice;
    }

}
