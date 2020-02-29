$(document).ready(()=>{
    $('#filter').hide('fast');
})

$('#filter-toggle').click(()=>{
    $('#filter-toggle').hide('fast');
    $('#filter').show('fast');
   
})

$('#done').click(()=>{
    $('#filter').hide('fast');
    $('#filter-toggle').show('fast');
   
})

const filter = ()=>{
console.log($('#locationFilter').prop('checked'));
}

