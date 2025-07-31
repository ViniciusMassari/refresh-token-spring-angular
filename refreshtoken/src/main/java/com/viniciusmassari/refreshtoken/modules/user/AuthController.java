package com.viniciusmassari.refreshtoken.modules.user;

import com.viniciusmassari.refreshtoken.exceptions.ErrorResponseDTO;
import com.viniciusmassari.refreshtoken.exceptions.UserAlreadyExists;
import com.viniciusmassari.refreshtoken.exceptions.UserNotFound;
import com.viniciusmassari.refreshtoken.modules.user.dtos.*;
import com.viniciusmassari.refreshtoken.utils.CookieUtils;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.InvalidKeyException;
import java.security.SignatureException;

@RestController()
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private CookieUtils cookieUtils;

    @Value("refreshtokenapp.refreshTokenCookie.name")
    public String cookieName;

    @Autowired
    private CreateUserUseCase createUserUseCase;

    @Autowired
    private RefreshTokenUseCase refreshTokenUseCase;

    @Autowired
    private LoginUserUseCase loginUserUseCase;

    @PostMapping("/signin")
    public ResponseEntity<?> createUser(@Valid @RequestBody SignInDataDTO signInData) {
        try {
            this.createUserUseCase.execute(signInData);
            return ResponseEntity.status(200).build();
        } catch (UserAlreadyExists e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Cannot create a new user" + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Cannot create a new user {}" + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginUserDTO loginUserDTO, HttpServletResponse response) {
        try {
            CreateTokenResponseDTO createTokenResponseDTO = this.loginUserUseCase.execute(loginUserDTO);
            response.addCookie(createTokenResponseDTO.cookie());
            return ResponseEntity.ok().body(new LoginUserResponseDTO(createTokenResponseDTO.jwt()));
        } catch (InvalidKeyException | MalformedJwtException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new ErrorResponseDTO("Cannot log in, try again later"));
        } catch (UsernameNotFoundException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(new ErrorResponseDTO("Error during log in, verify your username and password"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new ErrorResponseDTO("Internal Error, try again later"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue("refreshtokenapp") String cookie, HttpServletResponse response) {
        if (cookie.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Empty token");
        }
        try {
            CreateTokenResponseDTO createTokenResponseDTO = this.refreshTokenUseCase.execute(cookie);
            response.addCookie(createTokenResponseDTO.cookie());
            return ResponseEntity.status(HttpStatus.CREATED).body(new RefreshTokenResponseDTO(createTokenResponseDTO.jwt()));
        } catch (ExpiredJwtException | UserNotFound e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (SignatureException | MalformedJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().body("Internal Error, try again later " + e.getMessage());
        }

    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie expiredCookie = this.cookieUtils.expireCookie();

        response.addCookie(expiredCookie);

        return ResponseEntity.ok("Logout successful");
    }

    @PostMapping("/admin-data")
    @Secured("ROLE_ADMIN")
    public String adminData() {
        return "That route shouldn't be available";
    }


}
