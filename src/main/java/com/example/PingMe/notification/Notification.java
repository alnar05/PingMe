package com.example.PingMe.notification;

import com.example.PingMe.message.MessageType;

public class Notification {

    private String chatId;
    private String content;
    private String senderId;
    private String receiverId;
    private String chatName;
    private MessageType messageType;
    private NotificationType type;
    private byte[] media;

    // Constructors

    public Notification() {
    }

    public Notification(String chatId, String content, String senderId, String receiverId, String chatName, MessageType messageType, NotificationType type, byte[] media) {
        this.chatId = chatId;
        this.content = content;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.chatName = chatName;
        this.messageType = messageType;
        this.type = type;
        this.media = media;
    }


    // Getters, setters
    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

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

    public String getChatName() {
        return chatName;
    }

    public void setChatName(String chatName) {
        this.chatName = chatName;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public byte[] getMedia() {
        return media;
    }

    public void setMedia(byte[] media) {
        this.media = media;
    }


    // Builder
    private Notification(Builder builder) {
        this.chatId = builder.chatId;
        this.content = builder.content;
        this.senderId = builder.senderId;
        this.receiverId = builder.receiverId;
        this.chatName = builder.chatName;
        this.messageType = builder.messageType;
        this.type = builder.type;
        this.media = builder.media;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String chatId;
        private String content;
        private String senderId;
        private String receiverId;
        private String chatName;
        private MessageType messageType;
        private NotificationType type;
        private byte[] media;

        public Builder chatId(String chatId) {
            this.chatId = chatId;
            return this;
        }

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

        public Builder chatName(String chatName) {
            this.chatName = chatName;
            return this;
        }

        public Builder messageType(MessageType messageType) {
            this.messageType = messageType;
            return this;
        }

        public Builder type(NotificationType type) {
            this.type = type;
            return this;
        }

        public Builder media(byte[] media) {
            this.media = media;
            return this;
        }

        public Notification build() {
            return new Notification(this);
        }
    }
}
