package com.synchub.marketly.infrastructure.persistence.mapper;

import com.synchub.marketly.domain.menu.Menu;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MenuMapper {

    List<Menu> findAllActive();
}
