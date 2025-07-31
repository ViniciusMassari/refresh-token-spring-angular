package com.viniciusmassari.refreshtoken.modules.user.dtos;

import jakarta.servlet.http.Cookie;

public record LoginUserResponseDTO(String jwt) {
}
