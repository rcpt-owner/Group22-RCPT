package com.ITProject.RCPT.JPA.Repositories;

import com.ITProject.RCPT.JPA.Entities.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegionRepository extends JpaRepository<Region, String> {
    Optional<Region> findByRegionCode(String regionCode);
    boolean existsByRegionCode(String regionCode);
    Region getByName(String name);
}