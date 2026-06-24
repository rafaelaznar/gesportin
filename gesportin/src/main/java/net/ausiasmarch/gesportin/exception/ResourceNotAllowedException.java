package net.ausiasmarch.gesportin.exception;

public class ResourceNotAllowedException extends RuntimeException{
    public ResourceNotAllowedException(String message) {
        super(message);
    }
}