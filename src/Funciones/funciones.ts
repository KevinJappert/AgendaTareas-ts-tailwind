// Función para guardar una tarea en el almacenamiento local
 export function guardarTareaLocalStorage(tarea: string) {
    let tareas: string[] = cargarTareasDesdeLocalStorage();

    if (!tareas.includes(tarea)) {
        tareas.push(tarea);
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }
}

// Función para cargar tareas desde el almacenamiento local
export function cargarTareasDesdeLocalStorage(): string[] {
    const tareasString = localStorage.getItem('tareas');
    if (tareasString) {
        const tareas = JSON.parse(tareasString);
        console.log('Tareas cargadas desde el LocalStorage:', tareas);
        return tareas;
    } else {
        return [];
    }
}

// Función para eliminar una tarea del almacenamiento local
export function eliminarTareaLocalStorage(tarea: string) {
    const tareasGuardadas = cargarTareasDesdeLocalStorage();
    const nuevasTareas = tareasGuardadas.filter((t) => t !== tarea);
    localStorage.setItem('tareas', JSON.stringify(nuevasTareas));
}