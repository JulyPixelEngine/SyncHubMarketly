package com.synchub.marketly.presentation.api;

import com.synchub.marketly.application.menu.MenuApplicationService;
import com.synchub.marketly.application.menu.dto.MenuResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    private final MenuApplicationService menuApplicationService;

    public MenuController(MenuApplicationService menuApplicationService) {
        this.menuApplicationService = menuApplicationService;
    }

    @GetMapping
    public ResponseEntity<List<MenuResponse>> getMenuTree() {
        return ResponseEntity.ok(menuApplicationService.getMenuTree());
    }
}
