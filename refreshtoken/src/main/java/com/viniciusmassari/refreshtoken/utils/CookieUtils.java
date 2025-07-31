package com.viniciusmassari.refreshtoken.utils;

import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Service;

@Service
public class CookieUtils {
    public final String COOKIE_NAME = "refreshtokenapp";

    public Cookie createCookie(String token) {
        Cookie cookie = new Cookie(this.COOKIE_NAME, token);
        cookie.setPath("/");
        cookie.setSecure(false);
        cookie.setHttpOnly(true);
        return cookie;
    }

    public Cookie expireCookie() {
        Cookie expiredCookie = new Cookie("refreshtokenapp", null);
        expiredCookie.setHttpOnly(true);
        expiredCookie.setPath("/");
        expiredCookie.setMaxAge(0);
        return expiredCookie;
    }
}
