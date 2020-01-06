document.querySelector('#btnD').addEventListener('click',(e)=>{

    e.preventDefault();
    
})
    document.querySelector('#btnD2').addEventListener('click',(e)=>{

    e.preventDefault();
    
})



download = (e)=>{
    
window.location.href='http://localhost:3000/Profile/Inomash/View?#p'
window.location.href='http://localhost:3000/Profile/Inomash/View?#skill'



    html2canvas(document.querySelector("#whole"),{scale:1}).then(function(canvas) {

    
    setTimeout(7000);
    
var HTML_Width = $("#whole").width();
    var HTML_Height = $("#whole").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width+(top_left_margin*2);
    var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;
    
    var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
    

    html2canvas($("#whole")[0],{allowTaint:true}).then(function(canvas) {
        canvas.getContext('2d');
        
        console.log(canvas.height+"  "+canvas.width);
        
        
        var imgData = canvas.toDataURL("image/png", 1.0);

        var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
    
        pdf.addImage(imgData, 'PNG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
    
        
        for (var i = 1; i <= totalPDFPages; i++) { 
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(imgData, 'PNG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
        }
        
        pdf.save("InoMash"+Math.random()+".pdf");
    });



});
}

