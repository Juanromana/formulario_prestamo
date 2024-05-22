// /* document.getElementById("pagad").addEventListener("keyup", (jun) =>{
//     let pago= $(jun.target).val();
//     let interes= $("#inter").val();
//     let deuda= $("#valorpre").val();
//     let numcuota= (pago/(deuda/parseFloat(interes)));
//     $("#cuo").val(Number(numcuota.toFixed(1))); //muestre solo un decimal

// }); */
$(document).ready(function () {
    const form = $('.formulario')[0];
    let fecha;
    $('#fecha_prestamo').change((e) => {
        fecha = $(e.target).val();
        calcularfecha(fecha)
            .then(result => {
                //si la promesa se cumple hacer el calculo
                $('#cuopendiente').val(result.cuotapendiente);
            }).catch(err => {
                //si no se cumple mostrar el mensaje de error
                console.error("error al calcular", err);
            });
    });

    $('#valorp').keyup((e) => {
        //se crea unas variables para traer los id del html y luego hacer la operacion
        form.classList.add('was-validated');
        const valpre = parseInt($(e.target).val());
        const cuope = parseInt($('#cuopendiente').val());
        const valoint = parseInt($('#interescli').val());
        const tot = (valpre + valpre * valoint / 100 * cuope);

        $('#total').val(tot);
    });
    $('#pagos').on('show.bs.modal', (e) => { //segun mi condicion dendro de mi función si se culcle continuar si no detener y mostra error

        const tot = $('#total').val();
        let interes = parseFloat($("#interescli").val());
        let pendiente = parseFloat($('#cuopendiente').val());
        let valpre = parseFloat($('#valorp').val());

        if (!form.checkValidity()) {
            e.preventDefault()//enviata abrir el modal
            e.stopPropagation()
            form.classList.add('was-validated')
            Swal.fire({
                icon: "error",
                title: "Oops",
                text: "Debe llener todos los campos",
            });
            return; //detener
        } else {
            let deudaact;
            if ((valpre < tot) && pendiente !== 0) {
                deudaact = valpre;
            } else {
                deudaact = tot;
            }
            interes = $("#interescli").val();
            let vainteres = parseFloat(deudaact * parseFloat(interes)) / 100;
            let deuda = tot;
            $('#total').val() !== '' ? deuda = $("#total").val() : deuda = $('#valorp').val();
            $('#valorpre').val(tot);
            $('#inter').val(interes + '%');
            $('#valor').keyup((e) => {
                let pago = $(e.target).val();//hacer el calculo de pago si no se cumple mostrar error
                calcularpago(pago, deuda, vainteres, pendiente).
                    then(resultado => {
                        if (resultado.numcuota >= 1) {
                            $('#cuo').val(resultado.numcuota);
                            $('#vainter').val(resultado.valInt);
                            $('#paca').val(resultado.pagocapi);
                            $('#vaac').val(resultado.valorpremoactual);
                        }
                        console.log("resultado")
                    }).catch(error => {
                        console.error("Error al calcular", error);
                    });
            });
        }
    });
    function calcularpago(p, d, i, pe) {
        return new Promise((resolve, reject) => {
            let cuota = (p / i).toFixed(1);
            let valActual;
            if (pe !== 0 && cuota <= pe) {
                pago_inter = parseFloat(cuota) * i;
                valActual = d - pago_inter;
            } else {
                pago_inter = parseFloat(pe) * i;
                valActual = d - p;
            }
            let capi = p - pago_inter;
            if (cuota >= 1) {
                resolve({
                    numcuota: Number(cuota),
                    valInt: Number(pago_inter),
                    pagocapi: Number(capi),
                    valorpremoactual: Number(valActual)
                });
            } else {
                reject('el calculo de la cuota es invalido');
            }
        });
        //segun la funcion hacer el calculo de pago sino mostrar el mensaje de error
    }
    function calcularfecha(fec) {
        return new Promise((resolve, reject) => {
            let fechapre = new Date(fec);
            let fechaactu = new Date();
            // DIFERNCIA DE AÑOS Y MESES
            let diafani = fechaactu.getFullYear() - fechapre.getFullYear();
            let diameS = fechaactu.getMonth() - fechapre.getMonth();
            let diadia = fechaactu.getDate() - fechapre.getDate();
            // DIFERENCIA DE LOS DIAS  ES NEGATIVA NO HA PASDO UN MS
            if (diadia <= 0) {
                diameS -= 1;
            }
            let pendiente = (diafani * 12) + diameS;
            if (pendiente === 0) {
                pendiente = 1;
            }
            resolve({
                cuotapendiente: pendiente
            });
            reject('calculo pendiente invalido');
        });
    }
    function limpar(){// funciona para elboton cancelar
        let modal = $('#pagos').find('input');
        modal.each(function () {
            $(this).val('');
        });
    };//limpiar despues de dar en el boton
    $('#cerrar').click(function(){
        limpar();
    });
    $("#btnguardar").click((e) => {// al prsionar mi boton guardar guarde la informacion luego limpie
        //$("#total").val(resultado.Premoactual);
        Swal.fire({
            icon: "success",
            title: "Guardado",
            text: "Se guardo correctamente",
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            //Limpia el modal
            let cuota = parseFloat($('#cuo').val());
            let cuotapen = parseFloat($('#cuotapen').val());
            if (cuota > cuotapen) {
                cuotapen = 0;
                $('#cuotapen').val(cuotapen);
            } else {
                cuotapen = cuotapen - cuota;
                $('#cuotapen').val(cuotapen);
            }
            $('#total').val($('#valor').val());
            $("#pagos").modal("hide")
            limpar();
            // let modal = $('#pagos').find('input');
            // modal.each(function () {
            //     $(this).val('');
            // });
            //limpiar despues de dar en el boton
        });
        // //Limpia el modal
        // $("#pagos").modal("hide")
        // let modal = $('#pagos').find('input');
        // modal.each(function () {
        //     $(this).val('');
        // });
    });
    
});