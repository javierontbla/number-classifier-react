// librerías
import { useState, useEffect } from "react";
import axios from "axios";

// estilos
import "./App.css";

// clase de nodo
class Node {
  constructor(isNodeActive) {
    this.isNodeActive = isNodeActive;
  }
}

export default function App() {
  // número de filas y columnas (28 x 28 = 784)
  const [numOfRows, setNumOfRows] = useState(28);
  const [numOfCols, setNumOfCols] = useState(28);
  const [grid, setGrid] = useState([]);
  // saber si el usuario esta dibujando o no
  const [isUserDrawing, setIsUserDrawing] = useState(false);
  const [resultNum, setResultNum] = useState(null);
  const [emptyGrid, setEmptyGrid] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // crear cuadrícula
    createGrid();
  }, []);

  const createGrid = () => {
    // crear cuadrícula, inicialmente con todos los nodos inactivos
    const tempGrid = [];
    for (let i = 0; i < numOfCols; i++) {
      tempGrid[i] = [];
      for (let j = 0; j < numOfRows; j++) {
        // inicialmente, el nodo esta inactivo (0)
        // cuando esta activo, cambia a (1)
        tempGrid[i][j] = new Node(0);
      }
    }
    setGrid(tempGrid);
  };

  const onMouseDownEvent = () => {
    setIsUserDrawing(true);
  };

  const onMouseUpEvent = () => {
    setIsUserDrawing(false);
  };

  const onMouseEnterEvent = (i, j) => {
    // ejecutar función solo si el usuario esta presionando sobre la cuadrícula
    if (isUserDrawing) {
      if (emptyGrid) setEmptyGrid(false);
      // seleccionar nodo individual
      // ATENCIÓN: no es buena práctica utilizar getElementById en react.js
      // sin embargo aquí lo hacemos para evitar que el navegador colapse
      const nodeElement = document.getElementById(`node-${i}-${j}`);
      const nodeReact = grid[i][j];

      // actualizar clase Node
      nodeReact.isNodeActive = 255;
      // cambiar nombre de clase, por lo tanto, cambia color de nodo
      nodeElement.className = "node-active";
    }
  };

  const sendNumber = async () => {
    // enviar a servidor SOLO si el usuario ha dibujado algo
    if (!emptyGrid) {
      setLoading(true);
      const numArr = [];
      for (let i = 0; i < numOfRows; i++) {
        for (let j = 0; j < numOfCols; j++) {
          numArr.push(grid[j][i].isNodeActive);
        }
      }
      try {
        // enviar arreglo a servidor para predecir el número
        // esperar respuesta con async/await
        const response = await axios.post("http://localhost:5000/", numArr);
        setResultNum(response.data);
      } catch (error) {
        // mostrar error en la consola
        console.log(error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left-container">
        <div className="grid-container">
          <h1 className="grid-title">Dibuja un número (0 - 9)</h1>
          <div className="grid-top-container">
            {grid.map((row, i) => (
              <div className="grid-row">
                {row.map((col, j) => (
                  <div
                    className="node-inactive"
                    id={`node-${i}-${j}`}
                    onMouseDown={() => onMouseDownEvent()}
                    onMouseUp={() => onMouseUpEvent()}
                    onMouseEnter={() => onMouseEnterEvent(i, j)}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="grid-bottom-container">
            <button className="send-button" onClick={() => sendNumber()}>
              ENVIAR
            </button>
          </div>
        </div>
      </div>
      <div className="right-container">
        <h1 className="grid-title">El número dibujado es:</h1>
        <div className="server-response">
          {loading ? <div className="loader-container-small" /> : resultNum}
        </div>
      </div>
    </div>
  );
}
