package com.renatoguii.faturaflow.exceptions;

public class InvalidTokenException extends RuntimeException{

    public InvalidTokenException (String msg) {
        super(msg);
    }

}
