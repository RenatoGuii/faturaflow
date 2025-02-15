package com.renatoguii.faturaflow.repositories;

import com.renatoguii.faturaflow.entities.invoice.InvoiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<InvoiceEntity, String> {
}
