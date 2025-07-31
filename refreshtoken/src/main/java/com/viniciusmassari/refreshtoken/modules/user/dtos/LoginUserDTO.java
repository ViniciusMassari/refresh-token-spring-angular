package com.viniciusmassari.refreshtoken.modules.user.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record LoginUserDTO(
        @NotBlank
        @NotNull
        @NotEmpty
        String username,
        @NotBlank
        @NotNull
        @NotEmpty
        String password
) {
}
