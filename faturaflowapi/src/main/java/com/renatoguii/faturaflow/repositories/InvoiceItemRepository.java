package com.renatoguii.faturaflow.repositories;

import com.renatoguii.faturaflow.entities.invoiceitem.InvoiceItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceItemRepository extends JpaRepository<InvoiceItemEntity, String> {
}
