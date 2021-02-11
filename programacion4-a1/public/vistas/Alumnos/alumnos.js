
var appalumno = new Vue({
    el:'#frm-alumnos',
    data:{
        alumno:{
            idAlumno  : 0,
            accion    : 'nuevo',
            codigo    : '',
            nombre    : '',
            direccion : '',
            telefono  : '',
            msg       : ''
        }
    },
    methods:{
        guardarAlumno:function(){
            fetch(`private/Modulos/alumnos/procesos.php?proceso=recibirDatos&alumno=${JSON.stringify(this.alumno)}`).then( resp=>resp.json() ).then(resp=>{
                this.alumno.msg = resp.msg;
                this.alumno.idAlumno = 0;
                this.alumno.codigo = '';
                this.alumno.nombre = '';
                this.alumno.direccion = '';
                this.alumno.telefono = '';
                this.alumno.accion = 'nuevo';
                appBuscarAlumnos.buscarAlumno();
            });
        }
    }
});
