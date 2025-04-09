package com.renatoguii.faturaflow.repositories;

import com.renatoguii.faturaflow.entities.invoice.InvoiceEntity;
import com.renatoguii.faturaflow.entities.invoice.InvoiceStatus;
import com.renatoguii.faturaflow.entities.user.UserEntity;
import com.renatoguii.faturaflow.repositories.specs.GenericSpecs;
import com.renatoguii.faturaflow.repositories.specs.InvoiceSpecs;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

@Hidden
@Repository
public interface InvoiceRepository extends JpaRepository<InvoiceEntity, String>, JpaSpecificationExecutor<InvoiceEntity> {

    List<InvoiceEntity> findByUser(UserEntity user);

//    SELECT * FROM invoice WHERE status = 'NOTPAID'
//    AND EXTRACT(MONTH FROM due_date) = EXTRACT(MONTH FROM CURRENT_DATE)
//    AND EXTRACT(YEAR FROM due_date) = EXTRACT(YEAR FROM CURRENT_DATE);
    default List<InvoiceEntity> findByStatusAndCurrentDataLike(UserEntity user) {
        // Inicialização da Specification com a condição inicial (conjunction)
        Specification<InvoiceEntity> spec = Specification.where(GenericSpecs.conjunction());

        spec = spec.and(InvoiceSpecs.userEqual(user));

        spec = spec.and(InvoiceSpecs.currentMonth());

        return findAll(spec);
    }

    default List<InvoiceEntity> findByStatus(InvoiceStatus status, UserEntity user) {
        Specification<InvoiceEntity> spec = Specification.where(GenericSpecs.conjunction());

        spec = spec.and(InvoiceSpecs.userEqual(user));

        if (status != null) {
            spec = spec.and(InvoiceSpecs.statusEqual(status));
        }

        return findAll(spec);
    }

}
