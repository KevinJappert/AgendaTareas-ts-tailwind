// Importa tus módulos y funciones necesarios aquí...
import {
    cargarTareasDesdeLocalStorage,
    restaurarEstadoCheckboxes,
    agregarTareaALista,
    agregarTarea,
    obtenerFechaVencimientoDesdeLocalStorage,
    fechaVencimientoInput,

} from "./Funciones/funciones";

// Obtener elementos del DOM
const btnAsignar = document.getElementById("boton-asignar");
export const tareaInput = document.getElementById("tarea") as HTMLInputElement;
export const listaTareaResultado = document.getElementById("lista-tarea");


// Evento DOMContentLoaded para cargar tareas desde el LocalStorage
document.addEventListener('DOMContentLoaded', () => {
    const tareasGuardadas = cargarTareasDesdeLocalStorage();
    tareasGuardadas.forEach((tareaGuardada) => {
        // Obtener la fecha de vencimiento almacenada en el Local Storage
        const fechaVencimientoString = obtenerFechaVencimientoDesdeLocalStorage(tareaGuardada.id);
        const fechaVencimiento = fechaVencimientoString || undefined;

        agregarTareaALista(tareaGuardada.texto, tareaGuardada.id, listaTareaResultado!, fechaVencimiento);
    });

    // Restaurar el estado de los checkboxes cuando se carga la página
    restaurarEstadoCheckboxes();
});

// Agregar evento de tecla "Enter" para el campo de entrada de fecha de vencimiento
fechaVencimientoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {

        // Si la fecha es válida, puedes agregar la tarea
        agregarTarea();
    }
});



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

// Resto de tu código...

console.log(localStorage);

//Agregar mejores estilos a la hora de asignar la tarea. Agregar que la fecha de vencimiento sea una que sea a futuro y no sea en pasado.

