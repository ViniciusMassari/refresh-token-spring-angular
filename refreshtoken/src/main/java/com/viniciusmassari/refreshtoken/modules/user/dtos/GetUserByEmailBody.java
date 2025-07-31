package com.viniciusmassari.refreshtoken.modules.user.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record GetUserByEmailBody(@NotEmpty @NotNull @NotBlank @Email String email) {
}
