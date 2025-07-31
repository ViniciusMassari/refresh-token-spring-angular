package com.viniciusmassari.refreshtoken.utils;

import com.viniciusmassari.refreshtoken.modules.user.dtos.CreateTokenDTO;
import com.viniciusmassari.refreshtoken.modules.user.dtos.CreateTokenResponseDTO;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class JWTUtils {

    @Autowired
    private CookieUtils cookieUtils;

    private final SignatureAlgorithm signatureAlgorithm = Jwts.SIG.RS256;

    public CreateTokenResponseDTO createToken(CreateTokenDTO createToken) throws Exception {
        List<String> roles = List.of("USER");
        Map<String, Object> claims = new TreeMap<>();
        claims.put("username", createToken.username());
        claims.put("email", createToken.email());
        claims.put("roles", roles);
        var expirationInstant = Instant.now().plusSeconds(10);
        Date expiration = Date.from(expirationInstant);
        String jwt = Jwts.builder()
                .subject(createToken.userId().toString())
                .signWith(getPrivateKey(), signatureAlgorithm)
                .claims(claims)
                .issuer("refreshtokenapp")
                .issuedAt(new Date())
                .expiration(expiration)
                .compact();
        Cookie refreshTokenCookie = createRefreshToken(createToken);
        return new CreateTokenResponseDTO(jwt, refreshTokenCookie);
    }

    public Cookie createRefreshToken(CreateTokenDTO createToken) throws Exception {
        var expirationInstant = Instant.now().plus(1, ChronoUnit.DAYS);
        Date expiration = Date.from(expirationInstant);
        String refreshToken = Jwts.builder().subject(createToken.userId().toString()).signWith(getPrivateKey(), signatureAlgorithm).expiration(expiration).compact();
        return this.cookieUtils.createCookie(refreshToken);
    }


    public boolean isRefreshTokenExpired(String token) throws Exception {
        var tokenParser = Jwts.parser().verifyWith(getPublicKey()).build().parseSignedClaims(token);
        Date expirationTime = tokenParser.getPayload().getExpiration();
        return expirationTime.before(new Date());
    }


    public String extractSubjectFromToken(String token) throws Exception {
        var tokenParser = Jwts.parser().verifyWith(getPublicKey()).build().parseSignedClaims(token);
        return tokenParser.getPayload().getSubject();
    }


    private RSAPrivateKey getPrivateKey() throws Exception {
        return (RSAPrivateKey) getKey("private_key.pem", true);
    }


    public RSAPublicKey getPublicKey() throws Exception {
        return (RSAPublicKey) getKey("public_key.pem", false);
    }

    private Object getKey(String filename, boolean isPrivate) throws Exception {
        try (InputStream keyStream = getClass().getClassLoader().getResourceAsStream(filename)) {
            if (keyStream == null) {
                throw new FileNotFoundException("Key file not found: " + filename);
            }

            String keyContent = new String(keyStream.readAllBytes(), StandardCharsets.UTF_8);
            keyContent = keyContent.replaceAll("\\r?\\n", "")
                    .replace("-----BEGIN " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----", "")
                    .replace("-----END " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----", "");

            byte[] encoded = Base64.getDecoder().decode(keyContent);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");

            return isPrivate
                    ? keyFactory.generatePrivate(new PKCS8EncodedKeySpec(encoded))
                    : keyFactory.generatePublic(new X509EncodedKeySpec(encoded));
        }
    }
}
