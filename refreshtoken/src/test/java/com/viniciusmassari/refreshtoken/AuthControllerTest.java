package com.viniciusmassari.refreshtoken;

import com.viniciusmassari.refreshtoken.modules.user.*;
import com.viniciusmassari.refreshtoken.modules.user.dtos.*;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;


import static io.restassured.RestAssured.given;

import static org.hamcrest.Matchers.notNullValue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AuthControllerTest {


    @LocalServerPort
    private int port;

    private final String BASE_URI = "http://localhost";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @BeforeEach
    public void cleanDB() {
        this.userRepository.deleteAll();

    }

    @Test()
    public void should_return_200_for_created_user() {
        SignInDataDTO signIn = new SignInDataDTO("username", "user@email.com", "12345678");
        given().body(signIn).contentType(ContentType.JSON).when().post("http://localhost:" + port + "/auth/signin").then().statusCode(200);
    }

    @Test
    public void should_return_201_and_token() {
        String password = "12345678";
        String encodedPassword = this.passwordEncoder.encode(password);
        UserEntity userEntity = new UserEntity("user@email.com", encodedPassword, "username");
        this.userRepository.saveAndFlush(userEntity);
        LoginUserDTO loginUserDTO = new LoginUserDTO("username", password);
        given().body(loginUserDTO).contentType(ContentType.JSON).when().post("http://localhost:" + port + "/auth/login").then().statusCode(200).body("jwt", notNullValue());
    }


    @Test
    public void should_return_200_and_delete_user() {


        String rawPassword = "12345678";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        UserEntity user = new UserEntity("email@email.com", encodedPassword, "vinicius");
        userRepository.saveAndFlush(user);


        LoginUserDTO loginUserDTO = new LoginUserDTO(user.getUsername(), "12345678");

        String jwtResult = given().body(loginUserDTO).contentType(ContentType.JSON).baseUri("http://localhost").port(port).when().post("/auth/login").then().statusCode(200).body("jwt", notNullValue()).extract().path("jwt");


        given()
                .baseUri("http://localhost")
                .port(port)
                .header("Authorization", "Bearer " + jwtResult)
                .when()
                .delete("/user/delete-user/" + user.getId())
                .then()
                .statusCode(200);


        Optional<UserEntity> deleted = userRepository.findById(user.getId());
        Assertions.assertTrue(deleted.isEmpty(), "Usuário deveria ter sido deletado");
    }


    @Test
    @DisplayName("Should get user by email")
    public void should_return_200_with_user_email() {
        String rawPassword = "12345678";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        UserEntity user = new UserEntity("email@email.com", encodedPassword, "vinicius");
        userRepository.saveAndFlush(user);

        given().body(new GetUserByEmailBody("email@email.com")).baseUri(BASE_URI).port(port).when().get("/user/get-user-by-email/email@email.com").then().statusCode(200).body("email", notNullValue());
    }

}
