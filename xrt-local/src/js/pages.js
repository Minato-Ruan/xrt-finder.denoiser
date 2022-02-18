$(document).ready(() => {
    $(".navbar-toggler").click(() =>{
        if($("#navbarResponsive").hasClass("show")){
            $("#navbarResponsive").removeClass("show");
        }
        else{
            $("#navbarResponsive").addClass("show");
        }
        
    })
})