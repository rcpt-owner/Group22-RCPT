package com.itproject.rcpt.advice;

import java.util.NoSuchElementException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.context.request.ServletWebRequest;

import org.springframework.orm.ObjectOptimisticLockingFailureException;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler {

  // ---- 422 Unprocessable Entity: Bean validation on @RequestBody / @Validated ----
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                               ServletWebRequest req) {
    ApiError body = base(HttpStatus.UNPROCESSABLE_ENTITY, "VALIDATION_ERROR", "Validation failed", req);
    for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
      body.getErrors().add(new ApiFieldError(fe.getField(), fe.getDefaultMessage()));
    }
    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(body);
  }

  // For @Validated on query/path params
  @ExceptionHandler({ ConstraintViolationException.class, BindException.class })
  public ResponseEntity<ApiError> handleConstraintViolation(Exception ex, ServletWebRequest req) {
    ApiError body = base(HttpStatus.UNPROCESSABLE_ENTITY, "VALIDATION_ERROR", "Validation failed", req);
    if (ex instanceof ConstraintViolationException cve) {
      for (ConstraintViolation<?> v : cve.getConstraintViolations()) {
        body.getErrors().add(new ApiFieldError(v.getPropertyPath().toString(), v.getMessage()));
      }
    } else if (ex instanceof BindException be) {
      be.getBindingResult().getFieldErrors()
        .forEach(fe -> body.getErrors().add(new ApiFieldError(fe.getField(), fe.getDefaultMessage())));
    }
    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(body);
  }

  // ---- 400 Bad Request: malformed JSON, type mismatch, missing params ----
  @ExceptionHandler({
      HttpMessageNotReadableException.class,
      MethodArgumentTypeMismatchException.class,
      MissingServletRequestParameterException.class,
      IllegalArgumentException.class
  })
  public ResponseEntity<ApiError> handleBadRequest(Exception ex, ServletWebRequest req) {
    String msg = switch (ex) {
      case HttpMessageNotReadableException e -> "Malformed request body";
      case MethodArgumentTypeMismatchException e -> "Parameter type mismatch";
      case MissingServletRequestParameterException e -> "Missing required parameter";
      default -> ex.getMessage();
    };
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(base(HttpStatus.BAD_REQUEST, "BAD_REQUEST", msg, req));
  }

  // ---- 404 Not Found ----
  @ExceptionHandler(NoSuchElementException.class)
  public ResponseEntity<ApiError> handleNotFound(NoSuchElementException ex, ServletWebRequest req) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(base(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage() != null ? ex.getMessage() : "Resource not found", req));
  }

  // ---- 405 Method Not Allowed ----
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ApiError> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex, ServletWebRequest req) {
    String allowed = ex.getSupportedHttpMethods() != null
        ? ex.getSupportedHttpMethods().stream().map(HttpMethod::name).reduce((a,b)->a+", "+b).orElse("")
        : "";
    ApiError body = base(HttpStatus.METHOD_NOT_ALLOWED, "METHOD_NOT_ALLOWED",
        "Method not allowed. Allowed: " + allowed, req);
    return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(body);
  }

  // ---- 409 Conflict: duplicate key, optimistic locking ----
  @ExceptionHandler({ DuplicateKeyException.class, ObjectOptimisticLockingFailureException.class })
  public ResponseEntity<ApiError> handleConflict(Exception ex, ServletWebRequest req) {
    String code = (ex instanceof DuplicateKeyException) ? "DUPLICATE_KEY" : "OPTIMISTIC_LOCK";
    String msg  = (ex instanceof DuplicateKeyException) ? "Duplicate key constraint violated" : "Concurrent update conflict";
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(base(HttpStatus.CONFLICT, code, msg, req));
  }

  // ---- 403 Forbidden (when you add Spring Security) ----
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex, ServletWebRequest req) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(base(HttpStatus.FORBIDDEN, "FORBIDDEN", "Access is denied", req));
  }

  // ---- 500 Fallback ----
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> handleUnhandled(Exception ex, ServletWebRequest req) {
    ApiError body = base(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "Unexpected error", req);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }

  // ---- helpers ----
  private ApiError base(HttpStatus status, String code, String message, ServletWebRequest req) {
    ApiError e = new ApiError();
    e.setStatus(status.value());
    e.setError(status.getReasonPhrase());
    e.setCode(code);
    e.setMessage(message);
    e.setPath(req.getRequest().getRequestURI());
    return e;
  }
}
