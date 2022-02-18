import crypto from "crypto"

import Koa, {Middleware} from "koa";
import Router from "koa-router";

import {view_window} from "./index";
import koaBody from "koa-body";
import * as http from "http";
import * as https from "https";

export function start_listening(port?:number): http.Server {
    if (port == null){
        port = 2468;
    }
    const app = new Koa();
    const router = new Router();

    router.post("/new", koaBody(), async (ctx, next) => {
        await next();
        const data = ctx.request.body;
        const hash = crypto
            .createHash('md5')
            .update(data["fits_name"] + data["pos_x"] + data["pos_y"])
            .digest('hex');

        const result:any = {
            image_data: data["data"],
            uid: hash,
            fits_name: data["fits_name"] || "unknown",
            pos: {
                x: data["pos_x"],
                y: data["pos_y"]
            },
            fake_image: data["fake-image"] || data["data"],
            predict_results: data["predict_results"]
        };
        // console.log("new event.")
        view_window.webContents.send("new_event", result)
    })

    console.log("created listener.")
    app.use(router.routes());

    // app.use(async (ctx, next) =>{
    //     await next();
    //     console.log("new event.")
    // })

    // app.listen(port);
    const http_server = http.createServer(app.callback());
    // const https_server = https.createServer(app.callback());
    http_server.listen(port);
    // https_server.listen(port);
    return http_server
}



