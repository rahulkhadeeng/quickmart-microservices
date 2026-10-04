package com.shiwansh.product;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping({"/products", "/api/admin/uploads", "/admin/uploads"})
public class ProductUploadController {

    private static final int MAX_IMAGES = 5;
    private static final long MAX_IMAGE_SIZE = 8L * 1024 * 1024; // 8MB

    private final String uploadThingToken;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public ProductUploadController(
            @Value("${UPLOADTHING_TOKEN:${uploadthing.token:}}") String uploadThingToken,
            ObjectMapper objectMapper) {
        this.uploadThingToken = uploadThingToken != null ? uploadThingToken.trim() : "";
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
    }

    @PostMapping(value = {"/upload-images", "/product-images"}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProductImages(
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestPart(value = "file", required = false) MultipartFile singleFile) {

        List<MultipartFile> fileList = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            fileList.addAll(files);
        }
        if (singleFile != null && !singleFile.isEmpty()) {
            fileList.add(singleFile);
        }

        if (fileList.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please select at least one image file to upload."));
        }

        if (fileList.size() > MAX_IMAGES) {
            return ResponseEntity.badRequest().body(Map.of("error", "You can upload a maximum of " + MAX_IMAGES + " images at once."));
        }

        try {
            List<String> urls = new ArrayList<>();
            for (MultipartFile file : fileList) {
                validateImage(file);
                String uploadedUrl = processUpload(file);
                urls.add(uploadedUrl);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("urls", urls);
            response.put("url", urls.get(0));
            response.put("count", urls.size());
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", ex.getMessage() == null ? "Failed to upload image." : ex.getMessage()));
        }
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadSingleProductImage(@RequestPart("file") MultipartFile file) {
        return uploadProductImages(null, file);
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Selected file is empty.");
        }
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("File '" + file.getOriginalFilename() + "' exceeds maximum 8 MB limit.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("File '" + file.getOriginalFilename() + "' is not a valid image. Only JPEG, PNG, WEBP, and GIF are supported.");
        }
    }

    private String processUpload(MultipartFile file) throws Exception {
        if (isUploadThingConfigured()) {
            try {
                return uploadToUploadThing(file);
            } catch (Exception ex) {
                System.err.println("UploadThing remote upload error: " + ex.getMessage() + ". Falling back to embedded Data URL.");
                return convertToDataUrl(file);
            }
        }
        // Dev / local fallback when no token configured
        return convertToDataUrl(file);
    }

    private boolean isUploadThingConfigured() {
        return !uploadThingToken.isBlank() && !uploadThingToken.equalsIgnoreCase("dummy") && !uploadThingToken.contains("dummy");
    }

    private String uploadToUploadThing(MultipartFile file) throws Exception {
        String apiKey = extractApiKey(uploadThingToken);
        String safeFilename = safeName(file);

        Map<String, Object> preparePayload = new HashMap<>();
        preparePayload.put("fileType", file.getContentType() != null ? file.getContentType() : "image/jpeg");
        preparePayload.put("fileName", safeFilename);
        preparePayload.put("fileSize", file.getSize());
        preparePayload.put("acl", "public-read");

        String requestJson = objectMapper.writeValueAsString(preparePayload);

        HttpRequest prepareRequest = HttpRequest.newBuilder(URI.create("https://api.uploadthing.com/v7/prepareUpload"))
                .header("Content-Type", "application/json")
                .header("X-Uploadthing-Api-Key", apiKey)
                .header("X-Uploadthing-Fe-Package", "quickmart-spring")
                .header("X-Uploadthing-Version", "7.7.4")
                .timeout(Duration.ofSeconds(15))
                .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                .build();

        HttpResponse<String> prepareResponse = httpClient.send(prepareRequest, HttpResponse.BodyHandlers.ofString());

        if (prepareResponse.statusCode() / 100 != 2) {
            throw new IllegalStateException("UploadThing prepare upload failed with HTTP status " + prepareResponse.statusCode() + ": " + prepareResponse.body());
        }

        JsonNode preparedJson = objectMapper.readTree(prepareResponse.body());
        String signedUrl = preparedJson.path("url").asText();
        if (signedUrl.isBlank()) {
            throw new IllegalStateException("UploadThing did not return an upload URL.");
        }

        String boundary = "QuickMartUpload" + UUID.randomUUID().toString().replace("-", "");
        byte[] multipartBody = createMultipartPayload(boundary, file, safeFilename);

        HttpRequest uploadRequest = HttpRequest.newBuilder(URI.create(signedUrl))
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .timeout(Duration.ofSeconds(30))
                .PUT(HttpRequest.BodyPublishers.ofByteArray(multipartBody))
                .build();

        HttpResponse<String> uploadResponse = httpClient.send(uploadRequest, HttpResponse.BodyHandlers.ofString());
        if (uploadResponse.statusCode() / 100 != 2) {
            throw new IllegalStateException("UploadThing file binary transfer failed with status " + uploadResponse.statusCode());
        }

        try {
            JsonNode uploadedJson = objectMapper.readTree(uploadResponse.body());
            String directUrl = uploadedJson.path("url").asText(uploadedJson.path("data").path("url").asText());
            if (!directUrl.isBlank()) {
                return directUrl;
            }
        } catch (Exception ignored) {}

        String key = preparedJson.path("key").asText(preparedJson.path("fileKey").asText());
        if (!key.isBlank()) {
            return "https://utfs.io/f/" + key;
        }

        throw new IllegalStateException("Could not resolve uploaded image URL from UploadThing response.");
    }

    private static byte[] createMultipartPayload(String boundary, MultipartFile file, String filename) throws Exception {
        ByteArrayOutputStream body = new ByteArrayOutputStream();
        String header = "--" + boundary + "\r\n"
                + "Content-Disposition: form-data; name=\"file\"; filename=\"" + filename + "\"\r\n"
                + "Content-Type: " + (file.getContentType() != null ? file.getContentType() : "application/octet-stream") + "\r\n\r\n";

        body.write(header.getBytes(StandardCharsets.UTF_8));
        body.write(file.getBytes());
        body.write(("\r\n--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));
        return body.toByteArray();
    }

    private String extractApiKey(String token) {
        try {
            String encoded = token.startsWith("ey") ? token : token.substring(token.indexOf('.') + 1);
            if (encoded.contains(".")) {
                encoded = encoded.split("\\.")[0];
            }
            byte[] decoded = Base64.getUrlDecoder().decode(encoded);
            JsonNode jsonNode = objectMapper.readTree(new String(decoded, StandardCharsets.UTF_8));
            String apiKey = jsonNode.path("apiKey").asText();
            if (!apiKey.isBlank()) {
                return apiKey;
            }
        } catch (Exception ignored) {}

        // If token is already raw api key
        if (!token.startsWith("ey") && token.length() > 20) {
            return token;
        }

        throw new IllegalStateException("The configured UPLOADTHING_TOKEN is invalid. Please copy the V7 token from the UploadThing dashboard.");
    }

    private String convertToDataUrl(MultipartFile file) throws Exception {
        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String mimeType = file.getContentType() != null ? file.getContentType() : "image/jpeg";
        return "data:" + mimeType + ";base64," + base64;
    }

    private static String safeName(MultipartFile file) {
        String name = file.getOriginalFilename();
        if (name == null || name.isBlank()) {
            return "product-image-" + System.currentTimeMillis() + ".jpg";
        }
        return name.replaceAll("[^a-zA-Z0-9._-]", "-");
    }
}
