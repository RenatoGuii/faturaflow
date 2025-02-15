package com.renatoguii.faturaflow.services;

import com.renatoguii.faturaflow.dtos.InvoiceDTO;
import com.renatoguii.faturaflow.dtos.InvoiceItemDTO;
import com.renatoguii.faturaflow.entities.invoice.InvoiceEntity;
import com.renatoguii.faturaflow.entities.invoice.InvoiceStatus;
import com.renatoguii.faturaflow.entities.invoiceitem.InvoiceItemEntity;
import com.renatoguii.faturaflow.exceptions.InvoiceException;
import com.renatoguii.faturaflow.repositories.InvoiceItemRepository;
import com.renatoguii.faturaflow.repositories.InvoiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class InvoiceServiceTest {

    @InjectMocks
    private InvoiceService invoiceService;

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private InvoiceItemRepository invoiceItemRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveInvoice_Success() {
        // Arrange
        InvoiceDTO invoiceDTO = new InvoiceDTO("Fatura 1", 110.0, "01/03/2025", InvoiceStatus.NOTPAID,
                Arrays.asList(new InvoiceItemDTO("Item 1", 50.0), new InvoiceItemDTO("Item 2", 60.0)));

        InvoiceEntity savedInvoice = new InvoiceEntity("Fatura 1", LocalDate.parse("2025-03-01"), 110.0, InvoiceStatus.NOTPAID);
        when(invoiceRepository.save(any(InvoiceEntity.class))).thenReturn(savedInvoice);

        // Act
        Boolean result = invoiceService.saveInvoice(invoiceDTO);

        // Assert
        assertEquals(true, result);
        verify(invoiceRepository, times(1)).save(any(InvoiceEntity.class));
        verify(invoiceItemRepository, times(2)).save(any(InvoiceItemEntity.class));
    }

    @Test
    public void testSaveInvoice_Failure() {
        // Arrange
        InvoiceDTO invoiceDTO = new InvoiceDTO("Fatura 1", 110.0, "01/03/2025", InvoiceStatus.NOTPAID,
                Arrays.asList(new InvoiceItemDTO("Item 1", 50.0), new InvoiceItemDTO("Item 2", 60.0)));

        when(invoiceRepository.save(any(InvoiceEntity.class))).thenThrow(new RuntimeException("Erro ao salvar"));

        // Act & Assert
        InvoiceException exception = assertThrows(InvoiceException.class, () -> invoiceService.saveInvoice(invoiceDTO));

        assertEquals("There was an error in the invoice registration", exception.getMessage());
    }

    @Test
    public void testSaveItemInvoice() {
        // Arrange
        InvoiceEntity invoice = new InvoiceEntity("Fatura 1", LocalDate.parse("2025-03-01"), 110.0, InvoiceStatus.NOTPAID);
        InvoiceItemDTO itemDTO = new InvoiceItemDTO("Item 1", 50.0);
        List<InvoiceItemDTO> items = Arrays.asList(itemDTO);

        // Act
        Boolean result = invoiceService.saveItemInvoice(invoice, items);

        // Assert
        assertEquals(true, result);
        verify(invoiceItemRepository, times(1)).save(any(InvoiceItemEntity.class));
    }

    @Test
    public void testGetInvoiceById_Success() {
        // Arrange
            String id = "07d2deb8-aa27-6d0c-af73-6c4b02598e8c";
            InvoiceEntity mockInvoice = new InvoiceEntity("Fatura 1", LocalDate.now(), 100.0, InvoiceStatus.NOTPAID);
            mockInvoice.setId(id);

            when(invoiceRepository.findById(any(String.class))).thenReturn(Optional.of(mockInvoice));


        // Act
        InvoiceEntity result = invoiceService.getInvoiceById(id);

        // Assert
        assertEquals(mockInvoice, result);
        verify(invoiceRepository, times(1)).findById(any(String.class));
    }

    @Test
    public void testGetInvoiceById_Failure() {
        // Arrange
        String id = "07d2deb8-aa27-6d0c-af73-6c4b02598e8c";
        when(invoiceRepository.findById(any(String.class))).thenThrow(new RuntimeException("Erro ao buscar"));

        // Act & Assert
        InvoiceException exception = assertThrows(InvoiceException.class, () -> invoiceService.getInvoiceById(id));

        assertEquals("There is no invoice with this identification", exception.getMessage());
    }

    @Test
    public void getAllInvoices_Success() {
        // Arrange
        InvoiceEntity mockInvoice1 = new InvoiceEntity("Fatura 1", LocalDate.now(), 100.0, InvoiceStatus.NOTPAID);
        mockInvoice1.setId("dbjjshcbjsdchsdhjcbjhsd");

        InvoiceEntity mockInvoice2 = new InvoiceEntity("Fatura 2", LocalDate.now(), 110.0, InvoiceStatus.NOTPAID);
        mockInvoice2.setId("dqdqwdhqjwwdbjhqbwjhdjq");

        List<InvoiceEntity> mockInvoices = new ArrayList<>();
        mockInvoices.add(mockInvoice1);
        mockInvoices.add(mockInvoice2);

        when(invoiceRepository.findAll()).thenReturn(mockInvoices);

        // Act
        List<InvoiceEntity> result = invoiceService.getAllInvoices();

        // Assert
        assertEquals(mockInvoices, result);
        verify(invoiceRepository, times(1)).findAll();
    }

    @Test
    public void getAllInvoices_Failure() {
        // Arrange
        when(invoiceRepository.findAll()).thenThrow(new RuntimeException("Erro ao buscar"));

        // Act & Assert
        InvoiceException exception = assertThrows(InvoiceException.class, () -> invoiceService.getAllInvoices());

        assertEquals("There was an error loading invoices", exception.getMessage());
    }

    @Test
    public void deleteInvoiceById_Success() {
        // Arrange
        String id = "07d2deb8-aa27-6d0c-af73-6c4b02598e8c";
        InvoiceEntity mockInvoice = new InvoiceEntity("Fatura 1", LocalDate.now(), 100.0, InvoiceStatus.NOTPAID);
        mockInvoice.setId(id);

        when(invoiceRepository.findById(any(String.class))).thenReturn(Optional.of(mockInvoice));
        doNothing().when(invoiceRepository).deleteById(any(String.class));

        // Act
        InvoiceEntity result = invoiceService.getInvoiceById(id);
        invoiceRepository.deleteById(id);

        // Assert
        assertEquals(mockInvoice, result);
        verify(invoiceRepository, times(1)).findById(any(String.class));
        verify(invoiceRepository, times(1)).deleteById(any(String.class));
    }

    @Test
    public void deleteInvoiceById_Failure_InvoiceNotFound() {
        // Arrange
        String id = "07d2deb8-aa27-6d0c-af73-6c4b02598e8c";
        InvoiceEntity mockInvoice = new InvoiceEntity("Fatura 1", LocalDate.now(), 100.0, InvoiceStatus.NOTPAID);
        mockInvoice.setId(id);

        when(invoiceRepository.findById(any(String.class))).thenThrow(new RuntimeException("Erro ao deletar"));

        // Act & Assert
        InvoiceException exception = assertThrows(InvoiceException.class, () -> invoiceService.deleteInvoiceById(id));

        assertEquals("There was an error and we were unable to delete the invoice", exception.getMessage());
    }

    @Test
    public void deleteInvoiceById_Failure_DeleteError() {
        // Arrange
        String id = "07d2deb8-aa27-6d0c-af73-6c4b02598e8c";
        InvoiceEntity mockInvoice = new InvoiceEntity("Fatura 1", LocalDate.now(), 100.0, InvoiceStatus.NOTPAID);
        mockInvoice.setId(id);

        doThrow(new RuntimeException("Erro ao deletar")).when(invoiceRepository).deleteById(any(String.class));

        // Act & Assert
        InvoiceException exception = assertThrows(InvoiceException.class, () -> invoiceService.deleteInvoiceById(id));

        assertEquals("There was an error and we were unable to delete the invoice", exception.getMessage());
    }

    @Test
    public void EditInvoiceById_Success() {
        // Arrange
        String id = "07d2deb8-aa27-6d0c-af73-6c4b02598e8c";
        InvoiceEntity mockInvoice = new InvoiceEntity("Fatura 1", LocalDate.now(), 100.0, InvoiceStatus.NOTPAID);
        mockInvoice.setId(id);

        InvoiceDTO data = new InvoiceDTO("Fatura Editada", 150.0, "01/04/2025", InvoiceStatus.PAID, null);

        when(invoiceRepository.findById(any(String.class))).thenReturn(Optional.of(mockInvoice));
        when(invoiceRepository.save(any(InvoiceEntity.class))).thenReturn(mockInvoice);

        // Act
        InvoiceEntity result = invoiceService.editInvoiceById(id, data);

        // Assert
        assertNotNull(result);
        assertEquals("Fatura Editada", result.getName());
        assertEquals(150.0, result.getTotalAmount());
        assertEquals(LocalDate.parse("01/04/2025", DateTimeFormatter.ofPattern("dd/MM/yyyy")), result.getDueDate());
        assertEquals(InvoiceStatus.PAID, result.getStatus());

        verify(invoiceRepository, times(1)).findById(id);
        verify(invoiceRepository, times(1)).save(mockInvoice);
    }

    @Test
    public void EditInvoiceById_Failure_InvoiceNotFound() {
        // Arrange
        String id = "07d2deb8-aa27-6d0c-af73-6c4b02598e8c";
        InvoiceEntity mockInvoice = new InvoiceEntity("Fatura 1", LocalDate.now(), 100.0, InvoiceStatus.NOTPAID);
        mockInvoice.setId(id);

        InvoiceDTO data = new InvoiceDTO("Fatura Editada", 150.0, "01/04/2025", InvoiceStatus.PAID, null);

        when(invoiceRepository.findById(any(String.class))).thenThrow(new RuntimeException("Erro ao editar"));

        // Act & Assert
        InvoiceException exception = assertThrows(InvoiceException.class, () -> invoiceService.editInvoiceById(id, data));

        assertEquals("An error occurred and the invoice details could not be edited", exception.getMessage());
    }

    @Test
    public void EditInvoiceById_Failure_SaveError() {
        // Arrange
        String id = "07d2deb8-aa27-6d0c-af73-6c4b02598e8c";
        InvoiceEntity mockInvoice = new InvoiceEntity("Fatura 1", LocalDate.now(), 100.0, InvoiceStatus.NOTPAID);
        mockInvoice.setId(id);

        InvoiceDTO data = new InvoiceDTO("Fatura Editada", 150.0, "01/04/2025", InvoiceStatus.PAID, null);

        when(invoiceRepository.save(any(InvoiceEntity.class))).thenThrow(new RuntimeException("Erro ao editar"));

        // Act & Assert
        InvoiceException exception = assertThrows(InvoiceException.class, () -> invoiceService.editInvoiceById(id, data));

        assertEquals("An error occurred and the invoice details could not be edited", exception.getMessage());
    }

}