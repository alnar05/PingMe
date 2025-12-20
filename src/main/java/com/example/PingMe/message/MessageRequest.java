package com.example.PingMe.message;

public class MessageRequest {

    private String content;
    private String senderId;
    private String receiverId;
    private MessageType type;
    private String chatId;

    // Constructors
    public MessageRequest() {
    }

    public MessageRequest(String content, String senderId, String receiverId, MessageType type, String chatId) {
        this.content = content;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.type = type;
        this.chatId = chatId;
    }


    // Getters, setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }


    // Builder
    private MessageRequest(Builder builder) {
        this.content = builder.content;
        this.senderId = builder.senderId;
        this.receiverId = builder.receiverId;
        this.type = builder.type;
        this.chatId = builder.chatId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String content;
        private String senderId;
        private String receiverId;
        private MessageType type;
        private String chatId;

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public Builder senderId(String senderId) {
            this.senderId = senderId;
            return this;
        }

        public Builder receiverId(String receiverId) {
            this.receiverId = receiverId;
            return this;
        }

        public Builder type(MessageType type) {
            this.type = type;
            return this;
        }

        public Builder chatId(String chatId) {
            this.chatId = chatId;
            return this;
        }

        public MessageRequest build() {
            return new MessageRequest(this);
        }
    }
}
