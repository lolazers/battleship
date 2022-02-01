import Ship from "./shipModule";
import Gameboard from "./gameboardModule";
import Player from "./playerModule";

export const createDOMGrid = (container, player) => {
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      const grid = document.createElement("div");
      grid.setAttribute("xy-coord", `${j}-${i}`);
      grid.addEventListener("dragover", e => {
        e.preventDefault();
      });
      grid.addEventListener("drop", e => {
        const shipName = e.dataTransfer.getData("ShipName");
        const shipAxis = e.dataTransfer.getData("ShipAxis");
        const ship = findShip(shipName, player);
        const [xCoord, yCoord] = grid.getAttribute("xy-coord").split("-");
        if (player.gameboard.placeShip(ship, yCoord, xCoord, shipAxis)) {
          const draggable = document.querySelector(".dragging");
          grid.appendChild(draggable);
        }
        console.log(player);
      });

      container.appendChild(grid);
    }
  }
};

export const findShip = (name, player) => {
  const shipObj = player.gameboard.ships.find(ship => ship.name == name);
  return shipObj;
};

document.querySelectorAll(".drag-item").forEach(item => {
  item.addEventListener("dragstart", e => {
    item.classList.add("dragging");
    e.dataTransfer.setData("ShipName", e.target.id);
    e.dataTransfer.setData("ShipAxis", e.target.getAttribute("data-axis"));
  });
});

document.querySelectorAll(".drag-item").forEach(item => {
  item.addEventListener("dragend", () => {
    item.classList.remove("dragging");
  });
});

export const colorAttackedCell = (x, y, player, container) => {
  const selectedCell = document.querySelector(
    `${container} [xy-coord="${x}-${y}"]`
  );
  const xCoord = x - 1;
  const yCoord = y - 1;
  if (typeof player.gameboard.grid[yCoord][xCoord] == "object") {
    selectedCell.style.backgroundColor = "green";
  } else {
    // Mark board as not hit
    selectedCell.style.backgroundColor = "yellow";
  }
};

export const rotateShips = () => {
  const rotateBtn = document.querySelector("#rotate-btn");
  if (rotateBtn.getAttribute("data-rotation") == "x") {
    rotateY();
    rotateBtn.setAttribute("data-rotation", "y");
  } else {
    rotateX();
    rotateBtn.setAttribute("data-rotation", "x");
  }
};

export const rotateY = () => {
  const shipsContainer = document.querySelector("#ships-container");
  shipsContainer.querySelectorAll(".drag-item").forEach(item => {
    const width = item.offsetWidth;
    item.style.height = `${width / 16}rem`;
    item.style.width = `2.5rem`;
    item.style.flexDirection = "column";
    item.setAttribute("data-axis", "y");
  });
  shipsContainer.style.flexDirection = "row";
};

export const rotateX = () => {
  const shipsContainer = document.querySelector("#ships-container");
  shipsContainer.querySelectorAll(".drag-item").forEach(item => {
    const height = item.offsetHeight;
    item.style.height = `2.5rem`;
    item.style.width = `${height / 16}rem`;
    item.style.flexDirection = "row";
    item.setAttribute("data-axis", "x");
  });
  shipsContainer.style.flexDirection = "column";
};
