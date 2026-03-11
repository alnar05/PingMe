package com.example.PingMe.file;

import jakarta.annotation.Nonnull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static java.io.File.separator;
import static java.lang.System.currentTimeMillis;

@Service
public class FileService {
    private static final Logger log = LoggerFactory.getLogger(FileService.class);
    private static final long MAX_FILE_SIZE_BYTES = 100L * 1024L * 1024L;

    @Value("${application.file.uploads.media-output-path}")
    private String fileUploadPath;

    public SavedFile saveFile(@Nonnull MultipartFile sourceFile, @Nonnull String userId) {
        validateFile(sourceFile);
        final String fileUploadSubPath = "users" + separator + userId;
        return uploadFile(sourceFile, fileUploadSubPath);
    }

    private SavedFile uploadFile(@Nonnull MultipartFile sourceFile, @Nonnull String fileUploadSubPath) {
        final String finalUploadPath = fileUploadPath + separator + fileUploadSubPath;
        File targetFolder = new File(finalUploadPath);

        if (!targetFolder.exists() && !targetFolder.mkdirs()) {
            log.warn("Failed to create the target folder: {}", targetFolder);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create upload folder");
        }

        final String fileExtension = getFileExtension(sourceFile.getOriginalFilename());
        String targetFilePath = finalUploadPath + separator + currentTimeMillis() + (fileExtension.isEmpty() ? "" : "." + fileExtension);
        Path targetPath = Paths.get(targetFilePath);
        try {
            Files.write(targetPath, sourceFile.getBytes());
            log.info("File saved to: {}", targetFilePath);
            return new SavedFile(targetFilePath, sourceFile.getOriginalFilename(), sourceFile.getContentType(), sourceFile.getSize());
        } catch (IOException e) {
            log.error("File was not saved", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File was not saved");
        }
    }

    private void validateFile(MultipartFile sourceFile) {
        if (sourceFile.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot upload empty file");
        }
        if (sourceFile.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Max file size is 100MB");
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return "";
        }
        return fileName.substring(lastDotIndex + 1).toLowerCase();
    }

    public record SavedFile(String path, String fileName, String mimeType, long fileSize) {}
}
