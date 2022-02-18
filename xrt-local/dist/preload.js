"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var electron_1 = require("electron");
var path = __importStar(require("path"));
// import {default_config} from "./index";
var get_path = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke("get_path", name)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
electron_1.contextBridge.exposeInMainWorld("user", {
    login: function (data) {
        return electron_1.ipcRenderer.sendSync("login", data);
    },
    save: function (data) {
        electron_1.session.defaultSession.cookies.set({
            url: "com.xrt.local",
            name: "username",
            value: data["username"]
        });
        electron_1.session.defaultSession.cookies.set({
            url: "com.xrt.local",
            name: "password",
            value: data["password"]
        });
    }
});
electron_1.contextBridge.exposeInMainWorld("view_io", {
    listen: function (func) {
        electron_1.ipcRenderer.on("new_event", function (event, data) {
            func(event, data);
        });
    },
    get_default: function () {
        return electron_1.ipcRenderer.sendSync("default_config");
    }
});
electron_1.contextBridge.exposeInMainWorld("file_io", {
    first_check: function (events_path, data_dir) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, electron_1.ipcRenderer.sendSync("first_check", events_path, data_dir)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    save_config: function (config, config_path) { return __awaiter(void 0, void 0, void 0, function () {
        var req, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = {
                        config: config,
                        config_path: config_path
                    };
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke("save_config", req)];
                case 1:
                    path = _a.sent();
                    console.info("save config.path: " + path);
                    return [2 /*return*/, path];
            }
        });
    }); },
    read_config: function (config_path) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke("read_config", config_path)];
                case 1:
                    result = _a.sent();
                    console.log("read config." + result);
                    return [2 /*return*/, result];
            }
        });
    }); },
    read_events: function (event_path) { return __awaiter(void 0, void 0, void 0, function () {
        var home_path, event_json, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get_path("home")];
                case 1:
                    home_path = _a.sent();
                    event_path = event_path || path.join(home_path, "xrt.local", "event_db.json");
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke("read_file", event_path)];
                case 2:
                    event_json = _a.sent();
                    result = JSON.parse(event_json);
                    if (!Array.isArray(result)) {
                        result = [result];
                    }
                    return [2 /*return*/, result];
            }
        });
    }); },
    save_events: function (data, event_path) { return __awaiter(void 0, void 0, void 0, function () {
        var home_path, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get_path("home")];
                case 1:
                    home_path = _a.sent();
                    event_path = event_path || path.join(home_path, "xrt.local", "event_db.json");
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke("save_file", event_path, data)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    }); },
    add_event: function (data, event_path) { return __awaiter(void 0, void 0, void 0, function () {
        var home_path, new_data, event_json, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get_path("home")];
                case 1:
                    home_path = _a.sent();
                    event_path = event_path || path.join(home_path, "xrt.local", "event_db.json");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke("read_file", event_path)];
                case 3:
                    event_json = _a.sent();
                    new_data = JSON.parse(event_json);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.error(e_1);
                    new_data = [];
                    return [3 /*break*/, 5];
                case 5:
                    if (!Array.isArray(new_data)) {
                        new_data = [new_data];
                    }
                    new_data.push(data);
                    console.info("save event data: " + JSON.stringify(data));
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke("save_file", event_path, new_data)];
                case 6: return [2 /*return*/, _a.sent()];
            }
        });
    }); }
});
electron_1.contextBridge.exposeInMainWorld("feed_back", {
    add: function (uid, result, data_path) { return __awaiter(void 0, void 0, void 0, function () {
        var home_path, new_data, event_json, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get_path("home")];
                case 1:
                    home_path = _a.sent();
                    data_path = data_path || path.join(home_path, "xrt.local", "feedback_db.json");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke("read_file", data_path)];
                case 3:
                    event_json = _a.sent();
                    new_data = JSON.parse(event_json);
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    console.error(e_2);
                    new_data = [];
                    return [3 /*break*/, 5];
                case 5:
                    if (!Array.isArray(new_data)) {
                        new_data = [new_data];
                    }
                    new_data.push({
                        uid: uid,
                        result: result
                    });
                    console.info("save feedback: " + uid);
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke("save_file", data_path, new_data)];
                case 6: return [2 /*return*/, _a.sent()];
            }
        });
    }); }
});
electron_1.contextBridge.exposeInMainWorld("test", {
    test: function () {
        return get_path("home");
    }
});
console.log("Finished preload.");
//# sourceMappingURL=preload.js.map