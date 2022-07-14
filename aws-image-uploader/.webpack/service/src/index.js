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

/***/ "./src/handler/auth.handler.ts":
/*!*************************************!*\
  !*** ./src/handler/auth.handler.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst handler_1 = __webpack_require__(/*! ./handler */ \"./src/handler/handler.ts\");\r\nclass AuthHandler {\r\n    constructor(authService) {\r\n        this.authService = authService;\r\n        this.authService = authService;\r\n    }\r\n    signIn(event) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (event)\r\n                console.log('Event exists');\r\n            return new handler_1.Response(200, JSON.stringify(this.authService.signIn()));\r\n        });\r\n    }\r\n    signUp(event) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (event)\r\n                console.log('Event exists');\r\n            return new handler_1.Response(201, JSON.stringify(this.authService.signUp()));\r\n        });\r\n    }\r\n}\r\nexports[\"default\"] = AuthHandler;\r\n\n\n//# sourceURL=webpack://aws-image-uploader/./src/handler/auth.handler.ts?");

/***/ }),

/***/ "./src/handler/bucket.handler.ts":
/*!***************************************!*\
  !*** ./src/handler/bucket.handler.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst handler_1 = __webpack_require__(/*! ./handler */ \"./src/handler/handler.ts\");\r\nclass BucketHandler {\r\n    constructor(bucketService) {\r\n        this.bucketService = bucketService;\r\n        this.bucketService = bucketService;\r\n    }\r\n    getAllImages(event) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (event)\r\n                console.log('Event exists');\r\n            return new handler_1.Response(200, JSON.stringify(this.bucketService.getAllImages()));\r\n        });\r\n    }\r\n    uploadImage(event) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (event)\r\n                console.log('Event exists');\r\n            return new handler_1.Response(201, JSON.stringify(this.bucketService.uploadImage()));\r\n        });\r\n    }\r\n    deleteImage(event) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (event)\r\n                console.log('Event exists');\r\n            return new handler_1.Response(200, JSON.stringify(this.bucketService.deleteImage()));\r\n        });\r\n    }\r\n}\r\nexports[\"default\"] = BucketHandler;\r\n\n\n//# sourceURL=webpack://aws-image-uploader/./src/handler/bucket.handler.ts?");

/***/ }),

/***/ "./src/handler/handler.ts":
/*!********************************!*\
  !*** ./src/handler/handler.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Response = void 0;\r\nconst auth_handler_1 = __importDefault(__webpack_require__(/*! ./auth.handler */ \"./src/handler/auth.handler.ts\"));\r\nconst bucket_handler_1 = __importDefault(__webpack_require__(/*! ./bucket.handler */ \"./src/handler/bucket.handler.ts\"));\r\nconst auth_service_1 = __importDefault(__webpack_require__(/*! ../service/auth.service */ \"./src/service/auth.service.ts\"));\r\nconst bucket_service_1 = __importDefault(__webpack_require__(/*! ../service/bucket.service */ \"./src/service/bucket.service.ts\"));\r\nclass Response {\r\n    constructor(statusCode, body) {\r\n        this.statusCode = statusCode;\r\n        this.body = body;\r\n    }\r\n}\r\nexports.Response = Response;\r\nclass Handler {\r\n    constructor() {\r\n        this.auth = new auth_handler_1.default(new auth_service_1.default());\r\n        this.bucket = new bucket_handler_1.default(new bucket_service_1.default());\r\n    }\r\n}\r\nexports[\"default\"] = new Handler();\r\n\n\n//# sourceURL=webpack://aws-image-uploader/./src/handler/handler.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.deleteImage = exports.uploadImage = exports.getAllImages = exports.signUp = exports.signIn = void 0;\r\nconst core_1 = __importDefault(__webpack_require__(/*! @middy/core */ \"./node_modules/@middy/core/index.cjs\"));\r\nconst handler_1 = __importDefault(__webpack_require__(/*! ./handler/handler */ \"./src/handler/handler.ts\"));\r\nexports.signIn = (0, core_1.default)(handler_1.default.auth.signIn.bind(handler_1.default.auth));\r\nexports.signUp = (0, core_1.default)(handler_1.default.auth.signUp.bind(handler_1.default.auth));\r\nexports.getAllImages = (0, core_1.default)(handler_1.default.bucket.getAllImages.bind(handler_1.default.bucket));\r\nexports.uploadImage = (0, core_1.default)(handler_1.default.bucket.uploadImage.bind(handler_1.default.bucket));\r\nexports.deleteImage = (0, core_1.default)(handler_1.default.bucket.deleteImage.bind(handler_1.default.bucket));\r\n\n\n//# sourceURL=webpack://aws-image-uploader/./src/index.ts?");

/***/ }),

/***/ "./src/service/auth.service.ts":
/*!*************************************!*\
  !*** ./src/service/auth.service.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nclass AuthService {\r\n    signIn() {\r\n        return 'SignIn';\r\n    }\r\n    signUp() {\r\n        return 'SignUp';\r\n    }\r\n}\r\nexports[\"default\"] = AuthService;\r\n\n\n//# sourceURL=webpack://aws-image-uploader/./src/service/auth.service.ts?");

/***/ }),

/***/ "./src/service/bucket.service.ts":
/*!***************************************!*\
  !*** ./src/service/bucket.service.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nclass BucketService {\r\n    getAllImages() {\r\n        return 'GetAllImages';\r\n    }\r\n    uploadImage() {\r\n        return 'UploadImage';\r\n    }\r\n    deleteImage() {\r\n        return 'DeleteImage';\r\n    }\r\n}\r\nexports[\"default\"] = BucketService;\r\n\n\n//# sourceURL=webpack://aws-image-uploader/./src/service/bucket.service.ts?");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "./node_modules/@middy/core/index.cjs":
/*!********************************************!*\
  !*** ./node_modules/@middy/core/index.cjs ***!
  \********************************************/
/***/ ((module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({\n    value: true\n}));\nmodule.exports = void 0;\nvar _events = __webpack_require__(/*! events */ \"events\");\nconst defaultLambdaHandler = ()=>{};\nconst defaultPlugin = {\n    timeoutEarlyInMillis: 5,\n    timeoutEarlyResponse: ()=>{\n        throw new Error('Timeout');\n    }\n};\nconst middy = (lambdaHandler = defaultLambdaHandler, plugin = {})=>{\n    if (typeof lambdaHandler !== 'function') {\n        plugin = lambdaHandler;\n        lambdaHandler = defaultLambdaHandler;\n    }\n    plugin = {\n        ...defaultPlugin,\n        ...plugin\n    };\n    plugin.timeoutEarly = plugin.timeoutEarlyInMillis > 0;\n    plugin.beforePrefetch?.();\n    const beforeMiddlewares = [];\n    const afterMiddlewares = [];\n    const onErrorMiddlewares = [];\n    const middy1 = (event = {}, context = {})=>{\n        plugin.requestStart?.();\n        const request = {\n            event,\n            context,\n            response: undefined,\n            error: undefined,\n            internal: plugin.internal ?? {}\n        };\n        return runRequest(request, [\n            ...beforeMiddlewares\n        ], lambdaHandler, [\n            ...afterMiddlewares\n        ], [\n            ...onErrorMiddlewares\n        ], plugin);\n    };\n    middy1.use = (middlewares)=>{\n        if (!Array.isArray(middlewares)) {\n            middlewares = [\n                middlewares\n            ];\n        }\n        for (const middleware of middlewares){\n            const { before , after , onError  } = middleware;\n            if (!before && !after && !onError) {\n                throw new Error('Middleware must be an object containing at least one key among \"before\", \"after\", \"onError\"');\n            }\n            if (before) middy1.before(before);\n            if (after) middy1.after(after);\n            if (onError) middy1.onError(onError);\n        }\n        return middy1;\n    };\n    middy1.before = (beforeMiddleware)=>{\n        beforeMiddlewares.push(beforeMiddleware);\n        return middy1;\n    };\n    middy1.after = (afterMiddleware)=>{\n        afterMiddlewares.unshift(afterMiddleware);\n        return middy1;\n    };\n    middy1.onError = (onErrorMiddleware)=>{\n        onErrorMiddlewares.unshift(onErrorMiddleware);\n        return middy1;\n    };\n    middy1.handler = (replaceLambdaHandler)=>{\n        lambdaHandler = replaceLambdaHandler;\n        return middy1;\n    };\n    return middy1;\n};\nconst runRequest = async (request, beforeMiddlewares, lambdaHandler, afterMiddlewares, onErrorMiddlewares, plugin)=>{\n    const timeoutEarly = plugin.timeoutEarly && request.context.getRemainingTimeInMillis;\n    try {\n        await runMiddlewares(request, beforeMiddlewares, plugin);\n        if (request.response === undefined) {\n            plugin.beforeHandler?.();\n            const handlerAbort = new AbortController();\n            let timeoutAbort;\n            if (timeoutEarly) timeoutAbort = new AbortController();\n            request.response = await Promise.race([\n                lambdaHandler(request.event, request.context, {\n                    signal: handlerAbort.signal\n                }),\n                timeoutEarly ? setTimeoutPromise(request.context.getRemainingTimeInMillis() - plugin.timeoutEarlyInMillis, {\n                    signal: timeoutAbort.signal\n                }).then(()=>{\n                    handlerAbort.abort();\n                    return plugin.timeoutEarlyResponse();\n                }) : Promise.race([])\n            ]);\n            if (timeoutEarly) timeoutAbort.abort();\n            plugin.afterHandler?.();\n            await runMiddlewares(request, afterMiddlewares, plugin);\n        }\n    } catch (e) {\n        request.response = undefined;\n        request.error = e;\n        try {\n            await runMiddlewares(request, onErrorMiddlewares, plugin);\n        } catch (e) {\n            e.originalError = request.error;\n            request.error = e;\n            throw request.error;\n        }\n        if (request.response === undefined) throw request.error;\n    } finally{\n        await plugin.requestEnd?.(request);\n    }\n    return request.response;\n};\nconst runMiddlewares = async (request, middlewares, plugin)=>{\n    for (const nextMiddleware of middlewares){\n        plugin.beforeMiddleware?.(nextMiddleware.name);\n        const res = await nextMiddleware(request);\n        plugin.afterMiddleware?.(nextMiddleware.name);\n        if (res !== undefined) {\n            request.response = res;\n            return;\n        }\n    }\n};\nconst polyfillAbortController = ()=>{\n    if (process.version < 'v15.0.0') {\n        class AbortSignal {\n            toString() {\n                return '[object AbortSignal]';\n            }\n            get [Symbol.toStringTag]() {\n                return 'AbortSignal';\n            }\n            removeEventListener(name, handler) {\n                this.eventEmitter.removeListener(name, handler);\n            }\n            addEventListener(name, handler) {\n                this.eventEmitter.on(name, handler);\n            }\n            dispatchEvent(type) {\n                const event = {\n                    type,\n                    target: this\n                };\n                const handlerName = `on${type}`;\n                if (typeof this[handlerName] === 'function') this[handlerName](event);\n                this.eventEmitter.emit(type, event);\n            }\n            constructor(){\n                this.eventEmitter = new _events.EventEmitter();\n                this.onabort = null;\n                this.aborted = false;\n            }\n        }\n        return class AbortController {\n            abort() {\n                if (this.signal.aborted) return;\n                this.signal.aborted = true;\n                this.signal.dispatchEvent('abort');\n            }\n            toString() {\n                return '[object AbortController]';\n            }\n            get [Symbol.toStringTag]() {\n                return 'AbortController';\n            }\n            constructor(){\n                this.signal = new AbortSignal();\n            }\n        };\n    } else {\n        return AbortController;\n    }\n};\nglobal.AbortController = polyfillAbortController();\nconst polyfillSetTimeoutPromise = ()=>{\n    return (ms, { signal  })=>{\n        if (signal.aborted) {\n            return Promise.reject(new Error('Aborted', 'AbortError'));\n        }\n        return new Promise((resolve, reject)=>{\n            const abortHandler = ()=>{\n                clearTimeout(timeout);\n                reject(new Error('Aborted', 'AbortError'));\n            };\n            const timeout = setTimeout(()=>{\n                resolve();\n                signal.removeEventListener('abort', abortHandler);\n            }, ms);\n            signal.addEventListener('abort', abortHandler);\n        });\n    };\n};\nconst setTimeoutPromise = polyfillSetTimeoutPromise();\nvar _default = middy;\nmodule.exports = _default;\n\n\n//# sourceMappingURL=index.cjs.map\n\n//# sourceURL=webpack://aws-image-uploader/./node_modules/@middy/core/index.cjs?");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;