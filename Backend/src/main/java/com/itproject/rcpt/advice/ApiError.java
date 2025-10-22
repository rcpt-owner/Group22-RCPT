package com.itproject.rcpt.advice;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ApiError {
  private Instant timestamp = Instant.now();
  private int status;          // HTTP status code
  private String error;        // HTTP reason phrase
  private String code;         // short machine code, e.g., "VALIDATION_ERROR"
  private String message;      // human message
  private String path;         // request path
  private List<ApiFieldError> errors = new ArrayList<>();

  public ApiError() { }

  public Instant getTimestamp() { return timestamp; }
  public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
  public int getStatus() { return status; }
  public void setStatus(int status) { this.status = status; }
  public String getError() { return error; }
  public void setError(String error) { this.error = error; }
  public String getCode() { return code; }
  public void setCode(String code) { this.code = code; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
  public String getPath() { return path; }
  public void setPath(String path) { this.path = path; }
  public List<ApiFieldError> getErrors() { return errors; }
  public void setErrors(List<ApiFieldError> errors) { this.errors = errors; }
}
