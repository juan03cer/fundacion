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

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\n    const lat = 19.4153897;\n    const lng = -99.1649381;\n    const mapa = L.map('mapa-inicio').setView([lat, lng ], 13);\n    \n    let markers = new L.FeatureGroup().addTo(mapa)\n\n    let pacientes=[];\n\n    //Filtros\n     const filtros = {\n        campaign:''\n     }\n     \n     const campaignsSelect= document.querySelector('#campaign');\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa);\n    \n\n    //Filtrado de campañas\n    campaignsSelect.addEventListener('change', e => {\n        filtros.campaign = +e.target.value\n        filtraPacientes()\n    })\n\n    const obtenerPacientes =async () =>{\n        try{\n            const url = '/api/pacientes'\n            const respuesta = await fetch(url)\n             pacientes = await respuesta.json()\n\n            mostrarPacientes(pacientes)\n\n        }catch(error){\n            console.log(error)\n        }\n    }\n\n    const mostrarPacientes = pacientes => {\n        // Limpiar los markers previos\n        markers.clearLayers()\n    \n        pacientes.forEach(paciente => {\n            if (paciente.publicado) { // Verificar si el paciente está publicado\n                // Agregar los pines solo si el paciente está publicado\n                const marker = new L.marker([paciente?.lat, paciente?.lng], {\n                        autoPan: true\n                    })\n                    .addTo(mapa)\n                    .bindPopup(`\n                        <h1 class=\"text-xl font-extrabold uppercase my-5 m-5\">${paciente?.nombre}</h1>\n                        <p class=\"text-gray-600 font-bold\"> </p> \n                        <a href=\"/pacientes/${paciente.id}\" style=\"color: white; \" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase\">Ver Paciente</a>\n                    `)\n    \n                markers.addLayer(marker)\n            }\n        })\n    }\n    \n\n    const filtraPacientes =()=>{\n        const resultado =pacientes.filter(filtrarCampaign)\n        mostrarPacientes(resultado)\n\n    }\n\n    const filtrarCampaign =paciente=> filtros.campaign ? paciente. campaignid == filtros.campaign :paciente\n    \n\n    obtenerPacientes()\n\n})()\n\n//# sourceURL=webpack://bienesraices/./src/js/mapaInicio.js?");

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
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;