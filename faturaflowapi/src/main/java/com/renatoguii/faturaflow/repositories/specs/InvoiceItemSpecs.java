package com.renatoguii.faturaflow.repositories.specs;

import com.renatoguii.faturaflow.entities.invoiceitem.InvoiceItemEntity;
import org.springframework.data.jpa.domain.Specification;

public class InvoiceItemSpecs {

    public static Specification<InvoiceItemEntity> invoiceIdEqual(String invoiceId) {
        return (root, query, cb) -> cb.equal(root.get("invoice").get("id"), invoiceId);
    }

}
