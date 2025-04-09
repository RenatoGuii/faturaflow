package com.renatoguii.faturaflow.dtos.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public record UserRegisterDTO(@NotBlank @RequestParam("name") String name,
                              @NotNull @RequestParam("lastName") String lastName,
                              @RequestParam("email") String email,
                              @RequestParam("password") String password) {
}
