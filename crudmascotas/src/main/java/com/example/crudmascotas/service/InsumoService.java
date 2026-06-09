package com.example.crudmascotas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.crudmascotas.model.Insumo;
import com.example.crudmascotas.repository.InsumoRepository;

import java.util.List;

@Service
public class InsumoService {
    @Autowired
    private InsumoRepository repository;

    public List<Insumo> obtenerTodos() {
        return repository.findAll();
    }

    public Insumo guardar(Insumo insumo) {
        return repository.save(insumo); // Sirve tanto para crear como para actualizar
    }

    // NUEVO: Método para eliminar de la base de datos
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}