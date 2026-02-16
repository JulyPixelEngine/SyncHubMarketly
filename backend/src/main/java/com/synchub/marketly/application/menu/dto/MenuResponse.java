package com.synchub.marketly.application.menu.dto;

import com.synchub.marketly.domain.menu.Menu;

import java.util.ArrayList;
import java.util.List;

public record MenuResponse(
        Long id,
        String menuCode,
        String name,
        String icon,
        Long parentId,
        Integer sortOrder,
        List<MenuResponse> children
) {

    public static MenuResponse from(Menu menu, List<MenuResponse> children) {
        return new MenuResponse(
                menu.getId(),
                menu.getMenuCode(),
                menu.getName(),
                menu.getIcon(),
                menu.getParentId(),
                menu.getSortOrder(),
                children != null ? children : new ArrayList<>()
        );
    }
}
