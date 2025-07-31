package com.viniciusmassari.refreshtoken.modules.user.dtos;

import java.util.UUID;

public record CreateTokenDTO(String username, String email, UUID userId) {

}
