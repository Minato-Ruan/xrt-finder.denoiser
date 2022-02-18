import {contextBridge, ipcRenderer, session} from "electron"
import * as path from "path";

// import {default_config} from "./index";


const get_path = async (name:any) =>{
    const result:string = await ipcRenderer.invoke("get_path", name);
    return result;
}


contextBridge.exposeInMainWorld(
    "user",
    {
        login: (data:{[name:string]: string}):boolean => {
            return ipcRenderer.sendSync("login", data);
        },
        save: (data:{[name:string]: string}): void =>{
            session.defaultSession.cookies.set(
                {
                    url: "com.xrt.local",
                    name: "username",
                    value: data["username"],
                }
            )
            session.defaultSession.cookies.set(
                {
                    url: "com.xrt.local",
                    name: "password",
                    value: data["password"],
                }
            )
        }
    }
)

contextBridge.exposeInMainWorld(
    "view_io",
    {
        listen: (func:(event:any, data:any) => void) =>{
            ipcRenderer.on("new_event", (event, data) => {
                func(event, data);
            })
        },
        get_default: () => {
            return ipcRenderer.sendSync("default_config")
        }
    }
)

contextBridge.exposeInMainWorld(
    "file_io",
    {
        first_check: async (events_path: string,
                            data_dir: string) => {
            const result = await ipcRenderer.sendSync("first_check", events_path, data_dir)
        },
        save_config: async (config: {[index: string]: string|number}, config_path?:string) =>{
            const req = {
                config: config,
                config_path: config_path
            };
            // const path = await ipcRenderer.invoke("test", req);
            const path = await ipcRenderer.invoke("save_config", req);
            console.info("save config.path: " + path)
            return path
        },

        read_config: async (config_path?:string) => {
            const result = await ipcRenderer.invoke("read_config", config_path)
            console.log("read config." + result)
            return result
        },

        read_events: async (event_path?:string) => {
            const home_path = await get_path("home");
            event_path = event_path || path.join(home_path, "xrt.local", "event_db.json");
            const event_json = await ipcRenderer.invoke("read_file", event_path);
            let result = JSON.parse(event_json);
            if (!Array.isArray(result)){
                result = [result];
            }

            return result;
        },

        save_events: async (data:Array<{[index:string]:string|number}>, event_path?:string) =>{
            const home_path = await get_path("home");
            event_path = event_path || path.join(home_path, "xrt.local", "event_db.json");
            const result = await ipcRenderer.invoke("save_file", event_path, data);

            return result;
        },

        add_event: async (data: {[index:string]:string|number}, event_path?:string) => {
            const home_path = await get_path("home");
            event_path = event_path || path.join(home_path, "xrt.local", "event_db.json");

            let new_data: any;
            try{
                const event_json = await ipcRenderer.invoke("read_file", event_path);
                new_data = JSON.parse(event_json);
            }
            catch (e) {
                console.error(e)
                new_data = []
            }

            if (!Array.isArray(new_data)){
                new_data = [new_data];
            }
            new_data.push(data);
            console.info("save event data: " + JSON.stringify(data));
            return await ipcRenderer.invoke("save_file", event_path, new_data);
        }
    }
)


contextBridge.exposeInMainWorld(
    "feed_back",
    {
        add: async (uid:string, result: "signal" | "noise", data_path?:string) => {
            const home_path = await get_path("home");
            data_path = data_path || path.join(home_path, "xrt.local", "feedback_db.json");

            let new_data: any
            try {
                const event_json = await ipcRenderer.invoke("read_file", data_path);
                new_data = JSON.parse(event_json);
            }
            catch (e) {
                console.error(e);
                new_data = []
            }
            if (!Array.isArray(new_data)){
                new_data = [new_data];
            }
            new_data.push({
                uid: uid,
                result: result
            });
            console.info("save feedback: " + uid);
            return await ipcRenderer.invoke("save_file", data_path, new_data);
        }
    })


contextBridge.exposeInMainWorld("test",{
    test: () => {
        return get_path("home")
    }
})

console.log("Finished preload.");
