/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* global L */\n\nconst getPlaces = __webpack_require__(/*! ./getPlaces */ \"./src/getPlaces.js\");\n\n\nconst MAP_CENTER = [40.7055585, -73.989109 ];\nconst MAP_ZOOM = 13;\nvar map;\n\n\nvar memories = {};\n\n\nfunction drawMap() {\n  map = L.map('map').setView(MAP_CENTER, 13);\n\n  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {\n      attribution: '&copy; <a id=\"home-link\" target=\"_top\" href=\"../\">Map tiles</a> by <a target=\"_top\" href=\"http://stamen.com\">Stamen Design</a>, under <a target=\"_top\" href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a>. Data by <a target=\"_top\" href=\"http://openstreetmap.org\">OpenStreetMap</a>, under <a target=\"_top\" href=\"http://creativecommons.org/licenses/by-sa/3.0\">CC BY SA</a>.',\n      maxZoom: 18\n  }).addTo(map);\n  \n  // Map Events\n  map.on('click', onMapClick);\n}\n\nfunction drawPlace(place) {\n  var circle = L.circle([place.lat, place.long], {\n    color: '#57ccf7',\n    fillColor: '#57ccf7',\n    fillOpacity: 0.5,\n    radius: 100\n  }).addTo(map);\n}\n\nasync function onMapClick(e) {\n  \n  var id = (await savePlace(e.latlng.lat, e.latlng.long)).id;\n  console.log(\"ID\", id);\n  var popup = L.popup();\n  popup\n    .setLatLng(e.latlng)\n    .setContent(`\n      I am a standalone popup.\n    `)\n    .openOn(map);\n\n}\n\n\n\n\nasync function savePlace(lat, long) {\n  const url = '/api/new-place';\n  const options = {\n    method: 'POST',\n    headers: {\n      'Accept': 'application/json',\n      'Content-Type': 'application/json;charset=UTF-8'\n    },\n    body: JSON.stringify({\n      lat: lat,\n      long: long\n    })\n  };\n  /*\n  var response = await fetch(url, options)\n  const myJson = await response.json();\n  console.log(JSON.stringify(myJson));\n  return myJson;\n  */\n  return {}\n}\n\n\n(async function main() {\n  drawMap();\n  const places = await getPlaces();\n  console.log(places);\n  \n  for (var i in places) {\n    drawPlace(places[i]);\n  }\n  \n})();\n\n\n\n\n//# sourceURL=webpack:///./src/app.js?");

/***/ }),

/***/ "./src/getPlaces.js":
/*!**************************!*\
  !*** ./src/getPlaces.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval(" module.exports = async function() {\n   var response = await fetch(\"/api/places\");\n   return response.json();\n }\n\n//# sourceURL=webpack:///./src/getPlaces.js?");

/***/ })

/******/ });