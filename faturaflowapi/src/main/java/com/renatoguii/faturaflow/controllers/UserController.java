package com.renatoguii.faturaflow.controllers;

import com.renatoguii.faturaflow.dtos.user.AutheticationDTO;
import com.renatoguii.faturaflow.dtos.user.UserRegisterDTO;
import com.renatoguii.faturaflow.entities.user.UserEntity;
import com.renatoguii.faturaflow.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/user")
@Tag(name = "User", description = "Gerenciamento de usuários")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping
    @Operation(summary = "Listar todos os usuários", description = "Retorna uma lista de todos os usuários cadastrados")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        List<UserEntity> users = userService.getAllUsers();
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar usuário por ID", description = "Retorna os detalhes de um usuário específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário encontrado",
                    content = @Content(schema = @Schema(implementation = UserEntity.class))),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<UserEntity> getUserById(
            @Parameter(description = "ID do usuário", required = true) @PathVariable(value = "id") String id) {
        UserEntity user = userService.getUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar um novo usuário", description = "Cria um novo usuário no sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos")
    })
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRegisterDTO data) {
        Boolean itsSaved = userService.saveUser(data);
        if (itsSaved) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuário registrado com sucesso!");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao registrar usuário!");
    }

    @PostMapping("/auth")
    @Operation(summary = "Autenticar usuário", description = "Autentica um usuário e retorna um token JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Autenticação bem-sucedida"),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    })
    public ResponseEntity authenticate(@Valid @RequestBody AutheticationDTO data) throws AuthenticationException {
        var token = userService.authenticate(data);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(token);
    }
}