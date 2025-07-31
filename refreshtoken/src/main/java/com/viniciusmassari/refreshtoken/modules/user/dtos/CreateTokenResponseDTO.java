package com.viniciusmassari.refreshtoken.modules.user.dtos;

import jakarta.servlet.http.Cookie;

public record CreateTokenResponseDTO(String jwt, Cookie cookie) {
}
