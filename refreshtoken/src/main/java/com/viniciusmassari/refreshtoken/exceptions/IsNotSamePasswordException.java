package com.viniciusmassari.refreshtoken.exceptions;

public class IsNotSamePasswordException extends RuntimeException{
    public IsNotSamePasswordException(String message){
        super(message);
    }
}
