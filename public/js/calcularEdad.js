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

/***/ "./src/js/calcularEdad.js":
/*!********************************!*\
  !*** ./src/js/calcularEdad.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\ndocument.addEventListener('DOMContentLoaded', function() {\r\n    const fechaNacimientoInput = document.getElementById('fechanacimiento');\r\n    const edadInput = document.getElementById('edad');\r\n    const mesesInput = document.getElementById('meses');\r\n  \r\n    fechaNacimientoInput.addEventListener('change', function() {\r\n        const fechaNacimiento = new Date(fechaNacimientoInput.value);\r\n        const hoy = new Date();\r\n        \r\n        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();\r\n        let mes = hoy.getMonth() - fechaNacimiento.getMonth();\r\n  \r\n        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {\r\n            edad--;\r\n            mes = (mes + 12) % 12;\r\n        }\r\n  \r\n        edadInput.value = edad;\r\n        mesesInput.value = mes;\r\n    });\r\n  });\r\n  \n\n//# sourceURL=webpack://bienesraices/./src/js/calcularEdad.js?");

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
/******/ 	__webpack_modules__["./src/js/calcularEdad.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;