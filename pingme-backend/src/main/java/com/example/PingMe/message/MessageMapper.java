package com.example.PingMe.message;

import com.example.PingMe.file.FileService;
import com.example.PingMe.file.FileUtils;
import org.springframework.stereotype.Service;

@Service
public class MessageMapper {

    private final FileService fileService;

    public MessageMapper(FileService fileService) {
        this.fileService = fileService;
    }

    public MessageResponse toMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .type(message.getType())
                .state(message.getState())
                .createdAt(message.getCreatedDate())
                .media(FileUtils.readFileFromLocation(message.getMediaFilePath()))
                .mediaUrl(fileService.resolvePublicMediaUrl(message.getMediaFilePath()))
                .build();
    }
}
