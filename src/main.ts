// Obtener elementos del DOM
const btnAsignar = document.getElementById("boton-asignar");
const tareaInput = document.getElementById("tarea") as HTMLInputElement;
const mensajeParrafo = document.getElementById("mensaje");
const listaTareaResultado = document.getElementById("lista-tarea");

// Variable para controlar si se ha realizado una edición
let seRealizoEdicion = false;

// Cargar tareas desde el almacenamiento local al iniciar la aplicación
const tareasGuardadas = cargarTareasDesdeLocalStorage();

// Llenar la lista de tareas con las tareas guardadas
tareasGuardadas.forEach((tareaGuardada) => {
    agregarTareaALista(tareaGuardada, listaTareaResultado!);
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
            const tareasEnLista = Array.from(listaTareaResultado!.children);
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

// Función para agregar una tarea a la lista
function agregarTareaALista(tareaInput: string, listaTareaResultado: HTMLElement) {
    tareaInput = tareaInput.trim();

    const tareasEnLista = Array.from(listaTareaResultado!.children);

    // Generar un identificador único para cada tarea
    const tareaId = `tarea-${Date.now()}`;
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
    guardarTareaLocalStorage(tareaInput);
}

// Función para guardar una tarea en el almacenamiento local
function guardarTareaLocalStorage(tarea: string) {
    let tareas: string[] = cargarTareasDesdeLocalStorage();

    if (!tareas.includes(tarea)) {
        tareas.push(tarea);
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }
}

// Función para cargar tareas desde el almacenamiento local
function cargarTareasDesdeLocalStorage(): string[] {
    const tareasString = localStorage.getItem("tareas");
    if (tareasString) {
        return JSON.parse(tareasString);
    } else {
        return [];
    }
}

// Función para eliminar una tarea del almacenamiento local
function eliminarTareaLocalStorage(tarea: string) {
    const tareasGuardadas = cargarTareasDesdeLocalStorage();
    const nuevasTareas = tareasGuardadas.filter((t) => t !== tarea);
    localStorage.setItem('tareas', JSON.stringify(nuevasTareas));
}

console.log(localStorage);
console.log(localStorage.getItem('tareas'));
