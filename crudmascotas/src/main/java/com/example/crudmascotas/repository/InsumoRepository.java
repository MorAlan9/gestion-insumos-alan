package com.example.crudmascotas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.crudmascotas.model.Insumo;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {
}