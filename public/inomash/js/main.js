

$(function(){
	$("#wizard").steps({
        headerTag: "h4",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        transitionEffectSpeed: 300,
        labels: {
            next: "Continue",
            previous: "Back",
            finish: 'Proceed to Submit'
        },
        onStepChanging: function (event, currentIndex, newIndex) { 
            
            if ( newIndex >= 1 ) {
                $('.steps ul li:first-child a img').attr('src','/inomash/images/step-1.png');
                
            } else {
                $('.steps ul li:first-child a img').attr('src','/inomash/images/step-1-active.png');
            }

            if ( newIndex === 1 ) {
               
                $('.steps ul li:nth-child(2) a img').attr('src','/inomash/images/step-2-active.png');
            
                if(!document.querySelector('#card')){
                    document.querySelector('.actions').querySelectorAll('a')[1].style.pointerEvents = 'auto';
                   document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'auto';
                }
                var element = document.querySelectorAll('#card');
                for(var i=0;i<element.length;i++){
                
                   if(element[i].style.pointerEvents!=='none'){
                   document.querySelector('.actions').querySelectorAll('a')[1].style.pointerEvents = 'none';
                   document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'none';
                   
                   }

                }  

            
                
            } else {
                $('.steps ul li:nth-child(2) a img').attr('src','/inomash/images/step-2.png');
            }

            if ( newIndex === 2 ) {
                $('.steps ul li:nth-child(3) a img').attr('src','/inomash/images/step-3-active.png');
                
                var element = document.querySelectorAll('#card2');
                for(var i=0;i<element.length;i++){
                
                   if(element[i].style.pointerEvents!=='none'){
                   document.querySelector('.actions').querySelectorAll('a')[1].style.pointerEvents = 'none';
                   document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'none';
                   
                   }

                }  

            } else {
                $('.steps ul li:nth-child(3) a img').attr('src','/inomash/images/step-3.png');
            }

            if ( newIndex === 3 ) {
                $('.steps ul li:nth-child(4) a img').attr('src','/inomash/images/step-4-active.png');

                if(!document.querySelector('#card3')){
                    document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'auto';
                   document.querySelector('.actions').querySelectorAll('a')[2].style.pointerEvents = 'auto';
                }
                var element = document.querySelectorAll('#card3');
                for(var i=0;i<element.length;i++){
                
                   if(element[i].style.pointerEvents!=='none'){
                   document.querySelector('.actions').querySelectorAll('a')[0].style.pointerEvents = 'none';
                   document.querySelector('.actions').querySelectorAll('a')[2].style.pointerEvents = 'none';
                   
                   }

                }  
               
            } else {
                $('.steps ul li:nth-child(4) a img').attr('src','/inomash/images/step-4.png');
                
            }
            return true; 
        }
    });
    // Custom Button Jquery Steps
    $('.forward').click(function(){
    	$("#wizard").steps('next');
    })
    $('.backward').click(function(){
        $("#wizard").steps('previous');
    })
   
    // Create Steps Image
    $('.steps ul li:first-child').append('<img src="/inomash/images/step-arrow.png" alt="" class="step-arrow">').find('a').append('<img src="/inomash/images/step-1-active.png" alt=""> ').append('<span id="stp" class="step-order">Step 01</span>');
    $('.steps ul li:nth-child(2').append('<img src="/inomash/images/step-arrow.png" alt="" class="step-arrow">').find('a').append('<img src="/inomash/images/step-2.png" alt="">').append('<span id="stp" class="step-order">Step 02</span>');
    $('.steps ul li:nth-child(3)').append('<img src="/inomash/images/step-arrow.png" alt="" class="step-arrow">').find('a').append('<img src="/inomash/images/step-3.png" alt="">').append('<span id="stp" class="step-order">Step 03</span>');
    $('.steps ul li:last-child a').append('<img src="/inomash/images/step-4.png"  alt="">').append('<span id="stp" class="step-order">Step 04</span>');

    stp()
    
    
})


stp =()=>{

 document.querySelectorAll('ul')[3].style.pointerEvents='none';


}