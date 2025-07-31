package com.viniciusmassari.refreshtoken.modules.user;

import com.viniciusmassari.refreshtoken.modules.user.dtos.GetUserByEmailResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GetUserByEmailUseCase {
    @Autowired
    private UserRepository userRepository;

    public GetUserByEmailResponseDTO execute(String email) {
        Optional<UserEntity> foundUser = this.userRepository.findByEmail(email);
        return foundUser.map(userEntity -> new GetUserByEmailResponseDTO(userEntity.getEmail())).orElseGet(() -> new GetUserByEmailResponseDTO(null));
    }
}
