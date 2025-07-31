package com.viniciusmassari.refreshtoken.modules.user;

import com.viniciusmassari.refreshtoken.exceptions.Unathourized;
import com.viniciusmassari.refreshtoken.modules.user.dtos.GetUserByEmailBody;
import com.viniciusmassari.refreshtoken.modules.user.dtos.GetUserByEmailResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/user")
public class UserController {

    @Autowired
    private DeleteUserUseCase deleteUserUseCase;

    @Autowired
    private GetUserByEmailUseCase getUserByEmailUseCase;

    @GetMapping("/get-user-by-email/{email}")
    public ResponseEntity<?> getUserByEmail(@Valid @Email @PathVariable(name = "email") String userEmail) {

        try {
            GetUserByEmailResponseDTO response = this.getUserByEmailUseCase.execute(userEmail);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Internal server error, try again later " + e.getMessage());
        }
    }

    @GetMapping("/get-resource")
    public ResponseEntity<?> getResource(@CookieValue String refreshtokenapp) {
       
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/delete-user/{id}")
    public ResponseEntity<?> deleteUser(Authentication authentication, @PathVariable(required = true, name = "id") String userToDelete) {
        try {
            this.deleteUserUseCase.execute(userToDelete, authentication.getName());
            return ResponseEntity.ok().build();
        } catch (Unathourized e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Internal error, try again later !");
        }
    }

}
