/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\n    // Inicializa el mapa\n    const lat = document.querySelector('#lat').value || 19.4153897;\n    const lng = document.querySelector('#lng').value || -99.1649381;\n    const mapa = L.map('mapa').setView([lat, lng], 16);\n    let marker;\n\n    // Utiliza provider y geocoder\n    const geocodeService = L.esri.Geocoding.geocodeService();\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa);\n\n    // Inicializa el pin\n    marker = new L.marker([lat, lng], {\n        draggable: true,\n        autoPan: true\n    }).addTo(mapa);\n\n    // Detecta el movimiento del pin y obtiene la información de la dirección\n    marker.on('moveend', function(e) {\n        marker = e.target;\n        const posicion = marker.getLatLng();\n        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));\n\n        // Obtiene la información de las calles al soltar el pin\n        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado) {\n            if (resultado) {\n                marker.bindPopup(resultado.address.LongLabel).openPopup();\n\n                // Llena los campos con la información obtenida\n                document.querySelector('.calle').textContent = resultado.address.Match_addr || '';\n                document.querySelector('#calle').value = resultado.address.Match_addr || '';\n                document.querySelector('#lat').value = resultado.latlng.lat || '';\n                document.querySelector('#lng').value = resultado.latlng.lng || '';\n            }\n        });\n    });\n\n    // Función debounce\n    function debounce(func, wait) {\n        let timeout;\n        return function(...args) {\n            clearTimeout(timeout);\n            timeout = setTimeout(() => func.apply(this, args), wait);\n        };\n    }\n\n    // Añade el evento para buscar la dirección ingresada\n    const direccionInput = document.querySelector('#direccion');\n    direccionInput.addEventListener('input', debounce(function() {\n        const direccion = direccionInput.value;\n        if (direccion.length > 3) {\n            geocodeService.geocode().text(direccion).run(function(error, resultado) {\n                if (resultado && resultado.results && resultado.results.length > 0) {\n                    const ubicacion = resultado.results[0].latlng;\n                    mapa.setView(ubicacion, 16);\n                    marker.setLatLng(ubicacion);\n\n                    // Llena los campos con la información obtenida\n                    document.querySelector('.calle').textContent = resultado.results[0].address.Match_addr || '';\n                    document.querySelector('#calle').value = resultado.results[0].address.Match_addr || '';\n                    document.querySelector('#lat').value = ubicacion.lat || '';\n                    document.querySelector('#lng').value = ubicacion.lng || '';\n                }\n            });\n        }\n    }, 500)); // Espera 500ms antes de llamar al geocoder\n})();\n\n\n//# sourceURL=webpack://bienesraices/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;