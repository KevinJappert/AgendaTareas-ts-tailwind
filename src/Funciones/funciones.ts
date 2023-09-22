import { v4 as uuidv4 } from 'uuid';
import { listaTareaResultado, tareaInput } from '../main';
export interface Tarea {
    id: string;
    texto: string;
}

// Variable para controlar si se ha realizado una edición
export let seRealizoEdicion: boolean = false;

const mensajeParrafo = document.getElementById("mensaje");


// Función para agregar una tarea a la lista
export function agregarTareaALista(tareaInput: string, tareaId: string, listaTareaResultado: HTMLElement) {
    tareaInput = tareaInput.trim();

    const tareasEnLista = Array.from(listaTareaResultado!.children);

    const tareaExistente = tareasEnLista.find((tarea) => tarea.getAttribute('data-id') === tareaId);

    if (!tareaExistente && tareaInput !== '') {
        const nuevaTarea = document.createElement("li");
        nuevaTarea.classList.add("tareaAsignada");

        // Asignar el identificador único a la tarea
        nuevaTarea.setAttribute("data-id", tareaId);

        const tareaTexto = document.createElement('span');
        tareaTexto.textContent = tareaInput;

        const accionesContainer = document.createElement('div');
        accionesContainer.className = 'flex items-center';

        const inputChequeo = document.createElement('input');
        inputChequeo.type = 'checkbox';
        inputChequeo.className = 'w-4 h-4  mr-2 mt-3 text-blue-500';

        let tareaResuelta = false;

        inputChequeo.addEventListener('change', () => {
            tareaResuelta = inputChequeo.checked;

            if (tareaResuelta) {
                nuevaTarea.classList.add('tareaResuelta');
            } else {
                nuevaTarea.classList.remove('tareaResuelta');
            }

            // Guardar el estado del checkbox en el almacenamiento local
            guardarEstadoCheckboxEnLocalStorage(tareaId, tareaResuelta);
        });

        const imgEliminar = document.createElement('img');
        imgEliminar.src = './public/img/eliminar.png';
        imgEliminar.alt = 'Eliminar';
        imgEliminar.className = 'accion-eliminar w-8 h-8 mt-3 mr-2 cursor-pointer';

        imgEliminar.addEventListener('click', () => {
            console.log('Haz hecho clic en el icono de eliminar');
            eliminarTareaListaYLocalStorage(tareaId);
        });

        const imgEditar = document.createElement('img');
        imgEditar.src = './public/img/boligrafo.png';
        imgEditar.alt = 'Editar';
        imgEditar.className = 'accion-editar w-8 h-8 mt-3 cursor-pointer';

        const inputEditar = document.createElement('input');
        inputEditar.type = 'text';
        inputEditar.className = 'hidden';

        inputEditar.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                actualizarTextoTarea(inputEditar, tareaTexto, tareaId);
            }
        });

        imgEditar.addEventListener('click', () => {
            console.log('Haz hecho clic en el icono de editar');
            habilitarEdicionTarea(inputEditar, tareaTexto);
        });

        // Edición de una tarea
        inputEditar.addEventListener('blur', () => {
            actualizarTextoTarea(inputEditar, tareaTexto, tareaId);
        });

        accionesContainer.appendChild(inputChequeo);
        accionesContainer.appendChild(imgEliminar);
        accionesContainer.appendChild(imgEditar);

        nuevaTarea.appendChild(tareaTexto);
        nuevaTarea.appendChild(accionesContainer);
        nuevaTarea.appendChild(inputEditar);

        listaTareaResultado.appendChild(nuevaTarea);

        // Verifica si el estado del checkbox está guardado en el almacenamiento local
        if (inputChequeo && tareaId) {
            const estadoGuardado = obtenerEstadoCheckboxDesdeLocalStorage(tareaId);
            if (estadoGuardado !== null) {
                inputChequeo.checked = estadoGuardado;
                actualizarEstadoTarea(tareaId, estadoGuardado);
            }
        }
    }
}

// Agregar evento de clic al botón "Asignar"
export function agregarTarea() {
    if (tareaInput && !seRealizoEdicion && mensajeParrafo && listaTareaResultado) {
        const tareaValor = tareaInput.value ? tareaInput.value.trim() : '';

        // Mostrar un mensaje de error si la tarea es inválida
        mensajeParrafo.textContent = "Por favor, ingrese una tarea válida.";

        if (tareaValor === "" || !isNaN(Number(tareaValor))) {
            // Limpiar el mensaje de error después de 2 segundos
            setTimeout(() => {
                mensajeParrafo.textContent = "";
            }, 2000);
        } else {
            mensajeParrafo.textContent = "";
            console.log(tareaValor);

            // Verificar si la tarea ya existe en la lista antes de agregarla
            const tareasEnLista = Array.from(listaTareaResultado.children);
            const tareaExistente = tareasEnLista.some((tarea) => tarea.textContent === tareaValor);

            if (!tareaExistente) {
                // Crear un objeto Tarea con el texto
                const nuevaTarea: Tarea = {
                    id: uuidv4(),
                    texto: tareaValor,
                };

                agregarTareaALista(tareaValor, nuevaTarea.id, listaTareaResultado);
                actualizarSeRealizoEdicion(false);
                tareaInput.value = "";

                // Llamar a guardarTareaLocalStorage con el objeto Tarea
                guardarTareaLocalStorage(nuevaTarea);
            }
        }
    }
};

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

// Función para guardar el estado del checkbox en el almacenamiento local
export function guardarEstadoCheckboxEnLocalStorage(tareaId: string, estado: boolean) {
    const estados = obtenerEstadosCheckboxesDesdeLocalStorage();
    estados[tareaId] = estado;
    localStorage.setItem('estadosCheckboxes', JSON.stringify(estados));
}

// Función para obtener el estado del checkbox desde el almacenamiento local
export function obtenerEstadoCheckboxDesdeLocalStorage(tareaId: string): boolean | null {
    const estados = obtenerEstadosCheckboxesDesdeLocalStorage();
    return estados[tareaId] || null;
}

// Función para obtener todos los estados de los checkboxes desde el almacenamiento local
export function obtenerEstadosCheckboxesDesdeLocalStorage(): { [key: string]: boolean } {
    const estadosString = localStorage.getItem('estadosCheckboxes');
    return estadosString ? JSON.parse(estadosString) : {};
}

// Función para actualizar el estado de la tarea
export function actualizarEstadoTarea(tareaId: string, estado: boolean) {
    const tarea = document.querySelector(`[data-id="${tareaId}"]`);
    if (tarea) {
        if (estado) {
            tarea.classList.add('tareaResuelta');
        } else {
            tarea.classList.remove('tareaResuelta');
        }
    }
}

// Restaurar el estado de los checkboxes cuando se carga la página
export function restaurarEstadoCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        const tareaId = checkbox.parentElement?.parentElement?.getAttribute('data-id');
        if (tareaId) {
            const estadoGuardado = obtenerEstadoCheckboxDesdeLocalStorage(tareaId);
            if (estadoGuardado !== null) {
                (checkbox as HTMLInputElement).checked = estadoGuardado;
                actualizarEstadoTarea(tareaId, estadoGuardado);
            }
        }
    });
}

export function actualizarSeRealizoEdicion(valor: boolean) {
    seRealizoEdicion = valor;
}