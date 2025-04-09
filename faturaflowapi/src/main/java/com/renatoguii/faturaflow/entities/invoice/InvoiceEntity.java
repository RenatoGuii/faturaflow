package com.renatoguii.faturaflow.entities.invoice;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.renatoguii.faturaflow.entities.user.UserEntity;
import com.renatoguii.faturaflow.entities.invoiceitem.InvoiceItemEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "invoice")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class InvoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column
    private String name;

    @Column
    private Double totalAmount;

    @Column(name = "due_date")
    private String dueDate;

    @CreatedDate
    @Column(name = "created_at")
    private String createdAt;

    @Column
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @JsonManagedReference
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InvoiceItemEntity> items;

    public InvoiceEntity (UserEntity user, String name, String dueDate, Double totalAmount, InvoiceStatus status, String createdAt) {
        this.user = user;
        this.name = name;
        this.dueDate = dueDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public InvoiceEntity (UserEntity user, String name, String dueDate, Double totalAmount, InvoiceStatus status) {
        this.user = user;
        this.name = name;
        this.dueDate = dueDate;
        this.totalAmount = totalAmount;
        this.status = status;
    }
}
