function init(){
    $("[class*='mostrar']").click(function(e){
        let modulo = $(this).data("modulo"),
            form   = $(this).data("form");
        
        $(`#vista-${form}`).load(`public/vistas/${modulo}/${form}.html`, function(){
            $(`#btn-close-${form}`).click(()=>{
                $(`#vista-${form}`).html("");
            });
            init();
        }).draggable();
    });
}
init();