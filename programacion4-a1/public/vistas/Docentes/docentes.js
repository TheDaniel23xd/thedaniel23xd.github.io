export function modulo(){
    var $ = el => document.querySelector(el),
        frmDocentes = $("#frm-docentes");
    frmDocentes.addEventListener("submit",e=>{
        e.preventDefault();
        e.stopPropagation();
        
        let docentes = {
            accion    : frmDocentes.dataset.accion,
            idDocente  : frmDocentes.dataset.iddocente,
            codigo    : $("#txtCodigoDocente").value,
            nombre    : $("#txtNombreDocente").value,
            nit    : $("#txtNitDocente").value,
            direccion : $("#txtDireccionDocente").value,
            telefono  : $("#txtTelefonoDocente").value
        };
        fetch(`private/Modulos/docentes/procesosD.php?proceso=recibirDatos&docente=${JSON.stringify(docentes)}`).then( resp=>resp.json() ).then(resp=>{
            $("#respuestaDocente").innerHTML = `
                <div class="alert alert-success" role="alert">
                    ${resp.msg}
                </div>
            `;
        });
    });
    frmDocentes.addEventListener("reset",e=>{
        $("#frm-docentes").dataset.accion = 'nuevo';
        $("#frm-docentes").dataset.iddocente = '';
    });
}