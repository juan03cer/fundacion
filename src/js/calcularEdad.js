  (function() {
 const fechaNacimientoInput = document.getElementById('fechanacimiento');
    const edadInput = document.getElementById('edad');
    const mesesInput = document.getElementById('meses');
  
    fechaNacimientoInput.addEventListener('change', function() {
        const fechaNacimiento = new Date(fechaNacimientoInput.value);
        const hoy = new Date();
        
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        let mes = hoy.getMonth() - fechaNacimiento.getMonth();
  
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
            mes = (mes + 12) % 12;
        }
  
        edadInput.value = edad;
        mesesInput.value = mes;
    });
})()