package com.renatoguii.faturaflow.repositories.specs;

import com.renatoguii.faturaflow.entities.invoice.InvoiceEntity;
import com.renatoguii.faturaflow.entities.invoice.InvoiceStatus;
import com.renatoguii.faturaflow.entities.user.UserEntity;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

public class InvoiceSpecs {

    private InvoiceSpecs() {}

    //Busca invoices que tem o status NOTPAID
    public static Specification<InvoiceEntity> userEqual(UserEntity user) {
        return  ((root, query, cb) -> cb.equal(root.get("user"), user));
    }

    public static Specification<InvoiceEntity> statusEqual(InvoiceStatus status) {
        return (root, q, cb) -> cb.equal(root.get("status"), status);
    }

    //Busca invoices com vencimento no mês atual
    public static Specification<InvoiceEntity> currentMonth() {
        return (root, query, cb) -> {
            // Converte dueDate para DATE usando o formato correto
            Expression<java.sql.Date> dueDateAsDate = cb.function(
                    "TO_DATE", java.sql.Date.class, root.get("dueDate"), cb.literal("DD/MM/YYYY")
            );

            // Extrai mês e ano do dueDate convertido
            Expression<Integer> monthDue = cb.function("DATE_PART", Integer.class, cb.literal("month"), dueDateAsDate);
            Expression<Integer> yearDue = cb.function("DATE_PART", Integer.class, cb.literal("year"), dueDateAsDate);

            // Extrai mês e ano da data atual
            Expression<Integer> currentMonth = cb.function("DATE_PART", Integer.class, cb.literal("month"), cb.currentDate());
            Expression<Integer> currentYear = cb.function("DATE_PART", Integer.class, cb.literal("year"), cb.currentDate());

            // Compara se o dueDate está no mês e ano atuais
            return cb.and(
                    cb.equal(monthDue, currentMonth),
                    cb.equal(yearDue, currentYear)
            );
        };
    }


}
