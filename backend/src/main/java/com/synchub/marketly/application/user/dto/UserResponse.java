package com.synchub.marketly.application.user.dto;

import com.synchub.marketly.domain.user.User;

import java.time.LocalDateTime;
import java.util.List;

public record UserResponse(
        Long id,
        String username,
        String firstName,
        String lastName,
        String email,
        String phone,
        Boolean isActive,
        List<String> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getIsActive(),
                List.of(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    public static UserResponse from(User user, List<String> roles) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getIsActive(),
                roles,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
