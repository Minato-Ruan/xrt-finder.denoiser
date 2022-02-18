declare const user: { [index:string]: any };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare const file_io: { [index:string]: any };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare const view_io: {[index:string]: any };

let app_config: any;

const login = () => {
    const dict: {[name:string]: any} = {
        "username": $("#text_username").val(),
        "password": $("#text_password").val()
    };
    if(user.login(dict)){
        if ($("#check_remem").is(":checked")){
            app_config["username"] = $("#text_username").val();
            app_config["password"] = $("#text_password").val();
            app_config["is_remember"] = true;
            file_io.save_config(app_config);
        }
        else {
            app_config["username"] = "";
            app_config["password"] = "";
            app_config["is_remember"] = false;
            file_io.save_config(app_config);
        }
        window.close();
    }
    else {
        $("#loginFeedback").show()
        $("#text_username").val("")
        $("#text_username").addClass("is-invalid")
        $("#text_password").val("")
        $("#text_password").addClass("is-invalid")
    }
}

$(document).ready(
    ()=>{
        file_io.read_config()
            .then((data:any) => {
                app_config = data;
                console.info(JSON.stringify(data));
                $("#text_username").val(data["username"]);
                $("#text_password").val(data["password"]);
                $("#check_remem").prop("checked", data["is_remember"]);

                file_io.first_check(app_config["events_path"], app_config["data_dir"]);
            })
            .catch((err:any) => {
                app_config = view_io.get_default();
                file_io.first_check(app_config["events_path"], app_config["data_dir"]);
            })


        $("#btn_login").on("click", (event)=>{
            login();
        })
    }
)

$(document).on("keyup", (event)=>{
    if (event.which == 13){
        login();
    }
})
