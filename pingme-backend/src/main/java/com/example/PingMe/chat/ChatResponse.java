package com.example.PingMe.chat;

import java.time.LocalDateTime;

public class ChatResponse {

    private String id;
    private String name;
    private long unreadCount;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private boolean isRecipientOnline;
    private String senderId;
    private String receiverId;

    // Constructors
    public ChatResponse() {
    }

    public ChatResponse(String id, String name, long unreadCount, String lastMessage, LocalDateTime lastMessageTime, boolean isRecipientOnline, String senderId, String receiverId) {
        this.id = id;
        this.name = name;
        this.unreadCount = unreadCount;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.isRecipientOnline = isRecipientOnline;
        this.senderId = senderId;
        this.receiverId = receiverId;
    }


    // Getters, Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public long getUnreadCount() {
        return unreadCount;
    }
    public void setUnreadCount(long unreadCount) {
        this.unreadCount = unreadCount;
    }
    public String getLastMessage() {
        return lastMessage;
    }
    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }
    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }
    public void setLastMessageTime(LocalDateTime lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }
    public boolean isRecipientOnline() {
        return isRecipientOnline;
    }
    public void setRecipientOnline(boolean recipientOnline) {
        isRecipientOnline = recipientOnline;
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

    // Builder
    private ChatResponse(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.unreadCount = builder.unreadCount;
        this.lastMessage = builder.lastMessage;
        this.lastMessageTime = builder.lastMessageTime;
        this.isRecipientOnline = builder.isRecipientOnline;
        this.senderId = builder.senderId;
        this.receiverId = builder.receiverId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private long unreadCount;
        private String lastMessage;
        private LocalDateTime lastMessageTime;
        private boolean isRecipientOnline;
        private String senderId;
        private String receiverId;

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder unreadCount(long unreadCount) {
            this.unreadCount = unreadCount;
            return this;
        }

        public Builder lastMessage(String lastMessage) {
            this.lastMessage = lastMessage;
            return this;
        }

        public Builder lastMessageTime(LocalDateTime lastMessageTime) {
            this.lastMessageTime = lastMessageTime;
            return this;
        }

        public Builder isRecipientOnline(boolean recipientOnline) {
            isRecipientOnline = recipientOnline;
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

        public ChatResponse build() {
            return new ChatResponse(this);
        }
    }

}
