import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';


export interface Insumo {
  id?: number;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
}

function App() {
  const apiUrl = 'http://localhost:8083/api/v1/insumos';

  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [formData, setFormData] = useState<Insumo>({
    nombre: '',
    categoria: '',
    stock: 0,
    precio: 0
  });

  
  const cargarDatos = () => {
    axios.get(apiUrl)
      .then(response => setInsumos(response.data))
      .catch(error => {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'El backend no responde.' });
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      axios.put(`${apiUrl}/${editingId}`, formData)
        .then(() => {
          Swal.fire({ icon: 'success', title: '¡Actualizado!', timer: 1500, showConfirmButton: false });
          cargarDatos();
          cancelarEdicion();
        })
        .catch(() => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar.' }));
    } else {
      axios.post(apiUrl, formData)
        .then(() => {
          Swal.fire({ icon: 'success', title: '¡Guardado!', timer: 1500, showConfirmButton: false });
          cargarDatos();
          cancelarEdicion();
        })
        .catch(() => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar.' }));
    }
  };

  const editarInsumo = (insumo: Insumo) => {
    setEditingId(insumo.id!);
    setFormData({ nombre: insumo.nombre, categoria: insumo.categoria, stock: insumo.stock, precio: insumo.precio });
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setFormData({ nombre: '', categoria: '', stock: 0, precio: 0 });
  };

  const eliminarInsumo = (id: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No vas a poder revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#212529', 
      cancelButtonColor: '#6c757d', 
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${apiUrl}/${id}`)
          .then(() => {
            Swal.fire('¡Borrado!', 'El insumo fue eliminado.', 'success');
            cargarDatos();
          })
          .catch(() => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar.' }));
      }
    });
  };

 
  const totalInversion = insumos.reduce((acc, insumo) => acc + (insumo.stock * insumo.precio), 0);
  const totalArticulos = insumos.length;

  
  const insumosFiltrados = insumos.filter(insumo => 
    insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    insumo.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4 mb-5 text-dark">
      <h1 className="text-center mb-4 fw-bold text-dark">Gestión de Insumos</h1>

      {}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card bg-white border shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0 text-secondary">Total Invertido</h5>
                <small className="text-muted">Capital en mercadería</small>
              </div>
              <h3 className="mb-0 fw-bold">${totalInversion.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-6 mt-3 mt-md-0">
          <div className="card bg-white border shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0 text-secondary">Artículos Registrados</h5>
                <small className="text-muted">En la base de datos</small>
              </div>
              <h3 className="mb-0 fw-bold">{totalArticulos}</h3>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="card shadow-sm mb-4 border bg-white">
        <div className="card-body">
          <h5 className="card-title mb-3 text-dark fw-bold">
            {editingId ? '✏️ Editar Insumo' : ' Agregar Insumo Nuevo'}
          </h5>
          <form onSubmit={handleSubmit} className="row g-3 align-items-center">
            <div className="col-md-3">
              <input type="text" className="form-control" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" name="categoria" placeholder="Categoría" value={formData.categoria} onChange={handleChange} required />
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control" name="stock" placeholder="Stock" value={formData.stock || ''} onChange={handleChange} required />
            </div>
            <div className="col-md-2">
              <input type="number" step="0.01" className="form-control" name="precio" placeholder="Precio ($)" value={formData.precio || ''} onChange={handleChange} required />
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className={editingId ? "btn btn-secondary w-100 fw-bold" : "btn btn-dark w-100 fw-bold"}>
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary w-100" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {}
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control form-control-lg shadow-sm border" 
          placeholder=" Buscar insumo por nombre o categoría..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {}
      <div className="table-responsive shadow-sm rounded border">
        <table className="table table-hover table-bordered mb-0 align-middle bg-white">
          <thead className="table-light text-center text-secondary">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {insumosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">No se encontraron insumos.</td>
              </tr>
            ) : (
              insumosFiltrados.map((insumo) => (
                <tr key={insumo.id} className="text-center">
                  <td className="fw-bold text-secondary">{insumo.id}</td>
                  <td>{insumo.nombre}</td>
                  <td><span className="badge bg-light text-dark border">{insumo.categoria}</span></td>
                  <td>
                    <span className={insumo.stock < 5 ? "text-danger fw-bold" : ""}>
                      {insumo.stock}
                    </span>
                    {insumo.stock < 5 && <span className="badge bg-danger ms-2">¡Reponer!</span>}
                  </td>
                  <td>${insumo.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <button className="btn btn-outline-secondary btn-sm me-2 fw-bold" onClick={() => editarInsumo(insumo)}>
                      Editar
                    </button>
                    <button className="btn btn-outline-danger btn-sm fw-bold" onClick={() => eliminarInsumo(insumo.id!)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;