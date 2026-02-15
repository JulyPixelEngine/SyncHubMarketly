package com.synchub.marketly.application.user;

import com.synchub.marketly.application.user.dto.UserRequest;
import com.synchub.marketly.application.user.dto.UserResponse;
import com.synchub.marketly.domain.user.User;
import com.synchub.marketly.infrastructure.persistence.mapper.UserMapper;
import com.synchub.marketly.infrastructure.persistence.mapper.UserRoleMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserApplicationService {

    private final UserMapper userMapper;
    private final UserRoleMapper userRoleMapper;
    private final PasswordEncoder passwordEncoder;

    public UserApplicationService(UserMapper userMapper, UserRoleMapper userRoleMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.userRoleMapper = userRoleMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> findAll() {
        return userMapper.findAll().stream()
                .map(user -> {
                    List<String> roles = userRoleMapper.findRoleNamesByUserId(user.getId());
                    return UserResponse.from(user, roles);
                })
                .toList();
    }

    public UserResponse findById(Long id) {
        User user = userMapper.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        List<String> roles = userRoleMapper.findRoleNamesByUserId(id);
        return UserResponse.from(user, roles);
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        User user = new User(
                request.username(),
                request.firstName(),
                request.lastName(),
                request.email(),
                passwordEncoder.encode(request.password()),
                request.phone()
        );
        userMapper.insert(user);
        userRoleMapper.insertUserRole(user.getId(), "ROLE_USER");
        List<String> roles = userRoleMapper.findRoleNamesByUserId(user.getId());
        return UserResponse.from(user, roles);
    }

    @Transactional
    public UserResponse update(Long id, UserRequest request) {
        User user = userMapper.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        user.setUsername(request.username());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        userMapper.update(user);
        List<String> roles = userRoleMapper.findRoleNamesByUserId(id);
        return UserResponse.from(user, roles);
    }

    @Transactional
    public void delete(Long id) {
        userMapper.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        userRoleMapper.deleteByUserId(id);
        userMapper.deleteById(id);
    }
}
