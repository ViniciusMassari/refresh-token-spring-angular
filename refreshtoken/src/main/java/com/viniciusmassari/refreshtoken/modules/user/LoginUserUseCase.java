package com.viniciusmassari.refreshtoken.modules.user;

import com.viniciusmassari.refreshtoken.exceptions.IsNotSamePasswordException;
import com.viniciusmassari.refreshtoken.modules.user.dtos.CreateTokenDTO;
import com.viniciusmassari.refreshtoken.modules.user.dtos.CreateTokenResponseDTO;
import com.viniciusmassari.refreshtoken.modules.user.dtos.LoginUserDTO;
import com.viniciusmassari.refreshtoken.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginUserUseCase {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtils jwt;

    public CreateTokenResponseDTO execute(LoginUserDTO loginUser) throws Exception {
        Optional<UserEntity> foundUser = userRepository.findByUsername(loginUser.username());

        if (foundUser.isEmpty()) throw new UsernameNotFoundException("Usuário não encontrado");

        UserEntity user = foundUser.get();

        boolean isSamePassword = passwordEncoder.matches(loginUser.password(), user.getPassword());

        if (!isSamePassword) throw new IsNotSamePasswordException("As senhas não correspondem");

        return this.createToken(new CreateTokenDTO(user.getUsername(), user.getEmail(), user.getId()));
    }


    public CreateTokenResponseDTO createToken(CreateTokenDTO createToken) throws Exception {
        return this.jwt.createToken(createToken);
    }
}
