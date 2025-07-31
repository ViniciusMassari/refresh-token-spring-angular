package com.viniciusmassari.refreshtoken.modules.user;

import com.viniciusmassari.refreshtoken.exceptions.UserAlreadyExists;
import com.viniciusmassari.refreshtoken.modules.user.dtos.SignInDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CreateUserUseCase {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public void execute(SignInDataDTO signInDataDTO) {

        this.userRepository.findByUsername(signInDataDTO.username()).ifPresent((user) -> {
            throw new UserAlreadyExists("User already exists");
        });

        String encryptedPassword = passwordEncoder.encode(signInDataDTO.password());
        UserEntity user = new UserEntity(signInDataDTO.email(), encryptedPassword, signInDataDTO.username());
        userRepository.save(user);
    }
}
