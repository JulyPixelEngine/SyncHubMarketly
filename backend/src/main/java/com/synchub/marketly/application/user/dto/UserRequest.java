package com.synchub.marketly.application.user.dto;

public record UserRequest(
        String username,
        String firstName,
        String lastName,
        String email,
        String password,
        String phone
) {
}
