package com.synchub.marketly.application.menu;

import com.synchub.marketly.application.menu.dto.MenuResponse;
import com.synchub.marketly.domain.menu.Menu;
import com.synchub.marketly.infrastructure.persistence.mapper.MenuMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MenuApplicationService {

    private final MenuMapper menuMapper;

    public MenuApplicationService(MenuMapper menuMapper) {
        this.menuMapper = menuMapper;
    }

    public List<MenuResponse> getMenuTree() {
        List<Menu> allMenus = menuMapper.findAllActive();
        return buildTree(allMenus);
    }

    private List<MenuResponse> buildTree(List<Menu> menus) {
        Map<Long, List<Menu>> childrenMap = menus.stream()
                .filter(m -> m.getParentId() != null)
                .collect(Collectors.groupingBy(Menu::getParentId));

        return menus.stream()
                .filter(m -> m.getParentId() == null)
                .map(m -> buildNode(m, childrenMap))
                .toList();
    }

    private MenuResponse buildNode(Menu menu, Map<Long, List<Menu>> childrenMap) {
        List<Menu> children = childrenMap.getOrDefault(menu.getId(), new ArrayList<>());
        List<MenuResponse> childResponses = children.stream()
                .map(c -> buildNode(c, childrenMap))
                .toList();
        return MenuResponse.from(menu, childResponses);
    }
}
