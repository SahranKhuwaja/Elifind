$(document).ready(()=>{

    if($('#specialized').length){

        if(document.querySelector('#error-message').innerHTML.length !==0){
            $('#specialized').hide('slow');
            $('#cmForm').hide('slow');
            $('#editCompanyPass').show('slow');
            $('#eC').hide('slow');
            document.getElementById('CompanyName').style.pointerEvents = 'none';
            document.getElementById('Contact').style.pointerEvents = 'none';
            document.getElementById('Address').style.pointerEvents = 'none';
            document.getElementById('Details').style.pointerEvents = 'none';
            document.getElementById('save').style.pointerEvents = 'none';
            document.getElementById('save').style.display = 'none';
            $('#basicI').removeClass('active');
            $('#basic').removeClass('active');
            $('#pc').addClass('active');
            $('#pass').addClass('active');
            $('#msgDiv').show('slow');
            $('#error-message').show('slow');
        }
        else if(document.querySelector('#success-message').innerHTML.length !==0){
            $('#specialized').hide('slow');
            $('#cmForm').hide('slow');
            $('#eC').hide('slow');
            document.getElementById('CompanyName').style.pointerEvents = 'none';
            document.getElementById('Contact').style.pointerEvents = 'none';
            document.getElementById('Address').style.pointerEvents = 'none';
            document.getElementById('Details').style.pointerEvents = 'none';
            document.getElementById('save').style.pointerEvents = 'none';
            document.getElementById('save').style.display = 'none';
            $('#editCompanyPass').show('slow');
            $('#basicI').removeClass('active');
            $('#basic').removeClass('active');
            $('#pc').addClass('active');
            $('#pass').addClass('active');
            $('#successDiv').show('slow');
            $('#success-message').show('slow');

        }
        else if(document.querySelector('#success-add-spec').innerHTML.length !==0){
            $('#cmForm').hide('slow');
            $('#editCompanyPass').hide('slow');
            $('#specialized').show('slow');
            $('#eC').hide('slow');
            document.getElementById('CompanyName').style.pointerEvents = 'none';
            document.getElementById('Contact').style.pointerEvents = 'none';
            document.getElementById('Address').style.pointerEvents = 'none';
            document.getElementById('Details').style.pointerEvents = 'none';
            document.getElementById('save').style.pointerEvents = 'none';
            document.getElementById('save').style.display = 'none';
            $('#basicI').removeClass('active');
            $('#basic').removeClass('active');
            $('#spS').addClass('active');
            $('#sp').addClass('active');
            $('#successSpecDiv').show('slow');
            $('#success-add-spec').show('slow');

        }
        else{

        $('#specialized').hide('fast');
        $('#editCompanyPass').hide('fast');
        $('#eC').hide('fast');
    
        
        }
    }

    if($('#viewSpecialization').length){

        $('#viewSpecialization').hide('fast');

    }
  


})


if($('#specialized').length){
$('#specS').click((e)=>{
    e.preventDefault();
    $('#cmForm').hide('slow');
    $('#editCompanyPass').hide('slow');
    $('#specialized').show('slow');
    $('#eC').hide('slow');
    document.getElementById('CompanyName').style.pointerEvents = 'none';
    document.getElementById('Contact').style.pointerEvents = 'none';
    document.getElementById('Address').style.pointerEvents = 'none';
    document.getElementById('Details').style.pointerEvents = 'none';
    document.getElementById('save').style.pointerEvents = 'none';
    document.getElementById('save').style.display = 'none';
    $('#basicI').removeClass('active');
    $('#basic').removeClass('active');
    $('#pc').removeClass('active');
    $('#pass').removeClass('active');
    $('#spS').addClass('active');
    $('#sp').addClass('active');

})

$('#basicInfo').click((e)=>{
    e.preventDefault();
    $('#specialized').hide('slow');
    $('#editCompanyPass').hide('slow');
    $('#cmForm').show('slow');
    $('#eC').hide('slow');
    document.getElementById('CompanyName').style.pointerEvents = 'none';
    document.getElementById('Contact').style.pointerEvents = 'none';
    document.getElementById('Address').style.pointerEvents = 'none';
    document.getElementById('Details').style.pointerEvents = 'none';
    document.getElementById('save').style.pointerEvents = 'none';
    document.getElementById('save').style.display = 'none';
    $('#spS').removeClass('active');
    $('#specS').removeClass('active');
    $('#pc').removeClass('active');
    $('#pass').removeClass('active');
    $('#basicI').addClass('active');
    $('#basic').addClass('active');

  

})

$('#passChange').click((e)=>{
    e.preventDefault();
    $('#specialized').hide('slow');
    $('#cmForm').hide('slow');
    $('#eC').hide('slow');
    document.getElementById('CompanyName').style.pointerEvents = 'none';
    document.getElementById('Contact').style.pointerEvents = 'none';
    document.getElementById('Address').style.pointerEvents = 'none';
    document.getElementById('Details').style.pointerEvents = 'none';
    document.getElementById('save').style.pointerEvents = 'none';
    document.getElementById('save').style.display = 'none';
    $('#editCompanyPass').show('slow');
    $('#basicI').removeClass('active');
    $('#basic').removeClass('active');
    $('#spS').removeClass('active');
    $('#specS').removeClass('active');
    $('#pc').addClass('active');
    $('#pass').addClass('active');
   
    

})

}

$('#editCompany').click((e)=>{
    e.preventDefault();
    $('#cmForm').hide('slow');
    $('#eC').show('slow');
    document.getElementById('CompanyName').style.pointerEvents = 'auto';
    document.getElementById('Contact').style.pointerEvents = 'auto';
    document.getElementById('Address').style.pointerEvents = 'auto';
    document.getElementById('Details').style.pointerEvents = 'auto';
    document.getElementById('save').style.pointerEvents = 'auto';
    document.getElementById('save').style.display = 'block';
    document.querySelector('.col-xs-12').style.width = '680px';

})

if($('#viewSpecialization').length){

    $('#specS').click((e)=>{
        e.preventDefault();
        $('#cmForm').hide('slow');
        $('#viewSpecialization').show('slow');
        $('#basicI').removeClass('active');
        $('#basic').removeClass('active');
        $('#spS').addClass('active');
        $('#sp').addClass('active');
    
    })

    $('#basicInfo').click((e)=>{
        e.preventDefault();
        $('#viewSpecialization').hide('slow');
        $('#cmForm').show('slow');
        $('#spS').removeClass('active');
        $('#sp').removeClass('active');
        $('#basicI').addClass('active');
        $('#basic').addClass('active');
    
    })
   



}