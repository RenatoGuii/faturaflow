package com.renatoguii.faturaflow.entities.invoice;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.renatoguii.faturaflow.entities.user.UserEntity;
import com.renatoguii.faturaflow.entities.invoiceitem.InvoiceItemEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "invoice")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

//    @ManyToOne
//    @JoinColumn(name = "user_id", nullable = false)
//    private UserEntity user;

    @Column
    private String name;

    @Column
    private Double totalAmount;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @JsonManagedReference
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InvoiceItemEntity> items;

    public InvoiceEntity (String name, LocalDate dueDate, Double totalAmount, InvoiceStatus status) {
        this.name = name;
        this.dueDate = dueDate;
        this.totalAmount = totalAmount;
        this.status = status;
    }

}
