
do {
    var accion = prompt("Escribi el tipo de operacion a realizar (SUMA, RESTA, MULTI, DIVI o SALIR)");
    if (accion === null || accion === "") {
        alert("No indicaste ninguna operacion");
        continue;
    }
    if (accion.toUpperCase() === "SALIR") {
        break;
    }
    if (accion.toUpperCase() === "SUMA") {
        var numero1 = Number(prompt("Escribi el primer numero a sumar"));
        var numero2 = Number(prompt("Escribi el segundo numero a sumar"));
        let resultado = numero1 + numero2;
        alert("El resultado de la suma entre "+ numero1 +" y "+ numero2 + " es " + resultado );
    } else if (accion.toUpperCase() === "RESTA") {
        var numero1 = Number(prompt("Escribi el primer numero a restar"));
        var numero2 = Number(prompt("Escribi el segundo numero a restar"));
        let resultado = numero1 - numero2;
        alert("El resultado de la resta entre "+ numero1 +" y "+ numero2 + " es " + resultado );
    } else if (accion.toUpperCase() === "MULTI") {
        var numero1 = Number(prompt("Escribi el primer numero a multiplicar"));
        var numero2 = Number(prompt("Escribi el segundo numero a multiplicar"));
        let resultado = numero1 * numero2;
        alert("El resultado de la multiplicacion de "+ numero1 +" por "+ numero2 + " es " + resultado );
    } else if (accion.toUpperCase() === "DIVI") {
        var numero1 = Number(prompt("Escribi el primer numero a dividir"));
        var numero2 = Number(prompt("Escribi el segundo numero a dividir"));
        let resultado = numero1 / numero2;
        alert("El resultado de la division de "+ numero1 +" entre "+ numero2 + " es " + resultado );
    } else {
        alert("Operacion no valida");
    }
} while (true);
alert("Saliendo del programa.");
