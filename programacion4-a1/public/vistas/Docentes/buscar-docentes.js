export function modulo(){
    var $ = el => document.querySelector(el),

        frmBuscarDocente = $("#txtBuscarDocente");
    frmBuscarDocente.addEventListener('keyup', e=>{
        traerDatos(frmBuscarDocente.value);
    });
  
    let modificarDocente = (docente)=>{
        $("#frm-docente").dataset.accion = 'modificar';
        $("#frm-docente").dataset.iddocente = docente.idDocente;
        $("#txtCodigoDocente").value = docente.codigo;
        $("#txtNombreDocente").value = docente.nombre;
        $("#txtNitDocente").value = docente.nit;
        $("#txtDireccionDoncente").value = docente.direccion;
        $("#txtTelefonoDocente").value =   docente.telefono;
        $("#txtNitDocente").value =   docente.nit;
    };
    
        
    let eliminarDocente = (idDocente)=>{
        let dialog = document.getElementById("dialogDocentes");
        dialog.close();
        dialog.showModal();

        document.getElementById("btnCancelarDocentes").addEventListener('click', event => {
            dialog.close();
        });

        document.getElementById("btnConfirmarDocentes").addEventListener('click', event => {
            fetch(`private/Modulos/docentes/procesosD.php?proceso=eliminarDocente&docente=${idDocente}`).then(resp=>resp.json()).then(resp=>{
                traerDatos('');
            });
            dialog.close();
        })
             
       
    };
    let traerDatos = (valor)=>{
        fetch(`private/Modulos/docentes/procesosD.php?proceso=buscarDocente&docente=${valor}`).then(resp=>resp.json()).then(resp=>{
            let filas = '';
            resp.forEach(docente => {
                filas += `
                    <tr data-iddocente='${docente.idDocente}' data-docentes='${JSON.stringify(docente)}'>
                        <td>${docente.codigo}</td>
                        <td>${docente.nombre}</td>
                        <td>${docente.nit}</td>
                        <td>${docente.direccion}</td>
                        <td>${docente.telefono}</td>
                        <td>
                            <input type="button" class="btn btn-outline-danger text-white" value="del">
                        </td>
                    </tr>
                `;
            });
            $("#tbl-buscar-docente > tbody").innerHTML = filas;
            $("#tbl-buscar-docente > tbody").addEventListener("click",e=>{
                if( e.srcElement.parentNode.dataset.docente==null ){
                    eliminarDocente( e.srcElement.parentNode.parentNode.dataset.iddocente );
                } else {
                     modificarDocente( JSON.parse(e.srcElement.parentNode.dataset.docente) );
                }
            });
        });
    };
    traerDatos('');
}