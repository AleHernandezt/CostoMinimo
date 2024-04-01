// Define variables globales para la matriz, oferta y demanda
let matrizCostos = [];
let oferta = [];
let demanda = [];

// Función para leer una matriz de costos personalizada
let matriz = [];

// Función para generar la matriz
function generarMatriz() {
    const filas = parseInt(document.getElementById("filas").value);
    const columnas = parseInt(document.getElementById("columnas").value);

    matriz = [];
    const matrizDiv = document.getElementById("matriz");
    matrizDiv.innerHTML = "<h2>Matriz:</h2>";
    const table = document.createElement("table");
    for (let i = 0; i < filas; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < columnas; j++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.placeholder = `Celda (${i + 1}, ${j + 1})`;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        
        // Agregar celda adicional para los requerimientos
        const requerimientoCell = document.createElement("td");
        const requerimientoInput = document.createElement("input");
        requerimientoInput.type = "number";
        requerimientoInput.placeholder = "Requerimiento";
        requerimientoCell.appendChild(requerimientoInput);
        row.appendChild(requerimientoCell);

        table.appendChild(row);
    }
    
    // Agregar fila adicional para los requerimientos
    const requerimientosRow = document.createElement("tr");
    for (let j = 0; j < columnas; j++) {
        const cell = document.createElement("td");
        const requerimientoInput = document.createElement("input");
        requerimientoInput.type = "number";
        requerimientoInput.placeholder = "Requerimiento";
        cell.appendChild(requerimientoInput);
        requerimientosRow.appendChild(cell);
    }
    
    // Celda adicional vacía para la esquina inferior derecha
    const esquinaCell = document.createElement("td");
    requerimientosRow.appendChild(esquinaCell);
    
    table.appendChild(requerimientosRow);
    matrizDiv.appendChild(table);
}

// Función para leer las cantidades de oferta y demanda
function leerOfertaDemanda(columnas) {
    oferta = [];
    demanda = [];
    for (let i = 0; i < columnas; i++) {
        oferta.push(parseInt(prompt(`Ingresa la oferta para la fuente ${i + 1}:`)));
        demanda.push(parseInt(prompt(`Ingresa la demanda para el destino ${i + 1}:`)));
    }
}

// Función para encontrar la celda con el costo mínimo
function encontrarCeldaCostoMinimo(matriz) {
    let minCosto = Number.MAX_SAFE_INTEGER;
    let filaMin = -1;
    let colMin = -1;

    for (let fila = 0; fila < matriz.length; fila++) {
        for (let col = 0; col < matriz[fila].length; col++) {
            if (matriz[fila][col] < minCosto) {
                minCosto = matriz[fila][col];
                filaMin = fila;
                colMin = col;
            }
        }
    }

    return { fila: filaMin, col: colMin };
}

// Función para asignar cantidades
function asignarCantidades(matrizCostos, oferta, demanda) {
    const asignaciones = Array.from({ length: oferta.length }, () => Array(demanda.length).fill(0));

    while (true) {
        const { fila, col } = encontrarCeldaCostoMinimo(matrizCostos);

        if (fila === -1 || col === -1) {
            break;
        }

        const cantidad = Math.min(oferta[fila], demanda[col]);
        asignaciones[fila][col] = cantidad;
        oferta[fila] -= cantidad;
        demanda[col] -= cantidad;
        matrizCostos[fila][col] = Number.MAX_SAFE_INTEGER;
    }

    return asignaciones;
}

// Función para mostrar los resultados
function mostrarResultados() {
    const asignaciones = asignarCantidades(matrizCostos, oferta, demanda);
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "<h2>Asignaciones:</h2>";

    // Crear una tabla para mostrar las asignaciones
    const table = document.createElement("table");
    for (let i = 0; i < asignaciones.length; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < asignaciones[i].length; j++) {
            const cell = document.createElement("td");
            cell.textContent = asignaciones[i][j];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    resultadosDiv.appendChild(table);
}

// Función para iniciar los cálculos
function calcular() {
    const filas = parseInt(document.getElementById("filas").value);
    const columnas = parseInt(document.getElementById("columnas").value);

    leerMatrizCostos(filas, columnas);
    leerOfertaDemanda(columnas);
    mostrarResultados();
}
