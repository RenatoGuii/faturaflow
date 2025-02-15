package com.renatoguii.faturaflow.services;

import com.renatoguii.faturaflow.dtos.InvoiceDTO;
import com.renatoguii.faturaflow.dtos.InvoiceItemDTO;
import com.renatoguii.faturaflow.entities.invoice.InvoiceEntity;
import com.renatoguii.faturaflow.entities.invoiceitem.InvoiceItemEntity;
import com.renatoguii.faturaflow.exceptions.InvoiceException;
import com.renatoguii.faturaflow.repositories.InvoiceItemRepository;
import com.renatoguii.faturaflow.repositories.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    public Boolean saveItemInvoice(InvoiceEntity invoice, List<InvoiceItemDTO> items) {
        List<InvoiceItemEntity> newItems = new ArrayList<>();

        for (InvoiceItemDTO item : items) {
            InvoiceItemEntity newItem = new InvoiceItemEntity(item.description(), item.amount(), invoice);
            newItems.add(newItem);
            invoiceItemRepository.save(newItem);
        }

        return true;
    }

    public Boolean saveInvoice(InvoiceDTO data) {
        try {
            LocalDate dateFormatted = LocalDate.parse(data.dueDate(), DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            InvoiceEntity newInvoice = new InvoiceEntity(data.name(), dateFormatted, data.totalAmount(), data.status());
            InvoiceEntity savedInvoice = invoiceRepository.save(newInvoice);

            Boolean itsSavedItems = saveItemInvoice(savedInvoice, data.items());

            return itsSavedItems;

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
            List<InvoiceEntity> invoices = invoiceRepository.findAll();
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
            editedInvoice.setDueDate(LocalDate.parse(data.dueDate(), DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            editedInvoice.setStatus(data.status());

            return invoiceRepository.save(editedInvoice);
        } catch (Exception e) {
            throw new InvoiceException("An error occurred and the invoice details could not be edited");
        }
    }
}