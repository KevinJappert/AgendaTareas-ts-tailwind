import { v4 as uuidv4 } from 'uuid'; // se utiliza para generar y asociar UUIDs únicos con cada tarea que se agrega a tu lista, lo que facilita la identificación y el seguimiento de tareas específicas en tu aplicación.
import { eliminarTareaLocalStorage, cargarTareasDesdeLocalStorage, guardarTareaLocalStorage } from "./Funciones/funciones";

// Obtener elementos del DOM
const btnAsignar = document.getElementById("boton-asignar");
const tareaInput = document.getElementById("tarea") as HTMLInputElement;
const mensajeParrafo = document.getElementById("mensaje");
const listaTareaResultado = document.getElementById("lista-tarea");

// Variable para controlar si se ha realizado una edición
let seRealizoEdicion = false;

// Función para agregar una tarea a la lista
function agregarTareaALista(tareaInput: string, listaTareaResultado: HTMLElement) {
    tareaInput = tareaInput.trim();

    const tareasEnLista = Array.from(listaTareaResultado!.children);

    // Generar un identificador único para cada tarea usando uuidv4()
    const tareaId = uuidv4();

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

            const tareaPadre = imgEliminar.parentElement?.parentElement;
            if (tareaPadre) {
                tareaPadre.remove();
                // Remover la tarea del almacenamiento local
                eliminarTareaLocalStorage(tareaInput);
            }
        });

        const imgEditar = document.createElement('img');
        imgEditar.src = './public/img/boligrafo.png';
        imgEditar.alt = 'Editar';
        imgEditar.className = 'accion-editar w-8 h-8 mt-3 cursor-pointer';

        const inputEditar = document.createElement('input');
        inputEditar.type = 'text';
        inputEditar.className = 'hidden';

        imgEditar.addEventListener('click', () => {
            console.log('Haz hecho clic en el icono de editar');

            inputEditar.style.display = 'inline-block';
            tareaTexto.style.display = 'none';

            inputEditar.value = tareaTexto.textContent || '';
            inputEditar.focus();
        });

        inputEditar.addEventListener('blur', () => {
            tareaTexto.textContent = inputEditar.value;
            tareaTexto.style.display = 'inline-block';
            inputEditar.style.display = 'none';

            seRealizoEdicion = true;
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

// Evento DOMContentLoaded para cargar tareas desde el LocalStorage
document.addEventListener('DOMContentLoaded', () => {
    const tareasGuardadas = cargarTareasDesdeLocalStorage();
    tareasGuardadas.forEach((tareaGuardada) => {
        agregarTareaALista(tareaGuardada, listaTareaResultado!);
    });
});

// Agregar evento de clic al botón "Asignar"
btnAsignar?.addEventListener('click', () => {
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
                agregarTareaALista(tareaValor, listaTareaResultado);
                seRealizoEdicion = false;
                tareaInput.value = "";
                guardarTareaLocalStorage(tareaValor);
            }
        }
    }
});

console.log(localStorage);
console.log(localStorage.getItem('tareas'));

// Proximamente: agregar funcionalidad para hora de la tarea, tiempo para hacerla,
// marcar como completada, y eliminar tareas.
