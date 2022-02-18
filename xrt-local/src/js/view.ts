// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare const view_io: { [index:string]: any };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare const file_io: { [index:string]: any };
declare const feed_back: { [index:string]: any };

let config_settings: {[index:string]: any};
let event_list: Array<{[index:string]: any}>;

const update_image = (object:JQuery ,b64:string): void => {
    const html: string = `data:image/png;base64,` + b64;
    object.attr("src", html);
}

let now_uid: string;

const update_event = (data: any): void=> {
    const data_box = $("#data-box");
    const lbl_result = $("#lbl-result")

    now_uid = data["uid"];

    data_box.empty();
    update_image($("#fits-1"), data.fake_image["fits-1"]);
    update_image($("#fits-2"), data.fake_image["fits-2"]);
    update_image($("#fits-3"), data.fake_image["fits-3"]);

    const uid_html = `<tr><td scope="row">id_</td><td>UID</td><td><code>${ data["uid"] }</code></td></tr>`;
    const fits_name_html = `<tr><td scope="row">1</td><td>Fits Name</td><td><code>${ data["fits_name"] }</code></td></tr>`;
    const position_html = `<tr><td scope="row">2</td><td>Position</td><td><code>x: ${ data.pos["x"] }, y: ${ data.pos["y"] }</code></td></tr>`;
    const result_signal_html = `<tr><td scope="row">3</td><td>Signal</td><td>${ data.predict_results[1] }</td></tr>`;
    const result_noise_html = `<tr><td scope="row">4</td><td>Noise</td><td>${ data.predict_results[0] }</td></tr>`;
    data_box.append(uid_html, fits_name_html, position_html, result_signal_html, result_noise_html);

    lbl_result.removeClass("bg-success bg-danger bg-info")
    if(data.predict_results[1] > config_settings["signal_lower"]){
        lbl_result.html("<div>Signal</div>");
        lbl_result.addClass("bg-success");
    }
    else if (data.predict_results[0] > config_settings["noise_lower"]) {
        lbl_result.html("<div>Noise</div>");
        lbl_result.addClass("bg-danger");
    }
    else {
        lbl_result.html("<div>Un-known</div>");
        lbl_result.addClass("bg-info");
    }

    $("#btn-report-noise").prop("disabled", false);
    $("#btn-report-noise").removeClass("btn-outline-dark")
    $("#btn-report-signal").prop("disabled", false);
    $("#btn-report-signal").removeClass("btn-outline-dark")


    $("#event-box").html($("#event-box").html() + generate_event_html(data))
}


// template of history box.
const generate_event_html = (data: {[index:string]: any}) => {
    let box_class: string;
    const b64_image: string = data["fake_image"]["fits-1"]

    if(data.predict_results[1] > config_settings["signal_lower"]){
        box_class = "border-success";
    }
    else if (data.predict_results[0] > config_settings["noise_lower"]) {
        box_class = "border-danger";
    }
    else {
        box_class = "border-info";
    }


    const html = `
                    <div id="history-${data["uid"]}" class="border ${box_class} border-edge-2 rounded rounded-lg shadow p-2 m-2">
                        <h4 class="text-center">${data["fits_name"]}</h4>
                        <div class="row justify-content-center">
                            <div class="col-4 mt-1 mb-1 ml-2 mr-2 ml-lg-1 mr-lg-1 p-2">
                                <img src="data:image/png;base64,${b64_image}" class="img-fluid img-thumbnail fits-image-full">
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-2 text-right">Id_</div>
                            <div class="col-4 text-left hash-history"><code>${data["uid"]}</code></div>
                            <div class="col-2 text-right">Result (noise:signal)</div>
                            <div class="col-4 text-left result-history">
                                <code>{${data["predict_results"][0]}, ${data["predict_results"][1]}}</code>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-2 text-right">x</div>
                            <div class="col-4 text-left"><code>${data["pos"]["x"]}</code></div>
                            <div class="col-2 text-right">y</div>
                            <div class="col-4 text-left"><code>${data["pos"]["y"]}</code></div>
                        </div>
                    </divid>`;

    return html;
}


const save_feedback = (uid: string, feedback: "noise" | "signal") => {
    feed_back.add(uid, feedback)
        .then((path: string) => {console.info("saved feedback to:" + path)})
}


const switch_button = (feedback: "noise" | "signal") => {
    let my_btn: JQuery;
    let his_btn: JQuery;
    if (feedback == "signal"){
        my_btn = $("#btn-report-signal");
        his_btn = $("#btn-report-noise");
    }
    else {
        my_btn = $("#btn-report-noise");
        his_btn = $("#btn-report-signal");
    }

    my_btn.prop("disabled", true)
    his_btn.prop("disabled", true)

    his_btn.addClass("btn-outline-dark")
}


$(document).ready(
    () => {
        let signal_lower = 0.7;
        let noise_lower = 0.7;
        let events_path: string;

        file_io.read_config()
            .then((app_config:any) => {
                config_settings = app_config;
                signal_lower = app_config["signal_lower"];
                noise_lower = app_config["noise_lower"];
                events_path = app_config["events_path"];

                console.log("event.path:" + events_path );

                return file_io.read_events(events_path);
            })
            .then((events: any) => {
                event_list = events;

                for (const index in events) {
                    $("#event-box").html($("#event-box").html() + generate_event_html(events[index]))
                }
            })
            .catch((err:any) => {
                console.error(err);
                try{
                    file_io.save_events([],events_path);
                    console.info("fixed.")
                }catch (e) {
                    throw err;
                }
            })

        $("#data-box").empty();
        view_io.listen((event: any, data: any) => {
            update_event(data);
            event_list.push(data)
            file_io.add_event(data);
        });

        $("#btn-report-signal").on("click", () =>{
            switch_button("signal");
            save_feedback(now_uid, "signal");
        })
        $("#btn-report-noise").on("click", () =>{
            switch_button("noise");
            save_feedback(now_uid, "noise");
        })
    }
)
