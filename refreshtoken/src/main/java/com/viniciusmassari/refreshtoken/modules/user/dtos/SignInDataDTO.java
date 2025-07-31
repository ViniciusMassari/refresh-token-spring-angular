package com.viniciusmassari.refreshtoken.modules.user.dtos;

import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;

public record SignInDataDTO(
        @NotNull
        @NotEmpty
        @Pattern(regexp = "^(?!\\s*$).+", message = "O campo [username] não pode possuir espaços")
        String username,
        @NotNull
        @NotEmpty
        @Email
        String email,
        @NotNull @NotEmpty @NotBlank @Length(min=8,max=60 ,message = "A senha deve conter no mínimo 8 caracteres e no máximo 60") String password
        ) {
}
