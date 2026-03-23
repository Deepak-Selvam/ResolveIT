package com.resolveit.exception;

import com.resolveit.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse.Error> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(401)
                .body(new ApiResponse.Error(false, "Invalid email or password", 401));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse.Error> handleIllegalArg(IllegalArgumentException ex) {
        return ResponseEntity.status(400)
                .body(new ApiResponse.Error(false, ex.getMessage(), 400));
    }

    @ExceptionHandler(java.util.NoSuchElementException.class)
    public ResponseEntity<ApiResponse.Error> handleNotFound(java.util.NoSuchElementException ex) {
        return ResponseEntity.status(404)
                .body(new ApiResponse.Error(false, "Resource not found", 404));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse.Error> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(400).body(new ApiResponse.Error(false, msg, 400));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse.Error> handleGeneral(Exception ex) {
        return ResponseEntity.status(500)
                .body(new ApiResponse.Error(false, "Internal server error: " + ex.getMessage(), 500));
    }
}
