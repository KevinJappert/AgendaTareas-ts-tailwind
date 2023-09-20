export interface Tarea {
    id: string;
    texto: string;
}

// Función para guardar una tarea en el almacenamiento local
export function guardarTareaLocalStorage(tarea: Tarea) {
    let tareas: Tarea[] = cargarTareasDesdeLocalStorage();

    if (!tareas.some((t) => t.texto === tarea.texto)) {
        tareas.push(tarea);
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }
}


// Función para cargar tareas desde el almacenamiento local
export function cargarTareasDesdeLocalStorage(): Tarea[] {
    const tareasString = localStorage.getItem('tareas');
    if (tareasString) {
        const tareas = JSON.parse(tareasString);
        console.log('Tareas cargadas desde el LocalStorage:', tareas);
        return tareas;
    } else {
        return [];
    }
}

export function eliminarTareaLocalStorage(tareaId: string) {
    const tareasGuardadas = cargarTareasDesdeLocalStorage();
    const nuevasTareas = tareasGuardadas.filter((t) => t.id !== tareaId);
    localStorage.setItem('tareas', JSON.stringify(nuevasTareas));
}

// Función para editar una tarea en el almacenamiento local
export function editarTareaLocalStorage(id: string, nuevoTexto: string) {
    const tareasGuardadas = cargarTareasDesdeLocalStorage();

    // Busca la tarea con el ID especificado
    const tareaAEditar = tareasGuardadas.find((t) => t.id === id);

    if (tareaAEditar) {
        // Actualiza el texto de la tarea
        tareaAEditar.texto = nuevoTexto;

        // Guarda las tareas actualizadas en el almacenamiento local
        localStorage.setItem('tareas', JSON.stringify(tareasGuardadas));
    }
}

// Función para eliminar una tarea de la lista y del Local Storage
export function eliminarTareaListaYLocalStorage(tareaId: string) {
    const tareaPadre = document.querySelector(`[data-id="${tareaId}"]`) as HTMLElement;
    if (tareaPadre) {
        tareaPadre.remove();
        eliminarTareaLocalStorage(tareaId);
    }
}

// Función para habilitar la edición de una tarea
export function habilitarEdicionTarea(inputEditar: HTMLInputElement, tareaTexto: HTMLElement) {
    tareaTexto.style.display = 'none';
    inputEditar.style.display = 'inline-block';
    inputEditar.value = tareaTexto.textContent || '';
    inputEditar.focus();
}

// Función para actualizar el texto de una tarea y el Local Storage
export function actualizarTextoTarea(inputEditar: HTMLInputElement, tareaTexto: HTMLElement, tareaId: string) {
    tareaTexto.textContent = inputEditar.value;
    tareaTexto.style.display = 'inline-block';
    inputEditar.style.display = 'none';
    actualizarSeRealizoEdicion(true);

    // Actualizar la tarea en el almacenamiento local
    editarTareaLocalStorage(tareaId, inputEditar.value);
}

// Variable para controlar si se ha realizado una edición
export let seRealizoEdicion: boolean = false;

export function actualizarSeRealizoEdicion(valor: boolean) {
    seRealizoEdicion = valor;
}