import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from "path";

import {start_listening} from "./api";
import * as http from "http";
import fs from "fs";
import {event} from "jquery";

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

export const default_config = {
  ip: "127.0.0.1",
  port: 2468,
  username: "",
  password: "",
  is_remember: true,
  is_save: true,
  noise_lower: 0.7,
  signal_lower: 0.7,
  tmp_dir: app.getPath("temp"),
  events_path: path.join(app.getPath("home"), "xrt.local", "event_db.json"),
  data_dir: path.join(app.getPath("home"), "xrt.local")
}

export let view_window: BrowserWindow;
let http_server: http.Server;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): BrowserWindow => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 500,
    width: 500,
    resizable: true,
    icon: "./src/img/xrt-logo.png",
    webPreferences:{
      preload: path.join(app.getAppPath(), "dist", "preload.js")
    }
  });

  // and load the index.html of the app.
  // mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.loadFile("./src/index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  return mainWindow;
};

const createViewer = (): BrowserWindow => {
  const viewWindow = new BrowserWindow({
    height: 800,
    width: 1000,
    resizable: true,
    icon: "./src/img/xrt-logo.png",
    webPreferences:{
      preload: path.join(app.getAppPath(), "dist", "preload.js")
    }
  })
  viewWindow.loadFile("./src/viwer.html");
  // Open the DevTools.
  viewWindow.webContents.openDevTools();
  return viewWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("login", (event, data): void => {
  if (data["username"] == "root" && data["password"] == "root"){
    event.returnValue = true;
    view_window = createViewer();
    http_server = start_listening(2468);
  }
  else {
    event.returnValue = false;
  }
})


ipcMain.handle("save_config", async (event, data) => {
  const config = data["config"];
  let config_path:string = data["config_path"];
  config_path = config_path|| path.join(app.getPath("home"), "xrt.local", "config.json");
  fs.writeFile(config_path, JSON.stringify(config), (err)=>{
    if (err){
      console.error("config save failed.");
      fs.mkdir(path.join(app.getPath("home"), "xrt.local"), (err) => {
        if (err){
          throw err;
        }
        fs.writeFile(config_path, JSON.stringify(config), (err) =>{
          if (err){
            throw err;
          }
          console.info("fixed.");
        })
      })
    }
    else {
      console.info("config saved.path:" + config_path);
    }
  })
  return config_path;
})


ipcMain.handle("read_config", async (event, data:string) => {
  let config_path:string = data;
  config_path = config_path|| path.join(app.getPath("home"), "xrt.local", "config.json");

  const result:Promise<any> = new Promise((resolve, reject) => {
    fs.readFile(config_path, "utf-8",(err, data) => {
      if (err){
        fs.writeFile(config_path, JSON.stringify(default_config), (err)=>{
          if (err){
            console.error("config save failed.");
            fs.mkdir(path.join(app.getPath("home"), "xrt.local"), (err) => {
              if (err){
                reject(err);
              }
              fs.writeFile(config_path, JSON.stringify(default_config), (err) =>{
                if (err){
                  reject(err);
                }
                console.info("fixed.");
              })
            })
          }
          else {
            console.info("config saved.path:" + config_path);
            resolve(default_config);
          }
        })

        reject(err)
      }
      else {
        resolve(JSON.parse(data));
      }
    })
  });
  return result;
})


ipcMain.handle("save_file", async (event, file_path: string, data: JSON) =>{
  const result:Promise<any> = new Promise((resolve, reject) =>{
    fs.writeFile(file_path, JSON.stringify(data), (err) => {
      if (err) {

        reject(err);
      }
      else {
        resolve(file_path);
      }
    })
  })
  return result;
})


ipcMain.handle("read_file", async (event, file_path:string) => {
  const result:Promise<any> = new Promise((resolve, reject) => {
    fs.readFile(file_path, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    })
  })
  return result;
})


ipcMain.handle("get_path", async (event, name:any) => {
  return app.getPath(name);
})


const check_file_access = (file_path:string, default_data:any) => {
  fs.access(file_path, fs.constants.F_OK, (err)=>{
    if(err){
      fs.writeFile(file_path, default_data, (err)=>{
        if (err){
          console.error("config save failed.");
          fs.mkdir(path.join(app.getPath("home"), "xrt.local"), (err) => {
            if (err){
              throw err;
            }
            fs.writeFile(file_path, default_data, (err) =>{
              if (err){
                throw err;
              }
              console.info("fixed.");
            })
          })
        }
      })
    }
  })
}


ipcMain.on("first_check", (event, events_path:string, data_dir:string) => {
  check_file_access(events_path, "[]");
  check_file_access(path.join(data_dir, "config.json"), JSON.stringify(default_config));
  check_file_access(path.join(data_dir, "feedback_db.json"), "[]");
})


ipcMain.on("default_config", (event) => {
  event.returnValue = default_config;
})
