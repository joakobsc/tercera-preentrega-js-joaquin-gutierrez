document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchImput");
    const searchButton = document.getElementById("searchButton");
    const resultadoDeBusqueda = document.getElementById("resultadoDeBusqueda");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementsByClassName("close")[0];
    const turnoForm = document.getElementById("turnoForm");
    const nombrePacienteInput = document.getElementById("nombrePaciente");
    const obraSocialInput = document.getElementById("obraSocial");
    const medicoNombreInput = document.getElementById("medicoNombre");

    const Medico = function(nombre, especialidad, turnos) {
        this.nombre = nombre;
        this.especialidad = especialidad;
        this.turnos = turnos;
    };

    let medico1 = new Medico("JUAN", "CARDIOLOGIA", "LUNES");
    let medico2 = new Medico("GUSTAVO", "NEUROLOGIA", "LUNES");
    let medico3 = new Medico("ANA", "CLINICA MÉDICA", "MARTES");
    let medico4 = new Medico("EMANUEL", "PEDIATRIA", "VIERNES");
    let medico5 = new Medico("SANDRA", "CARDIOLOGIA", "SABADO");
    let medico6 = new Medico("JOAQUIN", "TRAUMATOLOGIA", "DOMINGO");
    let medico7 = new Medico("MAXIMILIANO", "ENDOCRINOLOGIA", "MIERCOLES");

    let lista = [medico1, medico2, medico3, medico4, medico5, medico6, medico7];

    searchButton.addEventListener("click", () => {
        buscarMedico(searchInput.value);
    });

    searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            buscarMedico(searchInput.value);
        }
    });

    function buscarMedico(ingreso) {
        resultadoDeBusqueda.innerHTML = "";
        if(ingreso.trim()===""){
            resultadoDeBusqueda.innerHTML = ""
            return;
        }
        
        let resultados = lista.filter(medico => 
            medico.nombre.toLowerCase().includes(ingreso.toLowerCase()) || 
            medico.especialidad.toLowerCase().includes(ingreso.toLowerCase())
        );

        if (resultados.length > 0) {
            resultados.forEach(medico => {
                const medicoCard = document.createElement("div");
                medicoCard.className = "card";
                medicoCard.innerHTML = `
                    <p><strong>Nombre:</strong> ${medico.nombre}</p>
                    <p><strong>Especialidad:</strong> ${medico.especialidad}</p>
                    <p><strong>Turnos:</strong> ${medico.turnos}</p>
                    <button onclick="abrirModal('${medico.nombre}')">Sacar Turno</button>
                `;
                resultadoDeBusqueda.appendChild(medicoCard);
            });
        } else {
            resultadoDeBusqueda.innerHTML = "<p>No se encontraron resultados relacionados, intente nuevamente...</p>";
        }
    }

    window.abrirModal = function(nombreMedico) {
        medicoNombreInput.value = nombreMedico;
        modal.style.display = "block";
    }

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    turnoForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevenir el envío automático del formulario

        // Verificar si los campos del formulario están vacíos
        if (nombrePacienteInput.value.trim() === "" || obraSocialInput.value.trim() === "") {
            alert("Por favor, complete todos los campos del formulario.");
            return;
        }

        let turnoConfirmado = {
            nombreMedico: medicoNombreInput.value,
            especialidad: lista.find(medico => medico.nombre === medicoNombreInput.value).especialidad,
            turnos: lista.find(medico => medico.nombre === medicoNombreInput.value).turnos,
            nombreUsuario: nombrePacienteInput.value,
            obraSocial: obraSocialInput.value,
            fecha: new Date().toLocaleDateString()
        };
        localStorage.setItem("ultimoTurno", JSON.stringify(turnoConfirmado))
        mostrarPopupTurnoConfirmado(turnoConfirmado);
        turnoForm.reset();
        modal.style.display = "none";
    });

    function mostrarPopupTurnoConfirmado(turnoConfirmado) {
        resultadoDeBusqueda.innerHTML = "";
        // Crear el contenedor del popup
        const popupContainer = document.createElement("div");
        popupContainer.className = "popup-container";

        // Crear el contenido del popup con los detalles del turno
        const popupContent = document.createElement("div");
        popupContent.className = "popup";
        popupContent.innerHTML = `
            <h2>Detalles del Turno Confirmado</h2>
            <p><strong>Paciente:</strong> ${turnoConfirmado.nombreUsuario}</p>
            <p><strong>Médico:</strong> Dr./Dra. ${turnoConfirmado.nombreMedico}</p>
            <p><strong>Especialidad:</strong> ${turnoConfirmado.especialidad}</p>
            <p><strong>Día:</strong> ${turnoConfirmado.turnos}</p>
            <p><strong>Obra Social:</strong> ${turnoConfirmado.obraSocial}</p>
            <p><strong>Fecha de Confirmación:</strong> ${turnoConfirmado.fecha}</p>
            <button onclick="cerrarPopup()">Cerrar</button>
        `;
        popupContainer.appendChild(popupContent);

        // Agregar el contenedor del popup al cuerpo del documento
        document.body.appendChild(popupContainer);
    }

    window.cerrarPopup = function() {
        const popupContainer = document.querySelector(".popup-container");
        if (popupContainer) {
            popupContainer.remove();
        }
    }
    
    if (!localStorage.getItem('medicos')) {
        // Si no está, guardar la lista de médicos en localStorage
        localStorage.setItem('medicos', JSON.stringify(lista));
    }
});

