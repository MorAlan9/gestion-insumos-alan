package com.example.crudmascotas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.crudmascotas.model.Insumo;
import com.example.crudmascotas.service.InsumoService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/insumos")
@CrossOrigin(origins = "*")
public class InsumoController {
    @Autowired
    private InsumoService service;

    @GetMapping
    public List<Insumo> listar() {
        return service.obtenerTodos();
    }

    @PostMapping
    public Insumo crear(@RequestBody Insumo insumo) {
        return service.guardar(insumo);
    }

    // NUEVO: Ruta para actualizar (PUT)
    @PutMapping("/{id}")
    public Insumo actualizar(@PathVariable Long id, @RequestBody Insumo insumo) {
        insumo.setId(id); // Le clavamos el ID de la URL para que pise el correcto
        return service.guardar(insumo);
    }

    // NUEVO: Ruta para eliminar (DELETE)
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}