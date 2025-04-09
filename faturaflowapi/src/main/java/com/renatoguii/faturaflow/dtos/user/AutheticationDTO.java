package com.renatoguii.faturaflow.dtos.user;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.RequestParam;

public record AutheticationDTO(@NotBlank @RequestParam("email") String email,
                               @NotBlank @RequestParam("password") String password) {
}
