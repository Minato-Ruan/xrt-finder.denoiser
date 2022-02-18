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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.view_window = exports.default_config = void 0;
var electron_1 = require("electron");
var path = __importStar(require("path"));
var api_1 = require("./api");
var fs_1 = __importDefault(require("fs"));
exports.default_config = {
    ip: "127.0.0.1",
    port: 2468,
    username: "",
    password: "",
    is_remember: true,
    is_save: true,
    noise_lower: 0.7,
    signal_lower: 0.7,
    tmp_dir: electron_1.app.getPath("temp"),
    events_path: path.join(electron_1.app.getPath("home"), "xrt.local", "event_db.json"),
    data_dir: path.join(electron_1.app.getPath("home"), "xrt.local")
};
var http_server;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    electron_1.app.quit();
}
var createWindow = function () {
    // Create the browser window.
    var mainWindow = new electron_1.BrowserWindow({
        height: 500,
        width: 500,
        resizable: true,
        icon: "./src/img/xrt-logo.png",
        webPreferences: {
            preload: path.join(electron_1.app.getAppPath(), "dist", "preload.js")
        }
    });
    // and load the index.html of the app.
    // mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.loadFile("./src/index.html");
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    return mainWindow;
};
var createViewer = function () {
    var viewWindow = new electron_1.BrowserWindow({
        height: 800,
        width: 1000,
        resizable: true,
        icon: "./src/img/xrt-logo.png",
        webPreferences: {
            preload: path.join(electron_1.app.getAppPath(), "dist", "preload.js")
        }
    });
    viewWindow.loadFile("./src/viwer.html");
    // Open the DevTools.
    viewWindow.webContents.openDevTools();
    return viewWindow;
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
electron_1.ipcMain.on("login", function (event, data) {
    if (data["username"] == "root" && data["password"] == "root") {
        event.returnValue = true;
        exports.view_window = createViewer();
        http_server = (0, api_1.start_listening)(2468);
    }
    else {
        event.returnValue = false;
    }
});
electron_1.ipcMain.handle("save_config", function (event, data) { return __awaiter(void 0, void 0, void 0, function () {
    var config, config_path;
    return __generator(this, function (_a) {
        config = data["config"];
        config_path = data["config_path"];
        config_path = config_path || path.join(electron_1.app.getPath("home"), "xrt.local", "config.json");
        fs_1["default"].writeFile(config_path, JSON.stringify(config), function (err) {
            if (err) {
                console.error("config save failed.");
                fs_1["default"].mkdir(path.join(electron_1.app.getPath("home"), "xrt.local"), function (err) {
                    if (err) {
                        throw err;
                    }
                    fs_1["default"].writeFile(config_path, JSON.stringify(config), function (err) {
                        if (err) {
                            throw err;
                        }
                        console.info("fixed.");
                    });
                });
            }
            else {
                console.info("config saved.path:" + config_path);
            }
        });
        return [2 /*return*/, config_path];
    });
}); });
electron_1.ipcMain.handle("read_config", function (event, data) { return __awaiter(void 0, void 0, void 0, function () {
    var config_path, result;
    return __generator(this, function (_a) {
        config_path = data;
        config_path = config_path || path.join(electron_1.app.getPath("home"), "xrt.local", "config.json");
        result = new Promise(function (resolve, reject) {
            fs_1["default"].readFile(config_path, "utf-8", function (err, data) {
                if (err) {
                    fs_1["default"].writeFile(config_path, JSON.stringify(exports.default_config), function (err) {
                        if (err) {
                            console.error("config save failed.");
                            fs_1["default"].mkdir(path.join(electron_1.app.getPath("home"), "xrt.local"), function (err) {
                                if (err) {
                                    reject(err);
                                }
                                fs_1["default"].writeFile(config_path, JSON.stringify(exports.default_config), function (err) {
                                    if (err) {
                                        reject(err);
                                    }
                                    console.info("fixed.");
                                });
                            });
                        }
                        else {
                            console.info("config saved.path:" + config_path);
                            resolve(exports.default_config);
                        }
                    });
                    reject(err);
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        });
        return [2 /*return*/, result];
    });
}); });
electron_1.ipcMain.handle("save_file", function (event, file_path, data) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        result = new Promise(function (resolve, reject) {
            fs_1["default"].writeFile(file_path, JSON.stringify(data), function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(file_path);
                }
            });
        });
        return [2 /*return*/, result];
    });
}); });
electron_1.ipcMain.handle("read_file", function (event, file_path) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        result = new Promise(function (resolve, reject) {
            fs_1["default"].readFile(file_path, "utf-8", function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
        return [2 /*return*/, result];
    });
}); });
electron_1.ipcMain.handle("get_path", function (event, name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, electron_1.app.getPath(name)];
    });
}); });
var check_file_access = function (file_path, default_data) {
    fs_1["default"].access(file_path, fs_1["default"].constants.F_OK, function (err) {
        if (err) {
            fs_1["default"].writeFile(file_path, default_data, function (err) {
                if (err) {
                    console.error("config save failed.");
                    fs_1["default"].mkdir(path.join(electron_1.app.getPath("home"), "xrt.local"), function (err) {
                        if (err) {
                            throw err;
                        }
                        fs_1["default"].writeFile(file_path, default_data, function (err) {
                            if (err) {
                                throw err;
                            }
                            console.info("fixed.");
                        });
                    });
                }
            });
        }
    });
};
electron_1.ipcMain.on("first_check", function (event, events_path, data_dir) {
    check_file_access(events_path, "[]");
    check_file_access(path.join(data_dir, "config.json"), JSON.stringify(exports.default_config));
    check_file_access(path.join(data_dir, "feedback_db.json"), "[]");
});
electron_1.ipcMain.on("default_config", function (event) {
    event.returnValue = exports.default_config;
});
//# sourceMappingURL=index.js.map