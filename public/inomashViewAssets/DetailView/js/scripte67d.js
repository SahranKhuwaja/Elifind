

jQuery(document).ready
(
	function ($) 
	{
		'use strict';

		/* ========================================= */
		/* $CONDITIONAL LOADERS                      */
		/* ========================================= */

		// client device and platform detection
		// to load specific scripts for specific devices
		var client = 
			 {
				 linux   : navigator.platform.match(/linux/i) ? true : false,
				 touch   : ('ontouchstart' in window || !!navigator.msMaxTouchPoints) ? true : false,
				 windows : navigator.platform.match(/win/i) ? true : false,
				 mobile  :   
				 {
					 android    : navigator.userAgent.match(/Android/i) ? true : false,
					 blackberry : navigator.userAgent.match(/BlackBerry/i) ? true : false,
					 ios        : navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false,
					 opera      : navigator.userAgent.match(/Opera Mini/i) ? true : false,
					 windows    : navigator.userAgent.match(/IEMobile/i) ? true : false,
					 any        : navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) ? true : false
				 }
			 };

		// load these scripts for all desktop devices
		if ( !client.mobile.any ) 
		{ 
			$.when
			(
				$.getScript( "js/plugins/vendor/wow.min.js" ),
				$.getScript( "js/plugins/vendor/jquery.stellar.min.js" ),
				$.Deferred( function ( deferred ) { $( deferred.resolve ); })
			).done
			(
				function ()
				{

					/* #WOW PLUGIN */
					/* ============================ */

					new WOW().init({ offset: 50 });

					/* #STELLAR */
					/* ============================ */

					$(window).stellar
					(
						{
							horizontalScrolling : false,
							resposive           : true
						}
					);

				}// eof: function
			);// eof: done

		};//eof: if

		/* #FASTCLICK PLUGIN */
		/* ============================ */

		// load this script for touch devices
		// to remove click delays
		if ( client.touch ) 
		{
			$.getScript
			( 
				"js/plugins/vendor/fastclick.min.js", 
				function ()
				{
					FastClick.attach(document.body);
				}
			);
		};//eof: if

		/* #SMOOTHWHEEL */
		/* ============================ */

		// load smooth wheel script for
		// windows and linux platforms but not mac
		if ( client.windows || client.linux ) 
		{
			$.getScript
			( 
				"js/plugins/vendor/smoothwheel.min.js",
				function ()
				{
					$(window).smoothWheel();
				}
			 );
		};//eof: if

		/* ========================================= */
		/* $PRELOADER                                */
		/* ========================================= */

		$(window).load
		(
			function ()
			{
				// show body scrollbar
				$('body').css('overflow-y', 'auto');

				// hide preloader
				$('#preloader').fadeOut(350);

				// needed to fix suffle gutter bug
				$(window).trigger('resize');
			}
		);

		/* ========================================= */
		/* $FULLSCREEN SECTION                       */
		/* ========================================= */

		var fullscreenContainer = $('.fullscreen');

		// get window height and set it to '.fullscreen'
		// element on page load and on resize
		function setViewportHeight ()
		{
			var viewportHeight = $(window).height();
			fullscreenContainer.css('height', viewportHeight);
		};// eof:getViewportHeight

		// update "height" property on first page load
		setViewportHeight();

		$(window).resize
		(
			function ()
			{
				// update "height" property on resize
				setViewportHeight();
			}
		);// eof: resize

		/* ========================================= */
		/* $NAVIGATION                               */
		/* ========================================= */

		/* #STICKY NAVBAR
		/* ===================== */

		// this piece of code used to
		// fix the navigation bar at the top
		// of the viewport while scrolling
		if ( $().stick_in_parent ) { $("#navigation").stick_in_parent() };

		/* #SMOOTH SCROLL
		/* ===================== */

		// smooth scroll page on navigation link click
		// useing page2id plugin
		if ( $().mPageScroll2id ){ $(".navbar-nav a, .btn-hire, #splitted-home-btn").mPageScroll2id({ offset:".navbar-header" }) };

		/* ========================================= */
		/* $TIMELINE LOADER                          */
		/* ========================================= */

		var timeline = $('.timeline');

		timeline.each
		(
			function ()
			{
				var $self = $(this),
					 relatedShowMoreBtn = $self.find('.timeline-loader-btn'),
					 relatedItems = $self.find('.timeline-item'),
					 relatedHiddenItems = relatedItems.filter(':hidden'),
					 numberOfRelatedHiddenItems = relatedHiddenItems.length;

				if ( numberOfRelatedHiddenItems !== 0 ) 
				{
					// if there are hidden items then
					// on show more button show all the hidden items
					// in the current timeline
					relatedShowMoreBtn.on
					(
						'click',
						function (event)
						{
							event.preventDefault();

							// show hidden items
							relatedHiddenItems.removeClass('hidden');

							// hide show more button
							relatedShowMoreBtn.hide();
						}
					);
				}

				else
				{
					// hide more button if there are no items
					// to show on page load
					relatedShowMoreBtn.hide();
				}
			}
		);

		/* ========================================= */
		/* $MILESTONES COUNTERUP                     */
		/* ========================================= */

		// the point of this snippet is to 
		// wait until the items show in viewport
		// then start counting up
		// it uses inview plugin to detect when items is in viewport
		// and countup plugin to increase number from 0 to whatever
		// specified number you define in html
		$('.milestones-list li').one
		(
			'inview', 
			function ( event, isInView, visiblePartX, visiblePartY )
			{
				if ( isInView )
				{
					$('.milestones-list h1').countTo();
				}
			}
		);

		/* ========================================= */
		/* $PORTFOLIO                                */
		/* ========================================= */

		/* #SHUFFLE
		/* ===================== */

		if ( $().shuffle )
		{
			// this piece of code used to categorize
			// work items with nice animation
			// using shuffle plugin
			var $grid                 = $('.portfolio-items'),
				 shuffleFiltersParents = $('.shuffle-filter li'),
				 shuffleFilters        = $('.shuffle-filter a');

			// initialize shuffle plugin
			$grid.shuffle
			(
				{
					itemSelector: '.portfolio-item'
				}
			);

			// shuffle on filter click
			shuffleFilters.on
			(
				'click',
				function (event) 
				{
					event.preventDefault();
					var 	$self     = $(this),
							$parent   = $self.parent('li'),
							groupName = $self.attr('data-group');;

					// set active class
					shuffleFiltersParents.removeClass('active');
					$parent.addClass('active');

					// reshuffle grid
					$grid.shuffle('shuffle', groupName );
				}//eof: function
			);//eof: on
		};//eof: if

		/* #LIGHTBOX
		/* ===================== */

		// show lightbox with larger image on 
		// clicking zoon button in portfolio item
		// useing magnificPopup plugin
		if ( $().magnificPopup ) { $('.zoom-btn').magnificPopup({type:'image'}) };

		/* #SHOW MORE ITEMS
		/* ===================== */

		// this is a custom script made to
		// lazy load portfolio items which already
		// exists in the page but without images
		// it resets the background of portfolio
		// item on clicking show more button
		// saving alot of http requests on the 
		// first page load

			 // config
		var maxItemsToload = 5,

			 // elements
			 allItemsCategoryTab = $('.shuffle-filter').find('[data-group="all"]'),
			 portfolioItemsHolder  = $('.portfolio-items'),
			 portfolioItems  = portfolioItemsHolder.find('> div'),
			 queuedToLoadItems = portfolioItems.filter(':hidden'),
			 loadMoreBtnHolder = $('#load-more-btn-holder'),
			 loadMoreBtn = $('#load-more-btn'),
			 itemsToLoad,
			 bgImageSrc,

			 // getters
			 totalItemsNumber = portfolioItems.length,
			 numberOfQueuedToLoadItems = queuedToLoadItems.length,
			 loadMoreBtnOriginalClasses = loadMoreBtn.attr('class'),
			 loadMoreBtnOriginalText = loadMoreBtn.text(),

			 // setters
			 loadingErrorMessage = 'Error Loading Some Items' ,
			 currentlyLoadingMessage = 'Loading Items...';

		// resetting z-index to prevent the overlapping
		// of the hidden items when it is shown
		portfolioItems.each
		(
			function ()
			{
				var $self = $(this),
					 currentIndex = $self.index();

				$self.css("z-index", totalItemsNumber - currentIndex - 1);
			}
		);

		// functionality
		if ( numberOfQueuedToLoadItems ) 
		{
			loadMoreBtn.on
			(
				'click',
				function (event) 
				{
					// disable default link action
					event.preventDefault();

					// vars
					var lastVisibleItem = portfolioItems.filter(':visible').last();

					// recollect items queued for loading
					// with exception for elements that are already processed before
					// this is made to avoid re-processing the
					// elements with error in loading images
					queuedToLoadItems = portfolioItems.filter(':hidden').not('.processed');

					// store max items to load
					itemsToLoad = lastVisibleItem.nextAll(':lt(' + maxItemsToload + ')');

					// reset shuffle category to show all items
					allItemsCategoryTab.trigger('click');

					// add ".processed" class to flag items to be loaded
					// useful in avoiding showing items in case of 
					// their related images are not loaded for any reason
					itemsToLoad.addClass('processed');

					// trigger loading indicator
					loadMoreBtn.addClass('em').text( currentlyLoadingMessage );

					console.log( itemsToLoad.length );

					// set the background src
					var imgError = false,
						 numberOfItemsToLoad = (itemsToLoad.length) - 1;

					itemsToLoad.each
					(
						function ( index )
						{
							var $self = $(this);

							// get [data-bg-src] atrribute value
							bgImageSrc = $self.attr('data-bg-src');

							// set the background of the current
							// processed element to data-bg-src value
							$self.css('background-image', 'url(' + bgImageSrc + ')');

							$('<img src=' + bgImageSrc + '>')
							.load
							(
								function () 
								{
									$(this).remove();
									
									// show images
									if ( index === numberOfItemsToLoad ) 
									{
										// load all items
										itemsToLoad.removeClass('hidden').addClass('portfolio-item');

										// re-intiate shuffle
										if ( $().shuffle ) { $grid.shuffle('appended', itemsToLoad); };

										// needed to fix suffle gutter bug
										// and show the hidden items correctly 
										// when loading items in any sub category
										$(window).trigger('resize');

										// reset buttons
										resetLoadMoreBtn();

										// remaining items
										if ( portfolioItems.filter(':hidden').not('.processed').length === 0 ) 
										{
											loadMoreBtnHolder.hide();				
										}// eof: if
									}
								}
							);
						}
					);
				}// eof: function
			);// eof: on

		}// eof: if

		else
		{
			loadMoreBtnHolder.hide();
		};// eof: else

		// reset load more button
		function resetLoadMoreBtn ()
		{
			loadMoreBtn.attr('class', loadMoreBtnOriginalClasses);
			loadMoreBtn.text( loadMoreBtnOriginalText );
		};

		/* ========================================= */
		/* $RSLIDES                                  */
		/* ========================================= */

		// image slider for work items
		if ( $().responsiveSlides ) { $(".rslides").responsiveSlides({ pager: true }); };

		/* ========================================= */
		/* $FITVIDS                                  */
		/* ========================================= */

		// responsive videos plugin
		if ( $().fitVids ) { $('.fitvid').fitVids(); };

		/* ========================================= */
		/* $TESTIMONIALS ROTATOR                     */
		/* ========================================= */

		// rotate client testimonials
		// using quovolver plugin
		if ( $().quovolver )
		{
			$('.quotes').quovolver
			(
				{
					children        : '.quote',
					transitionSpeed : 450,
					autoPlay        : true,
					equalHeight     : false,
					navPosition     : 'above',
					navPrev         : true,
					navNext         : true,
					navNum          : false,
					navText         : false
				}
			);

			// trigger previous
			$('.quote-rotator-prev').on
			(
				'click', 
				function (event)
				{
					event.preventDefault(); 
					$('.nav-prev a').trigger('click');
				}
			);

			// trigger next
			$('.quote-rotator-next').on
			(
				'click', 
				function (event)
				{
					event.preventDefault(); 
					$('.nav-next a').trigger('click');
				}
			);
		};//eof: if

		/* ========================================= */
		/* $CONTACT FORMS                            */
		/* ========================================= */

			 // config
		var captcha_error_message = 'Invalid captcha',
			 submit_success_message = 'Your message has been successfully sent',

			 // elements
			 form = $('.contact-form'),
			 captcha_numbers = $('.captcha-number'),
			 messageBox,
			 messageBoxInner;

		//define function to get form data
		function get_related_form_data ( current_form ) 
		{
      		var inputs = {};
      		current_form.serializeArray().map(function(item, index) {
      			inputs[item.name] = item.value;
      		});
      		return inputs;
		};

		// generate random captcha numbers
		function generate_captcha_numbers ( inputs )
		{
			inputs.each
			(
				function ( index )
				{
					inputs.eq( index ).val( Math.floor(Math.random() * 6) + 1 );
				}
			);
		};

		// show alert message
		function show_message ( message, status )
		{
			messageBox.removeClass('hidden');
			messageBoxInner.text( message );
			if ( status == "success" ) 
			{ 
				messageBox.removeClass('alert-danger').addClass('alert-success');
			}
			else
			{
				messageBox.removeClass('alert-success').addClass('alert-danger');
			}
		};

		// generate captcha for all
		// inputs on first load
		generate_captcha_numbers( captcha_numbers );

		// submit
		form.on
		(
			'submit',
			function ( event ) 
			{
				// prevent default page redirection
				event.preventDefault();

					 // elements
				var $self = $(this),
					 submitBtn = $self.find('input[type="submit"]'),
					 captcha = $self.find('.captcha'),
					 current_captcha_numbers = $self.find('.captcha-number'),

					 // getters
					 related_php_processor_file = $self.attr('action'),
					 submitBtnOriginalText = submitBtn.val(),
					 calculated_captcha_value = parseInt(current_captcha_numbers.eq(0).val()) + parseInt(current_captcha_numbers.eq(1).val()),
					 captchaValue = parseInt(captcha.val());

				// alert message variables re-assignment
				messageBox = $self.parent().find('.alert');
				messageBoxInner = messageBox.find('p');

				// hide message box
				messageBox.addClass('hidden');

				// strat processing status
				submitBtn.addClass('em disabled').val('Processing...');

				// verify captcha value
				if ( captchaValue === calculated_captcha_value ) 
				{
					// make ajax request
					$.post
					(
						related_php_processor_file,
						get_related_form_data( $self ),
						function ( response, textStatus, jqXHR )
						{
							// reset submit button
							submitBtn.removeClass('em disabled').val( submitBtnOriginalText );

							// test request status
							if( jqXHR.status == 200 && textStatus == 'success' ) 
							{
								if( 'success' == response.status )
								{
									// reset form (trigger reset event)
									$self.trigger('reset');

									// success action
									show_message( submit_success_message, "success" );

									// insert new capthca numbers
									// for current form captcha inputs
									generate_captcha_numbers( current_captcha_numbers );
								}
								else
								{
									// error action
									show_message( response.data );
								};// eof: else
							};// eof: if
						},
						'json'
					);// eof: post
				}

				else
				{
					//error
					show_message( captcha_error_message );

					// reset processing status
					submitBtn.removeClass('em disabled').val( submitBtnOriginalText );
				}// eof: else
			}
		);

		// hide alert message on close button click
		$('[data-hide="alert"]').click
		(
			function ()
			{
				$(this).parent().addClass('hidden');
			}
		);

	

		
		
	}
);