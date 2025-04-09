package com.renatoguii.faturaflow.services;

import com.renatoguii.faturaflow.dtos.InvoiceDTO;
import com.renatoguii.faturaflow.dtos.InvoiceItemDTO;
import com.renatoguii.faturaflow.entities.invoice.InvoiceEntity;
import com.renatoguii.faturaflow.entities.invoice.InvoiceStatus;
import com.renatoguii.faturaflow.entities.invoiceitem.InvoiceItemEntity;
import com.renatoguii.faturaflow.entities.user.UserEntity;
import com.renatoguii.faturaflow.exceptions.InvoiceException;
import com.renatoguii.faturaflow.infra.security.token.JwtService;
import com.renatoguii.faturaflow.infra.security.token.SecurityUtil;
import com.renatoguii.faturaflow.repositories.InvoiceItemRepository;
import com.renatoguii.faturaflow.repositories.InvoiceRepository;
import com.renatoguii.faturaflow.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {

    @Autowired
    InvoiceRepository invoiceRepository;

    @Autowired
    InvoiceItemRepository invoiceItemRepository;

    @Autowired
    JwtService jwtService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    SecurityUtil securityUtil;

    public Boolean saveItemInvoice(InvoiceEntity invoice, List<InvoiceItemDTO> items) {
        List<InvoiceItemEntity> newItems = new ArrayList<>();
        invoiceItemRepository.deleteInvoiceItems(invoice.getId());

        for (InvoiceItemDTO item : items) {
            InvoiceItemEntity newItem = new InvoiceItemEntity(item.description(), item.amount(), invoice);
            newItems.add(newItem);
            invoiceItemRepository.save(newItem);
        }

        return true;
    }

    public Boolean saveInvoice(InvoiceDTO data) {
        try {
            UserEntity user = securityUtil.getAuthenticatedUser();

            String formattedCreatedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));

            InvoiceEntity newInvoice = new InvoiceEntity(user, data.name(), data.dueDate(), data.totalAmount(), data.status(), formattedCreatedDate);
            InvoiceEntity savedInvoice = invoiceRepository.save(newInvoice);

            if (data.items() != null) {
                Boolean itsSavedItems = saveItemInvoice(savedInvoice, data.items());
                return itsSavedItems;
            }

            return true;

        } catch (Exception e) {
            throw new InvoiceException("There was an error in the invoice registration");
        }
    }

    public InvoiceEntity getInvoiceById(String id) {
        try {
            Optional<InvoiceEntity> possibleInvoice = invoiceRepository.findById(id);

            if (possibleInvoice.isEmpty()) {
                throw new InvoiceException("");
            }

            InvoiceEntity invoice = possibleInvoice.get();

            return invoice;

        } catch (Exception e) {
            throw new InvoiceException("There is no invoice with this identification");
        }
    }

    public List<InvoiceEntity> getAllInvoices () {
        try {

            UserEntity user = securityUtil.getAuthenticatedUser();

            List<InvoiceEntity> invoices = invoiceRepository.findByUser(user);

            for (InvoiceEntity invoice : invoices) {

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                LocalDate dueDate = LocalDate.parse(invoice.getDueDate(), formatter);

                if (invoice.getStatus() == InvoiceStatus.NOTPAID && dueDate.isBefore((LocalDate.now()))) {
                    invoice.setStatus(InvoiceStatus.OVERDUE);
                }

            }

            return invoiceRepository.saveAll(invoices);

        } catch (Exception e) {
            throw new InvoiceException("There was an error loading invoices");
        }
    }

    public List<InvoiceEntity> getAllInvoicesCurrent () {
        try {
            UserEntity user = securityUtil.getAuthenticatedUser();
            List<InvoiceEntity> invoices = invoiceRepository.findByStatusAndCurrentDataLike(user);
            return invoices;
        } catch (Exception e) {
            throw new InvoiceException("There was an error loading invoices");
        }
    }

    public List<InvoiceEntity> getAllInvoicesStatus (InvoiceStatus status) {
        try {
            UserEntity user = securityUtil.getAuthenticatedUser();
            List<InvoiceEntity> invoices = invoiceRepository.findByStatus(status, user);
            return invoices;
        } catch (Exception e) {
            throw new InvoiceException("There was an error loading invoices");
        }
    }

    public void deleteInvoiceById (String id) {
        try {
            Optional<InvoiceEntity> possibleInvoice = invoiceRepository.findById(id);

            if (possibleInvoice.isEmpty()) {
                throw new InvoiceException("The invoice you want to delete does not exist");
            }

            invoiceRepository.deleteById(possibleInvoice.get().getId());
        } catch (Exception e) {
            throw new InvoiceException("There was an error and we were unable to delete the invoice");
        }
    }

    public InvoiceEntity editInvoiceById (String id, InvoiceDTO data) {
        try {
            Optional<InvoiceEntity> possibleInvoice = invoiceRepository.findById(id);

            if (possibleInvoice.isEmpty()) {
                throw new InvoiceException("The invoice you want to edit doesn't exist");
            }

            InvoiceEntity editedInvoice = possibleInvoice.get();
            editedInvoice.setName(data.name());
            editedInvoice.setTotalAmount(data.totalAmount());
            editedInvoice.setDueDate(data.dueDate());
            editedInvoice.setStatus(data.status());

            InvoiceEntity savedInvoice = invoiceRepository.save(editedInvoice);

            if (data.items() != null) {
                saveItemInvoice(savedInvoice, data.items());
            }

            return savedInvoice;
        } catch (Exception e) {
            throw new InvoiceException("An error occurred and the invoice details could not be edited");
        }
    }
}