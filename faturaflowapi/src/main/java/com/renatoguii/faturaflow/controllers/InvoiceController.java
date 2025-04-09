package com.renatoguii.faturaflow.controllers;

import com.renatoguii.faturaflow.dtos.InvoiceDTO;
import com.renatoguii.faturaflow.entities.invoice.InvoiceEntity;
import com.renatoguii.faturaflow.entities.invoice.InvoiceStatus;
import com.renatoguii.faturaflow.services.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/invoice")
@Tag(name = "Invoice", description = "Gerenciamento de faturas")
public class InvoiceController {

    @Autowired
    InvoiceService invoiceService;

    @GetMapping("/{id}")
    @Operation(summary = "Buscar fatura por ID", description = "Retorna os detalhes de uma fatura específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fatura encontrada",
                    content = @Content(schema = @Schema(implementation = InvoiceEntity.class))),
            @ApiResponse(responseCode = "404", description = "Fatura não encontrada")
    })
    public ResponseEntity<InvoiceEntity> getInvoiceById(
            @Parameter(description = "ID da fatura", required = true) @PathVariable(value = "id") String id) {
        InvoiceEntity invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.status(HttpStatus.OK).body(invoice);
    }

    @GetMapping
    @Operation(summary = "Listar todas as faturas", description = "Retorna uma lista de todas as faturas do usuário logado")
    public ResponseEntity<List<InvoiceEntity>> getAllInvoices() {
        List<InvoiceEntity> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.status(HttpStatus.OK).body(invoices);
    }

    @GetMapping("/due/current")
    @Operation(summary = "Listar todas as faturas que irão vencer", description = "Retorna uma lista de todas as faturas do usuário logado que irão vencer no mês atual")
    public ResponseEntity<List<InvoiceEntity>> getAllInvoicesCurrent () {
        List<InvoiceEntity> invoices = invoiceService.getAllInvoicesCurrent();
        return ResponseEntity.status(HttpStatus.OK).body(invoices);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Listar todas as faturas por status", description = "Retorna uma lista de todas as faturas do usuário logado filtrados por status")
    public ResponseEntity<List<InvoiceEntity>> getAllInvoicesStatus (@PathVariable(value = "status") InvoiceStatus status) {
        List<InvoiceEntity> invoices = invoiceService.getAllInvoicesStatus(status);
        return ResponseEntity.status(HttpStatus.OK).body(invoices);
    }

    @PostMapping
    @Operation(summary = "Criar uma nova fatura", description = "Adiciona uma nova fatura ao sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Fatura criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos")
    })
    public ResponseEntity<String> saveInvoice(@Valid @RequestBody InvoiceDTO data) {
        Boolean itsSaved = invoiceService.saveInvoice(data);
        if (itsSaved) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Fatura adicionada com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao adicionar fatura!");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar uma fatura", description = "Remove uma fatura do sistema pelo ID")
    public ResponseEntity<String> deleteInvoiceById(
            @Parameter(description = "ID da fatura a ser deletada", required = true) @PathVariable(value = "id") String id) {
        invoiceService.deleteInvoiceById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Fatura deletada com sucesso!");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar uma fatura", description = "Edita os detalhes de uma fatura existente")
    public ResponseEntity<InvoiceEntity> editInvoiceById(
            @Parameter(description = "ID da fatura a ser editada", required = true) @PathVariable(name = "id") String id,
            @Valid @RequestBody InvoiceDTO data) {
        InvoiceEntity editedInvoice = invoiceService.editInvoiceById(id, data);
        return ResponseEntity.status(HttpStatus.OK).body(editedInvoice);
    }
}