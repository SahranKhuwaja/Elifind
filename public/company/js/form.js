
$(document).ready(()=>{

    $('#specialization').hide('fast');
    $('#submit').hide('fast');

});


$('#Category').on('change',(e)=>{
    
    if(e.target.selectedOptions[0].text === 'Other' && e.target.selectedOptions[0].value === ''){
        
        document.querySelector('#Other').style.pointerEvents = 'auto';
        document.querySelector('#Other').disabled = false;
    }else{

        document.querySelector('#Other').style.pointerEvents = 'none';
        document.querySelector('#Other').disabled = true;

    }
    
})

$('#next').click((e)=>{
    
   
    
    if($('#companyForm').validate().form()){
        e.preventDefault();
        $('#companyForm').find('.row').hide('fast');
        $('#specialization').show('slow');
        $('#submit').show('slow');

    }
    
})


$('#btnSpec').click((e)=>{

    e.preventDefault();
    const specDiv = document.querySelector('#specialization');
    const template = document.querySelector('#spec').innerHTML;
    
    const html = Mustache.render(template);

    specDiv.insertAdjacentHTML('beforeend',html);


})

$('#btnSubmit').click(()=>{
  
  $('#companyForm').validate();
 

});

const remove = (e)=>{
    e.parentNode.parentNode.remove();
}





