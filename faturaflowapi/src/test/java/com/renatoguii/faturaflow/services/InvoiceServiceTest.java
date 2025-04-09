package com.renatoguii.faturaflow.services;

import com.renatoguii.faturaflow.dtos.InvoiceDTO;
import com.renatoguii.faturaflow.dtos.InvoiceItemDTO;
import com.renatoguii.faturaflow.entities.invoice.InvoiceEntity;
import com.renatoguii.faturaflow.entities.invoice.InvoiceStatus;
import com.renatoguii.faturaflow.entities.invoiceitem.InvoiceItemEntity;
import com.renatoguii.faturaflow.entities.user.UserEntity;
import com.renatoguii.faturaflow.exceptions.InvoiceException;
import com.renatoguii.faturaflow.infra.security.token.SecurityUtil;
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

    @Mock
    private SecurityUtil securityUtil;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void SaveInvoice_Success() {
        // Arrange
        InvoiceDTO invoiceDTO = new InvoiceDTO("Fatura 1", 110.0, "01/03/2025", InvoiceStatus.NOTPAID,
                Arrays.asList(new InvoiceItemDTO("Item 1", 50.0), new InvoiceItemDTO("Item 2", 60.0)));

        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());

        InvoiceEntity savedInvoice = new InvoiceEntity(user, "Fatura 1","01/03/2025", 110.0, InvoiceStatus.NOTPAID);

        // Mock do método securityUtil.getAuthenticatedUser()
        when(securityUtil.getAuthenticatedUser()).thenReturn(user);

        // Mock do repository
        when(invoiceRepository.save(any(InvoiceEntity.class))).thenReturn(savedInvoice);

        // Act
        Boolean result = invoiceService.saveInvoice(invoiceDTO);

        // Assert
        assertEquals(true, result);
        verify(invoiceRepository, times(1)).save(any(InvoiceEntity.class));
        verify(invoiceItemRepository, times(2)).save(any(InvoiceItemEntity.class));
    }

    @Test
    public void SaveInvoice_Failure() {
        // Arrange
        InvoiceDTO invoiceDTO = new InvoiceDTO("Fatura 1", 110.0, "01/03/2025", InvoiceStatus.NOTPAID,
                Arrays.asList(new InvoiceItemDTO("Item 1", 50.0), new InvoiceItemDTO("Item 2", 60.0)));

        when(invoiceRepository.save(any(InvoiceEntity.class))).thenThrow(new RuntimeException("Erro ao salvar"));

        // Act & Assert
        InvoiceException exception = assertThrows(InvoiceException.class, () -> invoiceService.saveInvoice(invoiceDTO));

        assertEquals("There was an error in the invoice registration", exception.getMessage());
    }

    @Test
    public void SaveItemInvoice() {
        // Arrange
        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());
        InvoiceEntity invoice = new InvoiceEntity(user, "Fatura 1", "2025-03-01", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().toString());
        InvoiceItemDTO itemDTO = new InvoiceItemDTO("Item 1", 50.0);
        List<InvoiceItemDTO> items = Arrays.asList(itemDTO);

        // Act
        Boolean result = invoiceService.saveItemInvoice(invoice, items);

        // Assert
        assertEquals(true, result);
        verify(invoiceItemRepository, times(1)).save(any(InvoiceItemEntity.class));
    }

    @Test
    public void GetInvoiceById_Success() {
        // Arrange
            String id = "07d2deb8-aa27-6d0c-af73-6c4b02598e8c";
            UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());
            InvoiceEntity mockInvoice = new InvoiceEntity(user, "Fatura 1", "2025-03-01", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().toString());
            mockInvoice.setId(id);

            when(invoiceRepository.findById(any(String.class))).thenReturn(Optional.of(mockInvoice));


        // Act
        InvoiceEntity result = invoiceService.getInvoiceById(id);

        // Assert
        assertEquals(mockInvoice, result);
        verify(invoiceRepository, times(1)).findById(any(String.class));
    }

    @Test
    public void GetInvoiceById_Failure() {
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
        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());
        InvoiceEntity mockInvoice1 = new InvoiceEntity(user, "Fatura 1", "01/03/2025", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        mockInvoice1.setId("dbjjshcbjsdchsdhjcbjhsd");

        InvoiceEntity mockInvoice2 = new InvoiceEntity(user, "Fatura 2", "01/03/2025", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        mockInvoice2.setId("dqdqwdhqjwwdbjhqbwjhdjq");

        List<InvoiceEntity> mockInvoices = new ArrayList<>();
        mockInvoices.add(mockInvoice1);
        mockInvoices.add(mockInvoice2);

        when(securityUtil.getAuthenticatedUser()).thenReturn(user);
        when(invoiceRepository.findByUser(user)).thenReturn(mockInvoices);
        when(invoiceRepository.saveAll(anyList())).thenReturn(mockInvoices);

        // Act
        List<InvoiceEntity> result = invoiceService.getAllInvoices();

        // Assert
        assertEquals(mockInvoices, result);
        verify(invoiceRepository, times(1)).findByUser(user);
    }

    @Test
    public void getAllInvoices_Failure() {
        // Arrange
        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        when(securityUtil.getAuthenticatedUser()).thenReturn(user);
        when(invoiceRepository.findByUser(user)).thenThrow(new RuntimeException("Erro ao buscar"));

        // Act & Assert
        InvoiceException exception = assertThrows(InvoiceException.class, () -> invoiceService.getAllInvoices());

        assertEquals("There was an error loading invoices", exception.getMessage());
    }


    @Test
    public void deleteInvoiceById_Success() {
        // Arrange
        String id = "07d2deb8-aa27-6d0c-af73-6c4b02598e8c";
        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());
        InvoiceEntity mockInvoice = new InvoiceEntity(user, "Fatura 1", "2025-03-01", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().toString());
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
        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());
        InvoiceEntity mockInvoice = new InvoiceEntity(user, "Fatura 1", "2025-03-01", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().toString());
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
        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());
        InvoiceEntity mockInvoice = new InvoiceEntity(user, "Fatura 1", "2025-03-01", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().toString());
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
        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());
        InvoiceEntity mockInvoice = new InvoiceEntity(user, "Fatura 1", "2025-03-01", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().toString());
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
        assertEquals("01/04/2025", result.getDueDate());
        assertEquals(InvoiceStatus.PAID, result.getStatus());

        verify(invoiceRepository, times(1)).findById(id);
        verify(invoiceRepository, times(1)).save(mockInvoice);
    }

    @Test
    public void EditInvoiceById_Failure_InvoiceNotFound() {
        // Arrange
        String id = "07d2deb8-aa27-6d0c-af73-6c4b02598e8c";
        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());
        InvoiceEntity mockInvoice = new InvoiceEntity(user, "Fatura 1", "2025-03-01", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().toString());
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
        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());
        InvoiceEntity mockInvoice = new InvoiceEntity(user, "Fatura 1", "2025-03-01", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().toString());
        mockInvoice.setId(id);

        InvoiceDTO data = new InvoiceDTO("Fatura Editada", 150.0, "01/04/2025", InvoiceStatus.PAID, null);

        when(invoiceRepository.save(any(InvoiceEntity.class))).thenThrow(new RuntimeException("Erro ao editar"));

        // Act & Assert
        InvoiceException exception = assertThrows(InvoiceException.class, () -> invoiceService.editInvoiceById(id, data));

        assertEquals("An error occurred and the invoice details could not be edited", exception.getMessage());
    }

    @Test
    public void GetAllInvoiceStatus() {
        // Arrange

        InvoiceStatus status = InvoiceStatus.NOTPAID;

        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());
        InvoiceEntity mockInvoice1 = new InvoiceEntity(user, "Fatura 1", "2025-03-01", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().toString());
        mockInvoice1.setId("dbjjshcbjsdchsdhjcbjhsd");

        InvoiceEntity mockInvoice2 = new InvoiceEntity(user, "Fatura 2", "2025-03-01", 110.0, InvoiceStatus.NOTPAID, LocalDate.now().toString());
        mockInvoice2.setId("dqdqwdhqjwwdbjhqbwjhdjq");

        InvoiceEntity mockInvoice3 = new InvoiceEntity(user, "Fatura 3", "2025-03-01", 110.0, InvoiceStatus.PAID, LocalDate.now().toString());
        mockInvoice2.setId("dqdqwdhqjwwdbjhqbwjhdjqwswsws");

        List<InvoiceEntity> mockInvoicesNotPaid = new ArrayList<>();
        mockInvoicesNotPaid.add(mockInvoice1);
        mockInvoicesNotPaid.add(mockInvoice2);

        when(securityUtil.getAuthenticatedUser()).thenReturn(user);
        when(invoiceRepository.findByStatus(status, user)).thenReturn(mockInvoicesNotPaid);

        // Act
        List<InvoiceEntity> result = invoiceService.getAllInvoicesStatus(status);

        // Assert
        assertEquals(mockInvoicesNotPaid, result);
        verify(invoiceRepository, times(1)).findByStatus(status, user);
    }

    @Test
    public void getAllInvoicesStatus_Failure() {
        // Arrange
        UserEntity user = new UserEntity("Renato", "Guimarães", "renato@email.com", "123456", LocalDate.now().toString());
        InvoiceStatus status = InvoiceStatus.NOTPAID;

        when(securityUtil.getAuthenticatedUser()).thenReturn(user);
        when(invoiceRepository.findByStatus(status, user)).thenThrow(new RuntimeException("Erro ao buscar"));

        // Act & Assert
        InvoiceException exception = assertThrows(InvoiceException.class, () -> invoiceService.getAllInvoicesStatus(status));

        assertEquals("There was an error loading invoices", exception.getMessage());
    }
    
}