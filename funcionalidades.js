const fs = require('fs');
const path = require('path');




const crearStrings = () => {
    const colores = [
        {"esp": "rojo", "ing": "red"},
        {"esp": "azul", "ing": "blue"},
        {"esp": "verde", "ing": "green"},
        {"esp": "amarillo", "ing": "yellow"},
        {"esp": "negro", "ing": "black"},
        {"esp": "blanco", "ing": "white"},
        {"esp": "morado", "ing": "purple"},
        {"esp": "naranja", "ing": "orange"},
        {"esp": "rosa", "ing": "pink"},
        {"esp": "gris", "ing": "gray"},
        {"esp": "marrón", "ing": "brown"},
        {"esp": "violeta", "ing": "violet"},
        {"esp": "cian", "ing": "cyan"},
        {"esp": "magenta", "ing": "magenta"},
        {"esp": "turquesa", "ing": "turquoise"},
        {"esp": "lavanda", "ing": "lavender"},
        {"esp": "beige", "ing": "beige"},
        {"esp": "crema", "ing": "cream"},
        {"esp": "dorado", "ing": "golden"},
        {"esp": "plateado", "ing": "silver"}
      ];
      
    let array_nombres = colores.map((obj) => {
        let string = `${obj.ing}_${obj.esp}`;
        return string;
    });
    console.log(array_nombres)
};


module.exports = crearStrings;