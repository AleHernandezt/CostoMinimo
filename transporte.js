// Define variables globales para la matriz, oferta y demanda
let matrizCostos = [];
let valoresInputs = [];
let oferta = [];
let demanda = [];

// Función para leer una matriz de costos personalizada
let matriz = [];

// Función para generar la matriz
function generarMatrizYInputs() {
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
        
        // Agregar columna a la derecha para la oferta
        const requerimientoCell = document.createElement("td");
        const requerimientoInput = document.createElement("input");
        requerimientoInput.type = "number";
        requerimientoInput.id = `oferta-${i}`;
        requerimientoInput.placeholder = `Oferta de la fuente ${i + 1}`;
        requerimientoCell.appendChild(requerimientoInput);
        row.appendChild(requerimientoCell);

        table.appendChild(row);
    }
    
    // Agregar fila para demanda de los requerimientos
    const requerimientosRow = document.createElement("tr");
    for (let j = 0; j < columnas; j++) {
        const cell = document.createElement("td");
        const requerimientoInputDemanda = document.createElement("input");
        requerimientoInputDemanda.type = "number";
        requerimientoInputDemanda.id = `demanda-${j}`;
        requerimientoInputDemanda.placeholder = `Demanda de la fuente ${j + 1}`;
        cell.appendChild(requerimientoInputDemanda);
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
        const requerimientoInput = document.getElementById(`oferta-${i}`);
        oferta.push(parseInt(requerimientoInput.value));

        const demandaInputDemanda = document.getElementById(`demanda-${i}`);
        demanda.push(parseInt(demandaInputDemanda.value));
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

function calcularGanancia(valoresInputs, asignaciones) {
    let gananciaTotal = 0; 
    for (let i = 0; i < valoresInputs.length; i++) {
        for (let j = 0; j < valoresInputs[i].length; j++) {
            if (valoresInputs[i][j] > 0) { 
                gananciaTotal += valoresInputs[i][j] * asignaciones[i][j];
            }
            console.log('resultados')
            console.log(valoresInputs[i][j])
            console.log(asignaciones[i][j])
            console.log(gananciaTotal)
        }
    }

    return gananciaTotal;
}

// Función para mostrar los resultados, incluyendo la ganancia total
function mostrarResultados() {
    const asignaciones = asignarCantidades(matrizCostos, oferta, demanda);
    const gananciaTotal = calcularGanancia(valoresInputs, asignaciones);

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
            // Mostrar la ganancia total
    const gananciaTotalDiv = document.createElement("div");
    gananciaTotalDiv.textContent = "Ganancia Total: " + gananciaTotal;
    resultadosDiv.appendChild(gananciaTotalDiv);
}

// Función para leer la matriz de costos
function leerMatrizCostos(filas, columnas) {
    matrizCostos = [];
    valoresInputs = [];
    const matrizDiv = document.getElementById("matriz");
    const table = matrizDiv.querySelector("table");

    for (let i = 0; i < filas; i++) {
        const row = table.rows[i];
        const rowData = [];
        const filaInputs = []; 

        for (let j = 0; j < columnas; j++) {
            const cell = row.cells[j];
            const input = cell.querySelector("input");
            const valorNumerico = parseInt(input.value);
            rowData.push(valorNumerico);
            filaInputs.push(valorNumerico);
        }

        matrizCostos.push(rowData);
        valoresInputs.push(filaInputs);
        console.log(matrizCostos, valoresInputs)
    }
}

// Función para iniciar los cálculos
function calcular() {
    const filas = parseInt(document.getElementById("filas").value);
    const columnas = parseInt(document.getElementById("columnas").value);
    leerMatrizCostos(filas, columnas);
    leerOfertaDemanda(columnas);
    mostrarResultados();
}