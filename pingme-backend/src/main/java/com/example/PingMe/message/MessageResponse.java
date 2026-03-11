package com.example.PingMe.message;

import java.time.LocalDateTime;

public class MessageResponse {

    private Long id;
    private String content;
    private MessageType type;
    private MessageState state;
    private String senderId;
    private String receiverId;
    private LocalDateTime createdAt;
    private byte[] media;
    private String fileName;
    private String mimeType;
    private Long fileSize;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public MessageType getType() { return type; }
    public void setType(MessageType type) { this.type = type; }
    public MessageState getState() { return state; }
    public void setState(MessageState state) { this.state = state; }
    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public byte[] getMedia() { return media; }
    public void setMedia(byte[] media) { this.media = media; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    private MessageResponse(Builder builder) {
        this.id = builder.id;
        this.content = builder.content;
        this.type = builder.type;
        this.state = builder.state;
        this.senderId = builder.senderId;
        this.receiverId = builder.receiverId;
        this.createdAt = builder.createdAt;
        this.media = builder.media;
        this.fileName = builder.fileName;
        this.mimeType = builder.mimeType;
        this.fileSize = builder.fileSize;
    }

    public MessageResponse() {}
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String content;
        private MessageType type;
        private MessageState state;
        private String senderId;
        private String receiverId;
        private LocalDateTime createdAt;
        private byte[] media;
        private String fileName;
        private String mimeType;
        private Long fileSize;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder content(String content) { this.content = content; return this; }
        public Builder type(MessageType type) { this.type = type; return this; }
        public Builder state(MessageState state) { this.state = state; return this; }
        public Builder senderId(String senderId) { this.senderId = senderId; return this; }
        public Builder receiverId(String receiverId) { this.receiverId = receiverId; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder media(byte[] media) { this.media = media; return this; }
        public Builder fileName(String fileName) { this.fileName = fileName; return this; }
        public Builder mimeType(String mimeType) { this.mimeType = mimeType; return this; }
        public Builder fileSize(Long fileSize) { this.fileSize = fileSize; return this; }

        public MessageResponse build() { return new MessageResponse(this); }
    }
}
