

document.querySelector('#btnNext').addEventListener('click',(e)=>{
    e.preventDefault();
    document.getElementById('rowP').style.display = 'none';
    document.getElementById('guide').style.display = 'block'
    document.getElementById('inoMForm').style.display = 'block';
})


addEducation = ()=>{

    var div = document.getElementById("eduDiv");

    var div1 = document.createElement('div');
    div1.className = 'form-row';
    div1.style.background = 'white';

    var div2 = document.createElement('div');
    div2.classList.add("form-holder", "w-100")
   
    div1.appendChild(div2);

    var div3 = document.createElement('div');
    div3.className = 'card';
    div3.id = 'card';
    div2.appendChild(div3);

    var div4 = document.createElement('div');
    div4.className = 'card-header';
    div4.style.padding = '15px 15px 15px 15px';

    var div4_1 = document.createElement('div');
    div4_1.className = 'form-group';

    var div4_2 = document.createElement('div');
    div4_2.className = 'form-holder';
    var img = document.createElement('img');
    img.src = '/images/icons/edu.png' 
    div4_2.appendChild(img);

    var div4_3 = document.createElement('div');
    div4_3.className = 'form-holder';
    div4_3.style.marginTop = '2px';
    var cross = document.createElement('a');
    cross.innerHTML = 'X';
    cross.href = 'javascript:function funcT(f){f.preventDefault()}';
    cross.style.textDecoration = 'none';
    cross.style.marginLeft = '440px';
    cross.style.marginTop = '20px';
    cross.addEventListener('click',(e)=>{
        e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        check();
        check2();
        
        
    })
    var strongTag = document.createElement('strong');
    strongTag.appendChild(cross);
    div4_3.appendChild(strongTag);

    div4_1.appendChild(div4_2);
    div4_1.appendChild(div4_3);
    div4.appendChild(div4_1);
    div3.appendChild(div4);

    var div5 = document.createElement('div');
    div5.className = 'card-body';
    div5.style.padding = '1px 15px 15px 15px'
    var para = document.createElement('p');
    para.style.color = 'red';
    para.style.fontSize ='12px';
    var strng = document.createElement('strong');
    strng.appendChild(para);
    div5.appendChild(strng);
    var h5 = document.createElement('h5');
    h5.textContent = 'Course Title';
    h5.className = 'card-title';
    div5.appendChild(h5);

    var input1 = document.createElement('input');
    input1.className = 'form-control';
    input1.name  = 'CourseTitle';
    div5.appendChild(input1);

    var para = document.createElement('p');
    para.className = 'card-text';
    para.textContent = 'This title defines your degree and your level of qualification.'
    div5.appendChild(para);

    var h52 = document.createElement('h5');
    h52.textContent = 'Name of Institute';
    h52.className = 'card-title';
    div5.appendChild(h52);

    var input2 = document.createElement('input');
    input2.className = 'form-control';
    input2.name  = 'Institute';
    div5.appendChild(input2);

    var div6 = document.createElement('div');
    div6.className = 'form-group';
    var div7 = document.createElement('div');
    div7.className = 'form-holder';
    var h53 = document.createElement('h5');
    h53.className = 'card-title';
    h53.textContent = 'Start Year';
    div7.appendChild(h53);
     
    var select1 = document.createElement('select');
    select1.className = 'form-control';
    select1.name = 'StartYear';
    ddl(select1);
    select1.value = new Date().getFullYear()

    div7.appendChild(select1);
    div6.appendChild(div7);

    var div8 = document.createElement('div');
    div8.className = 'form-holder';
    var h54 = document.createElement('h5');
    h54.className = 'card-title';
    h54.textContent = 'End Year';
    div8.appendChild(h54);
     
    var select2 = document.createElement('select');
    select2.className = 'form-control';
    select2.name = 'EndYear';
    ddl(select2);
    select2.value = new Date().getFullYear()

    div8.appendChild(select2);
    div6.appendChild(div8);
    div5.appendChild(div6);

    

    var btnFinish = document.createElement('a');
    btnFinish.className = 'btn btn-primary';
    btnFinish.innerHTML = 'Finish';
    btnFinish.addEventListener('click',(e)=>{
        e.preventDefault();
        dis(e.currentTarget);
    })
    div5.appendChild(btnFinish);
    div3.appendChild(div5);



    div.appendChild(div1);
    
    document.querySelector('.actions').querySelectorAll('a')[1].style.pointerEvents = 'none';
    document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'none';
 



}


years = ()=>{

    var min = 1900;
    max = new Date().getFullYear()+11;
    select = document.getElementById('sy');
    select2 = document.getElementById('sy2');
    select3 = document.getElementById('sy3');
    select4 = document.getElementById('sy4');

for (var i = min; i<=max; i++){
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    select.appendChild(opt);
   
}

select.value = new Date().getFullYear();

for (var i = min; i<=max; i++){
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    select2.appendChild(opt);
   
}

select2.value = new Date().getFullYear();

for (var i = min; i<=max; i++){
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    select3.appendChild(opt);
   
}

select3.value = new Date().getFullYear();

for (var i = min; i<=max; i++){
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    select4.appendChild(opt);
   
}

select4.value = new Date().getFullYear();


}

window.onload =  years;

ddl = (select)=>{
    
    var min = 1900;
    var max = new Date().getFullYear()+11;
    for (var i = min; i<=max; i++){
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    select.appendChild(opt);
    select.value = new Date().getFullYear();
    }
   
    
}

dis = ($this)=>{

    
      
    if($this.parentNode.parentNode.querySelectorAll('input')[0].value === "" || $this.parentNode.parentNode.querySelectorAll('input')[1].value === "" ){
        return $this.parentNode.parentNode.querySelectorAll('p')[0].textContent = 'Please fill all the section!'
    }  
  
    $this.parentNode.parentNode.querySelectorAll('p')[0].textContent = ''; 
    $this.parentNode.parentNode.style.pointerEvents='none';
    $this.style.display = 'none';
    var ico = document.createElement('img');
    ico.src = '/images/icons/tick.png';
    ico.style.marginLeft = '120px';
    ico.id = 'imgTick';
    
    $this.parentNode.parentNode.querySelector('a').textContent = "";
    $this.parentNode.parentNode.querySelector('a').style.display = 'none';
    var edit = document.createElement('a');
    edit.href = 'javascript:function f(e){e.preventDefault()}';
    edit.addEventListener('click',(e)=>{
          
          restore(e);
    });
    var i = document.createElement('i');
    i.className = 'zmdi zmdi-edit';
    i.style.left = '430px';
    
    edit.style.textDecoration = 'none';
    edit.style.pointerEvents = 'auto';
    edit.id = 'edit';
    edit.appendChild(i);
    
    $this.parentNode.parentNode.querySelector('a').parentNode.style.marginTop = '0px';
    $this.parentNode.parentNode.querySelector('a').parentNode.appendChild(ico); 
    $this.parentNode.parentNode.querySelector('a').parentNode.appendChild(edit); 
    
    check2();
 
    
}

restore = (e)=>{

 
 e.currentTarget.parentNode.querySelector('img').remove();
 e.currentTarget.parentNode.querySelectorAll('a')[0].textContent = "X";
 e.currentTarget.parentNode.querySelectorAll('a')[0].style.display = "";
 e.currentTarget.parentNode.querySelectorAll('a')[0].parentNode.style.marginTop = '2px';
 e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode.style.pointerEvents = 'auto';
 e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll('a')[2].style.display = "";
 e.currentTarget.remove();
 document.querySelector('.actions').querySelectorAll('a')[1].style.pointerEvents = 'none';
 document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'none';
 document.querySelector('.actions').querySelectorAll('a')[2].style.pointerEvents = 'none';




}

check = ()=>{
    

    if(!document.querySelector('#card')){
        document.querySelector('.actions').querySelectorAll('a')[1].style.pointerEvents = 'auto';
        document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'auto';
    }

}
check2 = ()=>{

    var c = true;

    var element = document.querySelectorAll('#card');
    for(var i=0; i<element.length; i++){

        
        if(element[i].style.pointerEvents!=='none'){
            c=false;
            
        }
        
    }

  if(c===true){
    document.querySelector('.actions').querySelectorAll('a')[1].style.pointerEvents = 'auto';
    document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'auto';

  }


   
}

increment=($this)=>{
   

var value = parseInt($this.parentNode.parentNode.querySelector('input').value);

if(value<100){
    
    value++;
    $this.parentNode.parentNode.parentNode.querySelector('input').value = value;


}


}
decrement=($this)=>{

    var value = parseInt($this.parentNode.parentNode.querySelector('input').value);
    
    if(value>50){
        
        value--;
        $this.parentNode.parentNode.parentNode.querySelector('input').value = value;
    
    
    }
    
    
    }

    specify = ($this)=>{
        
        if($this.options[$this.selectedIndex].text==='Other' && $this.options[$this.selectedIndex].value===""){
            $this.parentNode.querySelector('#other').style.pointerEvents = 'auto';
            $this.parentNode.querySelector('#other').disabled = false;
        }else{

            $this.parentNode.querySelector('#other').style.pointerEvents = 'none';
            $this.parentNode.querySelector('#other').disabled = true;

        }

    }

    dis2 = ($this) =>{
    if($this.parentNode.parentNode.querySelectorAll('input')[0].value === "" || ($this.parentNode.parentNode.querySelectorAll('input')[1].style.pointerEvents !=='none' && $this.parentNode.parentNode.querySelectorAll('input')[1].value==="" )){
        return $this.parentNode.parentNode.querySelectorAll('p')[0].textContent = 'Please fill all the section!'
    }  
  
    $this.parentNode.parentNode.querySelectorAll('p')[0].textContent = ''; 
    $this.parentNode.parentNode.style.pointerEvents='none';
    $this.style.display = 'none';
    var ico = document.createElement('img');
    ico.src = '/images/icons/tick.png';
    ico.style.marginLeft = '120px';
    ico.id = 'imgTick';
    
    $this.parentNode.parentNode.querySelector('a').textContent = "";
    $this.parentNode.parentNode.querySelector('a').style.display = 'none';
    var edit = document.createElement('a');
    edit.href = 'javascript:function f(e){e.preventDefault()}';
    edit.addEventListener('click',(e)=>{
          
          restore(e);
    });
    var i = document.createElement('i');
    i.className = 'zmdi zmdi-edit';
    i.style.left = '430px';
    
    edit.style.textDecoration = 'none';
    edit.style.pointerEvents = 'auto';
    edit.id = 'edit';
    edit.appendChild(i);
    
    $this.parentNode.parentNode.querySelector('a').parentNode.style.marginTop = '0px';
    $this.parentNode.parentNode.querySelector('a').parentNode.appendChild(ico); 
    $this.parentNode.parentNode.querySelector('a').parentNode.appendChild(edit); 
    
    check4();
    
}

addSkills = ()=>{

    var div = document.getElementById("skillDiv");

    var div1 = document.createElement('div');
    div1.className = 'form-row';
    div1.style.background = 'white';

    var div2 = document.createElement('div');
    div2.classList.add("form-holder", "w-100")
   
    div1.appendChild(div2);

    var div3 = document.createElement('div');
    div3.className = 'card';
    div3.id = 'card2';
    div2.appendChild(div3);

    var div4 = document.createElement('div');
    div4.className = 'card-header';
    div4.style.padding = '15px 15px 15px 15px';

    var div4_1 = document.createElement('div');
    div4_1.className = 'form-group';

    var div4_2 = document.createElement('div');
    div4_2.className = 'form-holder';
    var img = document.createElement('img');
    img.src = '/images/icons/skills.png' 
    div4_2.appendChild(img);

    var div4_3 = document.createElement('div');
    div4_3.className = 'form-holder';
    div4_3.style.marginTop = '2px';
    var cross = document.createElement('a');
    cross.innerHTML = 'X';
    cross.href = 'javascript:function funcT(f){f.preventDefault()}';
    cross.style.textDecoration = 'none';
    cross.style.marginLeft = '440px';
    cross.style.marginTop = '20px';
    cross.addEventListener('click',(e)=>{
    
        e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        
        check3();
        check4();
        
        
    })
    var strongTag = document.createElement('strong');
    strongTag.appendChild(cross);
    div4_3.appendChild(strongTag);

    div4_1.appendChild(div4_2);
    div4_1.appendChild(div4_3);
    div4.appendChild(div4_1);
    div3.appendChild(div4);

    var div5 = document.createElement('div');
    div5.className = 'card-body';
    div5.style.padding = '1px 15px 15px 15px'
    var para = document.createElement('p');
    para.style.color = 'red';
    para.style.fontSize ='12px';
    var strng = document.createElement('strong');
    strng.appendChild(para);
    div5.appendChild(strng);
    var h5 = document.createElement('h5');
    h5.textContent = 'Skill';
    h5.className = 'card-title';
    div5.appendChild(h5);

    var input1 = document.createElement('input');
    input1.className = 'form-control';
    input1.name  = 'Skill';
    div5.appendChild(input1);

    var para = document.createElement('p');
    para.className = 'card-text';
    para.textContent = 'This title defines your skill.'
    div5.appendChild(para);

    var h52 = document.createElement('h5');
    h52.textContent = 'Category';
    h52.className = 'card-title';
    div5.appendChild(h52);

    var drpL = document.createElement('select');
    drpL.className = 'form-control';
    drpL.name = 'Category';
    categories(drpL);
    drpL.addEventListener('change',(e)=>{
        specify(e.currentTarget);
    })
    div5.appendChild(drpL);
    
    var input2 = document.createElement('input');
    input2.className ='form-control';
    input2.style.pointerEvents = 'none';
    input2.style.marginTop='15px';
    input2.id = 'other';
    input2.name='Category';
    input2.disabled = true;
    input2.placeholder = 'Please specify other'
    div5.appendChild(input2);

    
    var h53 = document.createElement('h5');
    h53.textContent = 'Golden Skill';
    h53.className = 'card-title';
    div5.appendChild(h53);

    var drpL2 = document.createElement('select');
    drpL2.className = 'form-control';
    drpL2.name = 'GoldenSkill';
    drpL2.id = 'gs';
    var opt1 = document.createElement('option');
    opt1.text = 'No';
    opt1.selected = true;
    opt1.value = 'false';
    drpL2.appendChild(opt1);

    var opt2 = document.createElement('option');
    opt2.text = 'Yes';
    opt2.value = 'true';
    drpL2.appendChild(opt2);
    
    div5.appendChild(drpL2);
     
   var div6  = document.createElement('div');
   div6.className = 'form-group';
   div6.id = 'fmg';

   var div7 = document.createElement('div');
   div7.className = 'form-holder';
   div7.id = 'fh';
   div7.style.width = 'auto';

   var h54 = document.createElement('h5');
   h54.textContent = 'Skilled %';
   h54.className = 'card-title';
   div7.appendChild(h54);

   var div8 = document.createElement('div');
   div8.className = 'input-group';
   div8.id = 'ig';
   var span1 = document.createElement('span');
   span1.className = 'input-group-btn';
   var btn = document.createElement('button');
   btn.classList.add('btn', 'btn-default', 'btn-number');
   btn.addEventListener('click',(e)=>{
       e.preventDefault();
       decrement(e.currentTarget);
   })
   btn.type = 'button';
   var span2 = document.createElement('span');
   span2.classList.add('glyphicon','glyphicon-minus');
   btn.appendChild(span2);
   span1.appendChild(btn);
   div8.appendChild(span1);

   var input3 = document.createElement('input');
   input3.className = 'form-control';
   input3.type = 'Number';
   input3.name = 'SkillRate';
   input3.value = '50';
   input3.style.pointerEvents = 'none';
   
   div8.appendChild(input3);

   var span3 = document.createElement('span');
   span3.className = 'input-group-btn';

   var btn2 = document.createElement('button');
   btn2.classList.add('btn', 'btn-default' ,'btn-number');
   btn2.type = 'button';
   btn2.id = 'plus';
   btn2.addEventListener('click',(e)=>{
       e.preventDefault();
       increment(e.currentTarget);
   })

   var span4 = document.createElement('span');
   span4.classList.add('glyphicon' ,'glyphicon-plus');
   btn2.appendChild(span4);

   span3.appendChild(btn2);
   div8.appendChild(span3);


   div7.appendChild(div8);
   div6.appendChild(div7);
   div5.appendChild(div6);

   var btnFinish = document.createElement('a');
    btnFinish.className = 'btn btn-primary';
    btnFinish.innerHTML = 'Finish';
    btnFinish.addEventListener('click',(e)=>{
        e.preventDefault();
        dis2(e.currentTarget);
    })
   div5.appendChild(btnFinish);
   div3.appendChild(div5);
   div.appendChild(div1);
    
    document.querySelector('.actions').querySelectorAll('a')[1].style.pointerEvents = 'none';
    document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'none';
 


}

categories = (ddL)=>{

    var values = [ "Web Development (Software)", "Desktop Application (Software)","Artificial Intelligence (Software/Hardware)",
    "Robotics (Software/Hardware)", "Electronics (Hardware)", "IOT (Software/Hardware)","Any Other Software (Software)",
    "Any Other Hardware (Hardware)", "Other"]

    
    for(var i = 0;i<values.length;i++){

      var opt = document.createElement('option');
      opt.text = values[i];
      opt.value = values[i];
      if(values[i].includes('Other')){
          opt.value = '';
      }
      ddL.appendChild(opt); 
      

    }


}

check3 = ()=>{
    
   if(!document.querySelector('#card2')){

    document.querySelector('.actions').querySelectorAll('a')[1].style.pointerEvents = 'none';
    document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'none';

   }

}

check4 = ()=>{
    
  
    var element = document.querySelectorAll('#gs');
  
    for(var i = 0;i<=element.length;i++){
        if(element[i].value==='true'){
          
            var element2 = document.querySelectorAll('#card2');
            for(var i=0;i<element2.length;i++){
            
               if(element2[i].style.pointerEvents!=='none'){
                 
                document.querySelector('.actions').querySelectorAll('a')[1].style.pointerEvents = 'none';
               document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'none';
               
               }else{
              

               document.querySelector('.actions').querySelectorAll('a')[1].style.pointerEvents = 'auto';
               document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'auto';
               }
               
            }  

            
        }
    }
   

  
   
}

addWork = ()=>{

    var div = document.getElementById("workDiv");

    var div1 = document.createElement('div');
    div1.className = 'form-row';
    div1.style.background = 'white';

    var div2 = document.createElement('div');
    div2.classList.add("form-holder", "w-100")
   
    div1.appendChild(div2);

    var div3 = document.createElement('div');
    div3.className = 'card';
    div3.id = 'card3';
    div2.appendChild(div3);

    var div4 = document.createElement('div');
    div4.className = 'card-header';
    div4.style.padding = '15px 15px 15px 15px';

    var div4_1 = document.createElement('div');
    div4_1.className = 'form-group';

    var div4_2 = document.createElement('div');
    div4_2.className = 'form-holder';
    var img = document.createElement('img');
    img.src = '/images/icons/work.png' 
    div4_2.appendChild(img);

    var div4_3 = document.createElement('div');
    div4_3.className = 'form-holder';
    div4_3.style.marginTop = '2px';
    var cross = document.createElement('a');
    cross.innerHTML = 'X';
    cross.href = 'javascript:function funcT(f){f.preventDefault()}';
    cross.style.textDecoration = 'none';
    cross.style.marginLeft = '440px';
    cross.style.marginTop = '20px';
    cross.addEventListener('click',(e)=>{
        e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        check6();
        check5();

    
        
        
    })
    var strongTag = document.createElement('strong');
    strongTag.appendChild(cross);
    div4_3.appendChild(strongTag);

    div4_1.appendChild(div4_2);
    div4_1.appendChild(div4_3);
    div4.appendChild(div4_1);
    div3.appendChild(div4);

    var div5 = document.createElement('div');
    div5.className = 'card-body';
    div5.style.padding = '1px 15px 15px 15px'
    var para = document.createElement('p');
    para.style.color = 'red';
    para.style.fontSize ='12px';
    var strng = document.createElement('strong');
    strng.appendChild(para);
    div5.appendChild(strng);
    var h5 = document.createElement('h5');
    h5.textContent = 'Experience in';
    h5.className = 'card-title';
    div5.appendChild(h5);

    var input1 = document.createElement('input');
    input1.className = 'form-control';
    input1.name  = 'ExperienceIn';
    div5.appendChild(input1);

    var para = document.createElement('p');
    para.className = 'card-text';
    para.textContent = 'This title defines your expeirence in particular field.'
    div5.appendChild(para);

    var h52 = document.createElement('h5');
    h52.textContent = 'Workplace';
    h52.className = 'card-title';
    div5.appendChild(h52);

    var input2 = document.createElement('input');
    input2.className = 'form-control';
    input2.name  = 'WorkPlace';
    div5.appendChild(input2);

    var div6 = document.createElement('div');
    div6.className = 'form-group';
    var div7 = document.createElement('div');
    div7.className = 'form-holder';
    var h53 = document.createElement('h5');
    h53.className = 'card-title';
    h53.textContent = 'Start Year';
    div7.appendChild(h53);
     
    var select1 = document.createElement('select');
    select1.className = 'form-control';
    select1.name = 'EStartYear';
    ddl(select1);
    select1.value = new Date().getFullYear()

    div7.appendChild(select1);
    div6.appendChild(div7);

    var div8 = document.createElement('div');
    div8.className = 'form-holder';
    var h54 = document.createElement('h5');
    h54.className = 'card-title';
    h54.textContent = 'End Year';
    div8.appendChild(h54);
     
    var select2 = document.createElement('select');
    select2.className = 'form-control';
    select2.name = 'EEndYear';
    ddl(select2);
    select2.value = new Date().getFullYear()

    div8.appendChild(select2);
    div6.appendChild(div8);
    div5.appendChild(div6);

    

    var btnFinish = document.createElement('a');
    btnFinish.className = 'btn btn-primary';
    btnFinish.innerHTML = 'Finish';
    btnFinish.addEventListener('click',(e)=>{
        e.preventDefault();
        dis3(e.currentTarget);
    })
    div5.appendChild(btnFinish);
    div3.appendChild(div5);



    div.appendChild(div1);
    
    document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'none';
    document.querySelector('.actions').querySelectorAll('a')[2].style.pointerEvents = 'none';

 



}

check5 = ()=>{

    var c = true;

    var element = document.querySelectorAll('#card3');
    for(var i=0; i<element.length; i++){

        
        if(element[i].style.pointerEvents!=='none'){
            c=false;
            
        }
        
    }

  if(c===true){
    document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'auto';
    document.querySelector('.actions').querySelectorAll('a')[2].style.pointerEvents = 'auto';

  }


   
}
dis3 = ($this)=>{

    
      
    if($this.parentNode.parentNode.querySelectorAll('input')[0].value === "" || $this.parentNode.parentNode.querySelectorAll('input')[1].value === "" ){
        return $this.parentNode.parentNode.querySelectorAll('p')[0].textContent = 'Please fill all the section!'
    }  
  
    $this.parentNode.parentNode.querySelectorAll('p')[0].textContent = ''; 
    $this.parentNode.parentNode.style.pointerEvents='none';
    $this.style.display = 'none';
    var ico = document.createElement('img');
    ico.src = '/images/icons/tick.png';
    ico.style.marginLeft = '120px';
    ico.id = 'imgTick';
    
    $this.parentNode.parentNode.querySelector('a').textContent = "";
    $this.parentNode.parentNode.querySelector('a').style.display = 'none';
    var edit = document.createElement('a');
    edit.href = 'javascript:function f(e){e.preventDefault()}';
    edit.addEventListener('click',(e)=>{
          
          restore(e);
    });
    var i = document.createElement('i');
    i.className = 'zmdi zmdi-edit';
    i.style.left = '430px';
    
    edit.style.textDecoration = 'none';
    edit.style.pointerEvents = 'auto';
    edit.id = 'edit';
    edit.appendChild(i);
    
    $this.parentNode.parentNode.querySelector('a').parentNode.style.marginTop = '0px';
    $this.parentNode.parentNode.querySelector('a').parentNode.appendChild(ico); 
    $this.parentNode.parentNode.querySelector('a').parentNode.appendChild(edit); 
    
    check5();
 
    
}
check6 = ()=>{
    
    if(!document.querySelector('#card3')){
        document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'auto';
        document.querySelector('.actions').querySelectorAll('a')[2].style.pointerEvents = 'auto';
    }


}

$(document).ready(function(){
    document.querySelector('.actions').querySelectorAll('a')[2].id = 'final';

    $("#final").click(function(){
      
        document.querySelector('#wizard').submit();
       
    })
})



