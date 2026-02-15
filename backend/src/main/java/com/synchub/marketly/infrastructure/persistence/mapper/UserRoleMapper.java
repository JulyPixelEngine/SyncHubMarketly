package com.synchub.marketly.infrastructure.persistence.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserRoleMapper {

    List<String> findRoleNamesByUserId(@Param("userId") Long userId);

    void insertUserRole(@Param("userId") Long userId, @Param("roleName") String roleName);

    void deleteByUserId(@Param("userId") Long userId);
}
