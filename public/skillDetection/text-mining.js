$(document).ready(()=>{
  $('#sd-file').fileuploader({
    addMore: false,
    limit:1,
    extensions:['pdf','docx','doc','text/plain','txt'],
});

})


$('#sd-file').on('change',(e)=>{
   const file = document.getElementById("sd-file").files[0];
   if(!checkType(file.type)){
     e.target.nextElementSibling.innerText = "Choose file or drag and drop file (Upload only PDF, TXT or DOC)";
     document.querySelector('#sd-file').innerHTML = ""
     return document.querySelector('#type-error').innerHTML = "Please upload only pdf, txt or doc file!";    
   }
   document.querySelector('#type-error').innerHTML = " ";
   uploadFile(file,e.target.nextElementSibling);
   
    
})

  const checkType = (type)=>{

    if(type === 'application/pdf' || type ==='application/msword' || 
     type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || type === 'text/plain'){
       return true;
     }
     return false;

  }

  const uploadFile = (file,e)=>{

    const filesize = (parseInt(file.size)/1000);
    const size = filesize>990?(parseInt(file.size)/1000)/1000 + " MB" : filesize + " KB"
    var fileName =  file.name;
    //e.innerText = "1 file uploaded! "+ fileName + " " + size + " of size";
    document.querySelector("input[name='fileuploader-list-sd-file']").innerHTML = `[{"file":"0:/${fileName}/"}]`
    sendToServer(file)

  }

  const sendToServer = ()=>{
    const formData = new FormData(document.querySelector('#sd-form'));
    $.ajax({
      url:'/Profile/SkillDetection/Detect',
      type:'POST',
      data:formData,
      processData: false,
      contentType: false,
    }).done((data)=>{
      renderExtractedInfo(data);
    })
  }
  
  const renderExtractedInfo = async(data)=>{
    const template = document.querySelector('#analyzing-loader').innerHTML;
    const parent = document.querySelector('#progress-loading-analyzer');
    const html = await Mustache.render(template);
    document.querySelector('#extracted-info').innerHTML = ""
    parent.innerHTML = await html;
    setTimeout(()=>{
      renderInfo(data)
      parent.innerHTML = ""
      
    },5000);

  }

  const renderInfo = async(data)=>{

    const template = document.querySelector('#view-extracted-info').innerHTML;
    const parent = document.querySelector('#extracted-info');
    const html = await Handlebars.compile(template);
    parent.innerHTML = await html({...data});

  }