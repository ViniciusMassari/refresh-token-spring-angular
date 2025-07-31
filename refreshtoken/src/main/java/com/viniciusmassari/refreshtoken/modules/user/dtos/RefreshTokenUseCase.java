package com.viniciusmassari.refreshtoken.modules.user.dtos;

import com.viniciusmassari.refreshtoken.exceptions.UserNotFound;
import com.viniciusmassari.refreshtoken.modules.user.UserEntity;
import com.viniciusmassari.refreshtoken.modules.user.UserRepository;
import com.viniciusmassari.refreshtoken.utils.JWTUtils;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenUseCase {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JWTUtils jwt;

    public CreateTokenResponseDTO execute(String refreshToken) throws Exception {
        boolean isExpired = this.jwt.isRefreshTokenExpired(refreshToken);
        if (isExpired) throw new ExpiredJwtException(null, null, "Refresh Token expirado");

        String userId = this.jwt.extractSubjectFromToken(refreshToken);
        Optional<UserEntity> user = this.userRepository.findById(UUID.fromString(userId));
        if (user.isEmpty()) throw new UserNotFound("Usuário não encontrado");

        UserEntity foundUser = user.get();

        CreateTokenDTO createTokenDTO = new CreateTokenDTO(foundUser.getUsername(), foundUser.getEmail(), foundUser.getId());


        return this.jwt.createToken(createTokenDTO);

    }

    
}
