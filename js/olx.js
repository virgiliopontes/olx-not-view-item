var negativeitems = sessionStorage.getItem('olx-negative');
if(negativeitems === null){
    sessionStorage.setItem('olx-negative','[]');
    negativeitems = [];
}else{
    negativeitems = JSON.parse(negativeitems)
}

function limparItems(items){
    $.each(items,function(key,value){
        var achou = $('#'+value);
        if(achou.length>=1){
            achou.parents('[class="item"]').replaceWith('');
        }
    })
}
limparItems(negativeitems);

var item = $('[class="section_OLXad-list "]').find('[class="item"]');
item.find("[class='col-4']").append(btn());
$.each(item,function(key,value){
    //Pegar Link guardar em variavel e apagar o Link do site
    var link = $(value).find("[class='OLXad-list-link']").attr('href');
    $(value).find("[class='OLXad-list-link']").removeAttr('href');

    //Atribuir o link ao titulo do anúncio
    $(value).find('[class="OLXad-list-line-1 mb5px"]').attr('href',link);


    $html = $(value).find('[class="OLXad-list-line-1 mb5px"]')

    var html = replaceTag($html,'a')

    $(value).find('[class="OLXad-list-line-1 mb5px"]').replaceWith(html)
    if(item.length == (key+1)){
        negativeClick()
    }
});

function replaceTag(object,newTag){
    var ahref = object.attr('href');
    var aclass = object.attr('class');
    var aid = object.attr('id');
    var atext = object.text();
    return '<'+newTag+' href="'+ ahref +'" class="'+ aclass +'" style="font-size:15px">'+ atext +'</'+newTag+'>';
}

function negativeClick(){
    $('.negative').click(function(){
        console.log($(this).parents('a').attr('id'));
        var newNegative = $(this).parents('a').attr('id')
        negativeitems = JSON.parse(sessionStorage.getItem('olx-negative'));
        negativeitems = [... negativeitems , newNegative] 
        sessionStorage.setItem('olx-negative',JSON.stringify(negativeitems))
        $(this).parents('[class="item"]').replaceWith('');
    });
}

function btn(){
    return "<p class='negative btn btn-filter' style='cursor: pointer'><i style='color:red' class='fa fa-thumbs-down fa-3x' ></i></p>"
}