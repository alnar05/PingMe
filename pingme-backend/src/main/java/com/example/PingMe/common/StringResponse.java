package com.example.PingMe.common;

public class StringResponse {

    private String response;

    // Constructors
    public StringResponse() {
    }

    public String getResponse() {
        return response;
    }

    // Getters, setters
    public StringResponse(String response) {
        this.response = response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    // Builder
    private StringResponse(Builder builder) {
        this.response = builder.response;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String response;

        public Builder response(String response) {
            this.response = response;
            return this;
        }

        public StringResponse build() {
            return new StringResponse(this);
        }
    }
}
