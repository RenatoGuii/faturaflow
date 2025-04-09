package com.renatoguii.faturaflow.repositories;

import com.renatoguii.faturaflow.entities.invoice.InvoiceEntity;
import com.renatoguii.faturaflow.entities.invoiceitem.InvoiceItemEntity;
import com.renatoguii.faturaflow.repositories.specs.GenericSpecs;
import com.renatoguii.faturaflow.repositories.specs.InvoiceItemSpecs;
import com.renatoguii.faturaflow.repositories.specs.InvoiceSpecs;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Hidden
@Repository
public interface InvoiceItemRepository extends JpaRepository<InvoiceItemEntity, String>, JpaSpecificationExecutor<InvoiceItemEntity> {

    // DELETE FROM invoice_item WHERE id_invoice = x;

    default void deleteInvoiceItems(String id) {
        // Inicialização da Specification com a condição inicial (conjunction)
        Specification<InvoiceItemEntity> spec = Specification.where(GenericSpecs.conjunction());

        spec = spec.and(InvoiceItemSpecs.invoiceIdEqual(id));

        List<InvoiceItemEntity> listToDelete = findAll(spec);

        deleteAll(listToDelete);
    }

}
