import { v4 as uuidv4 } from 'uuid';
import { eliminarTareaListaYLocalStorage, cargarTareasDesdeLocalStorage, guardarTareaLocalStorage, habilitarEdicionTarea, Tarea, actualizarTextoTarea, seRealizoEdicion, actualizarSeRealizoEdicion } from "./Funciones/funciones";

// Obtener elementos del DOM
const btnAsignar = document.getElementById("boton-asignar");
const tareaInput = document.getElementById("tarea") as HTMLInputElement;
const mensajeParrafo = document.getElementById("mensaje");
const listaTareaResultado = document.getElementById("lista-tarea");

// Evento DOMContentLoaded para cargar tareas desde el LocalStorage
document.addEventListener('DOMContentLoaded', () => {
    const tareasGuardadas = cargarTareasDesdeLocalStorage();
    tareasGuardadas.forEach((tareaGuardada) => {
        agregarTareaALista(tareaGuardada.texto, tareaGuardada.id, listaTareaResultado!);
    });
});


// Función para agregar una tarea a la lista
function agregarTareaALista(tareaInput: string, tareaId: string, listaTareaResultado: HTMLElement) {
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


    }
}

// Agregar evento de clic al botón "Asignar"
btnAsignar?.addEventListener('click', () => {
    agregarTarea();
});

// Agregar evento de tecla "Enter" para el campo de entrada de tareas
tareaInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        agregarTarea();
    }
});

// Agregar evento de clic al botón "Asignar"
function agregarTarea() {
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



// Resto de tu código...

console.log(localStorage);
console.log(localStorage.getItem('tareas'));
