var negativeitens = []
//--------------------------------- Sincronismo Storage ---------------------------------------//
if (sessionStorage.getItem('olx-negative') === undefined) {
    saveitens([],false)
}

function saveitens(itens,sync = true)
{
    sessionStorage.setItem('olx-negative','{"itens":'+JSON.stringify(itens)+'}')
    if (sync) {
        chrome.storage.sync.set({'olx-negative': {"itens" : itens}});
    }
    
}

function getitens()
{
    olxnegative = JSON.parse(sessionStorage.getItem('olx-negative'))
    console.log(olxnegative)
    if (olxnegative['itens'] !== undefined) {
        return olxnegative['itens'];
    }else{
        console.log(olxnegative)
        return []
    }
    
}

chrome.storage.sync.get(
    ['olx-negative'], 
    function(result) 
    {

        if (result['olx-negative'].itens === undefined) {
            negativeitens = [];
        } else {
            negativeitens = result['olx-negative'].itens;
        }

        saveitens(negativeitens)

    }
);
// ----------------------------------------------- Fim Storage ---------------------------------//

function limparitens(itens)
{
    $.each(itens,function(key,value) {
        var achou = $('#'+value);
        if (achou.length>=1) {
            achou.parents('[class="item"]').replaceWith('');
        }
    })
}

function replaceTag(object,newTag)
{
    var ahref = object.attr('href');
    var aclass = object.attr('class');
    var aid = object.attr('id');
    var atext = object.text();
    return '<'+newTag+' href="'+ ahref +'" class="'+ aclass +'" style="font-size:15px">'+ atext +'</'+newTag+'>';
}

function negativeClick()
{
    $('.negative').click(function() {
        console.log($(this).parents('a').attr('id'));
        var newNegative = $(this).parents('a').attr('id')
        addAnuncioNegativado(newNegative)
        $(this).parents('[class="item"]').replaceWith('');
    });
}

function addAnuncioNegativado(newNegative)
{
    console.log(newNegative)
    negativeitens.push(newNegative) 
    saveitens(negativeitens)
    limparitens([newNegative]);
}

function btn() {
    return "<p class='negative btn btn-filter' style='cursor: pointer'><i style='color:red' class='fa fa-thumbs-down fa-3x' ></i></p>"
}

function verificaVendedor(link, vNegativados, idAnuncio)
{
    $.ajax({
        type: "GET",
        url: link,
        contentType: "application/x-www-form-urlencoded;charset=ISO-8859-1",
        success: function (response) {
            var dadosAnuncio = JSON.parse($(response).find('[type="application/ld+json"]').html().replace("\\", "/"))
            //console.log(dadosAnuncio,$.inArray(dadosAnuncio.name, vNegativados))
            if ($.inArray(dadosAnuncio.name.trim(), vNegativados) > -1) {
                addAnuncioNegativado(idAnuncio)

            } else if (contemPalavras(dadosAnuncio.makesOffer.itemOffered.description)) {
                addAnuncioNegativado(idAnuncio)

            }
        }
    });
}

function contemPalavras(texto)
{
    palavras = [
        'parcelas',
        'financiamento',
        'financiado',
        'entrada',
        'juros',
        '36x',
        'entrada',
        'prestação',
        'prestações'
    ]
    string = '';
    $.each(palavras, function (indexInArray, palavra) { 
        if (string != '') {
            string += '|'
        }
        string += palavra
    });

    regex = new RegExp("("+string+")","gmi");
    if ((regex.exec(texto) !== null)) {
        console.log(texto)
        return true;
    }

    return false;
}
//Session Storage Local
negativeitens = getitens();

if ($('.section_OLXad-list').length > 0 ) {   
    
    limparitens(negativeitens); //Limpa os itens já negativados

    var item = $('[class="section_OLXad-list "]').find('[class="item"]'); //Separa todos os itens da página

    item.find("[class='col-4']").append(btn()); //Adiciona o Botão de Negativar

    $.each(item,function(key,value) {
        //Pegar Link guardar em variavel e apagar o Link do site
        var link = $(value).find("[class='OLXad-list-link']").attr('href');
        var idItem = $(value).attr('data-list_id');
        $(value).find("[class='OLXad-list-link']").removeAttr('href');
        vNegativados = [
            'Unidas',
            'Vinícius Seminovos Movida',
            'L A VEÃCULOS DO VILAR',
            'LINOSCAR',
            'Seminovos Movida Niterói',
            'Seminovos Movida Campinho'
        ]
        verificaVendedor(link,vNegativados,idItem)

        //Atribuir o link ao titulo do anúncio
        $(value).find('[class="OLXad-list-line-1 mb5px"]').attr('href', link);

        $html = $(value).find('[class="OLXad-list-line-1 mb5px"]')

        var html = replaceTag($html,'a')

        $(value).find('[class="OLXad-list-line-1 mb5px"]').replaceWith(html)
        if (item.length == (key+1)) {
            negativeClick()
        }
    });

}

if ($('.page_OLXad-view').length > 0) {

}