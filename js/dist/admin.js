/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/components/GenerateUsersPage.js":
/*!***************************************************!*\
  !*** ./src/admin/components/GenerateUsersPage.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GenerateUsersPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);



var GenerateUsersPage = /*#__PURE__*/function (_Component) {
  function GenerateUsersPage() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(GenerateUsersPage, _Component);
  var _proto = GenerateUsersPage.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.loading = false;
    this.count = 1;
    this.discussions = []; //Дискуссия
    this.discussion_id = null; // id дискуссии
  };
  _proto.view = function view() {
    var _this = this;
    return m("div", {
      className: "GenerateUsersPage"
    }, m("div", {
      className: "container"
    }, m("h2", null, "Generate Users"), m("div", {
      className: "Form"
    }, m("div", {
      className: "Form-group"
    }, m("label", null, "Number of users to generate:"), m("input", {
      type: "number",
      value: this.count,
      oninput: function oninput(e) {
        return _this.count = parseInt(e.target.value);
      },
      min: "1",
      max: "100"
    })), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button Button--primary",
      disabled: this.loading,
      onclick: function onclick() {
        return _this.generateUsers();
      }
    }, this.loading ? 'Generating...' : 'Generate Users'), m("select", {
      onchange: function onchange(e) {
        return _this.discussion_id = e.target.value;
      },
      onfocus: function onfocus() {
        return _this.loadOptions();
      } // Загружаем данные при фокусе на списке
    }, m("option", {
      value: ""
    }, "Select a discussion"), this.discussions.map(function (option) {
      return m("option", {
        value: option.id
      }, "discuss_id: " + option.id + " - " + option.title + " (user_id: " + option.user_id + ")") // Предполагается, что у объекта option есть свойства value и label
      ;
    })), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button Button--secondary",
      onclick: function onclick() {
        return _this.submitData();
      },
      disabled: !this.discussion_id // Кнопка отключена, если ничего не выбрано
    }, "Submit"))));
  };
  _proto.generateUsers = function generateUsers() {
    var _this2 = this;
    console.log("Количество пользователей для генерации:", this.count);
    this.loading = true;
    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/generate-users',
      body: {
        count: this.count
      }
    }).then(function (response) {
      app.alerts.show({
        type: 'success'
      }, app.translator.trans('your-vendor-generate-users.admin.users_generated', {
        count: response.users.length
      }));
    })["catch"](function (error) {
      app.alerts.show({
        type: 'error'
      }, 'Error generating users: ' + error.message);
    })["finally"](function () {
      _this2.loading = false;
      m.redraw();
    });
  };
  _proto.loadOptions = function loadOptions() {
    var _this3 = this;
    app.request({
      method: 'GET',
      // Используем метод GET для запроса
      url: app.forum.attribute('apiUrl') + '/getDiscussion' // Укажите URL вашего API
    }).then(function (data) {
      _this3.discussions = data; // Сохраняем данные в состоянии компонента
      m.redraw(); // Перерисовываем компонент
    })["catch"](function (error) {
      console.error('Ошибка при загрузке данных:', error);
    });
  }

  // submitData() {
  //   app.request({
  //     method: 'POST',
  //     url: app.forum.attribute('apiUrl') + '/generatePosts',
  //     body: JSON.stringify({ discussion_id: this.discussion_id }), // Отправляем выбранное значение
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('Ответ от сервера:', data);
  //       // Здесь можно обработать ответ от сервера
  //     })
  //     .catch(error => {
  //       console.error('Ошибка при отправке данных:', error);
  //     });
  // }
  ;
  _proto.submitData = function submitData() {
    var _this4 = this;
    // Убедитесь, что discussion_id имеет корректное значение (число)
    if (this.discussion_id === null) {
      console.error('discussion_id не установлен');
      return; // Прекращаем выполнение, если discussion_id не задан
    }
    this.loading = true; // Устанавливаем состояние загрузки

    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/generatePosts',
      body: {
        discussion_id: this.discussion_id,
        count: this.count
      } // Отправляем выбранное значение
    }).then(function (response) {
      // Обработка успешного ответа
      console.log('Ответ от сервера:', response);
      app.alerts.show({
        type: 'success'
      }, 'Данные успешно отправлены для дискуссии с ID: ' + _this4.discussion_id);
    })["catch"](function (error) {
      // Обработка ошибок
      app.alerts.show({
        type: 'error'
      }, 'Ошибка при отправке данных: ' + error.message);
    })["finally"](function () {
      _this4.loading = false; // Сбрасываем состояние загрузки
      m.redraw(); // Перерисовываем компонент
    });
  };
  return GenerateUsersPage;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/admin/index.ts":
/*!****************************!*\
  !*** ./src/admin/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_GenerateUsersPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/GenerateUsersPage */ "./src/admin/components/GenerateUsersPage.js");



// app.initializers.add('imynely/generate-users', () => {
//   console.log('[imynely/generate-users] Hello, admin!');
// });

flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('imynely/generate-users', function () {
  flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().extensionData["for"]('imynely-generate-users').registerPage(_components_GenerateUsersPage__WEBPACK_IMPORTED_MODULE_1__["default"]);
});

/***/ }),

/***/ "./src/common/index.ts":
/*!*****************************!*\
  !*** ./src/common/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_0__);

flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('imynely/generate-users', function () {
  console.log('[imynely/generate-users] Hello, forum and admin!');
});

/***/ }),

/***/ "flarum/admin/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['admin/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/app'];

/***/ }),

/***/ "flarum/common/Component":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/Component']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Component'];

/***/ }),

/***/ "flarum/common/app":
/*!***************************************************!*\
  !*** external "flarum.core.compat['common/app']" ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/app'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t, o);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./admin.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/common */ "./src/common/index.ts");
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.ts");


})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=admin.js.map