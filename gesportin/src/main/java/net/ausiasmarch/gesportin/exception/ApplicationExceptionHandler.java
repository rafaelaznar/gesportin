package net.ausiasmarch.gesportin.exception;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import net.ausiasmarch.gesportin.bean.ExceptionBean;


@ControllerAdvice
public class ApplicationExceptionHandler {

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ExceptionBean> handleDataAccessException(DataAccessException ex) {
        ExceptionBean oExceptionBean = new ExceptionBean(503, "Backend can't access to database", System.currentTimeMillis());
        return new ResponseEntity<>(oExceptionBean, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ExceptionBean> handleRuntimeException(RuntimeException ex) {        
        ExceptionBean oExceptionBean = new ExceptionBean(500, ex.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(oExceptionBean, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionBean> handleResourceNotFoundException(ResourceNotFoundException ex) {        
        ExceptionBean oExceptionBean = new ExceptionBean(404, ex.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(oExceptionBean, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ExceptionBean> handleUnauthorizedException(UnauthorizedException ex) {        
        ExceptionBean oExceptionBean = new ExceptionBean(403, ex.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(oExceptionBean, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ResourceNotModifiedException.class)
    public ResponseEntity<ExceptionBean> handleResourceNotModifiedException(ResourceNotModifiedException ex) {        
        ExceptionBean oExceptionBean = new ExceptionBean(304, ex.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(oExceptionBean, HttpStatus.NOT_MODIFIED);
    }

    @ExceptionHandler(GeneralException.class)
    public ResponseEntity<ExceptionBean> handleGeneralException(GeneralException ex) {        
        ExceptionBean oExceptionBean = new ExceptionBean(500, ex.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(oExceptionBean, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
