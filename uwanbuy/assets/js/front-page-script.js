






         // PAGE BUILDER  SUPPORT  :>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
         //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


                    //  ESSENTIAL FUNCTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

                                        //  MISCELLANEOUS FUNCTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


                                    // GENERATORS

                                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                                    const getGen5T = function () {
                                        let ort = String(new Date().valueOf()) ;
                                        return  String(ort.substring(ort.length -5 , ort.length) ) ;
                                    } ;  // END FX    <<<<<<<<<<<<<<


                                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                                    const getRanfix3 = function() {
                                        return  String(Math.floor( Math.random()*999) ) ; //+ String( Math.random()) + String( Math.random()) ;
                                    } ;  // END FX    <<<<<<<<<<<<<<


                                        //  PAGE GLOBAL CONSTANTS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                                  
                                         
                                        // DEFAULTS // SAFE NET VARIABLE DEFINITIONS :  >>>>>>>>>>>>>>>>>>>>>>>>>>
//ahmad start

                                                // Defined in a way they can be Updated 
                                            //  SAMPLE DATA !!!   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                                                let pgCartID = 'ct-0' ;
                                                let pgUserID = 'us-0' ;
                                                let pgFrmID = 'fr-0' ;

                                                const subSiteSlug = 'banke-anne' ;

                                                const subSiteArea = 'Tanke' ;

                                                const subSiteRegion = 'KWA-ILORIN' ;
                                            //  SAMPLE DATA !!!   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>





                                                // Defined in a way they CAN NOT be Updated

                                        // Generated CONSTANT SIFFIX FOR THE PAGE 
                                        const genT5R3 = getGen5T () + getRanfix3() ;

                                        // ESSENTIAL TO INitialize the Page USER
                                       // const pgUserObj = initPageUser () ;



                                       // 

        //  FUNTION TO GET THE [$SITEDATA] for the page 
        function getSubSiteData ( ssslug ){
            // Prep Async Call

            // Make Async Call to basic-init-route ( subSiteSlug)
                // Extract Response
                // Set in OBject
                // Return 

                    // DUMMMY !!!!!  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                return { frm_id : 'fr-0' } ;  

        } ;
                    //



        //  FUNTION TO GET THE [$FRMDATA] for the page 
        function getSubSiteFRM ( frm_id ){
            // Prep Async Call

            // Make Async Call to basic-init-route ( subSiteSlug)
                // Extract Response
                // Set in OBject
                // Return

                    // DUMMY !!! >>>>>>>>>>>>>>>>>>>>>>>>>>>>
                    return {

                        type : 'nodef' ,
                        id : 'fr-0' ,
                        nick : '' ,
                        created: 0 , 
                        handlerID : '' ,
                        ref_code : '' ,

                        // contactInfo : { } ,
                        // contact_location : { } ,

                        frmMeta : {} ,
                        
                        status :  {}   // Object of several params

                                //prefs : '' ,
                                //customerLog : [ ] ,
                                //transaction_log : [ ] ,

                    } ;

               

        }
        
        /*
        RETURN DATA STRUCTURE 

                {

                    type : 'nodef' ,
                    id : 'fr-0' ,
                    nick : '' ,
                    created: 0 , 
                    handlerID : '' ,
                    ref_code : '' ,

                    // contactInfo : { } ,
                    // contact_location : { } ,

                    frmMeta : {} ,
                    
                    status :  {}   // Object of several params

                            //prefs : '' ,
                            //customerLog : [ ] ,
                            //transaction_log : [ ] ,

                }


        */
        


        //   CALL TO INITIALIZE $FRM FOR THE PAGE 
           
            const subSiteData = getSubSiteData( subSiteSlug ) 

            const subSiteFRMid = subSiteData ['frm_id'] ;

           






                    //  FUNTION TO INITIALIZE THE [$USER] for the page
        const initPageUser = function () {


            // PAGE USER OBJECT from LOCAL-STORAGE
            const pgUserObj = (localStorage.getItem('pgUser') !== null ) ? JSON.parse ( localStorage.getItem('pgUser')) : 
                        { 
                            type : 'temp' ,
                            id : 'us-0' + genT5R3 , // prefix + last 5 digits of browser's timestamp { add frm component later}
                            nick : '' ,
                            created: new Date().valueOf() , 

                            ref_code : '' ,  ///  Later for referral code
                            ref_frm : '' ,
                            contact_location : {} ,  // Object of several params
                            
                            status : {} ,  // Object of several params
                            prefs : {} ,  // Object of several params
                            transaction_log : [] ,  // Array of several $Entry objects
                            last_sync :  new Date().valueOf() ,
                            last_dataUpdate : 0

                        } ;

                    // >>>>>>>  FOR UPGRADES    <<<<<<<

                    // check if pgUserObj.id is available in Database < ASYNC >
                    // Get it if available 
                    // Serialize and save to LocStorage
                    // Return the Object retrieved

                    //<<<<<<<<<<<<<<<<<<<

            // Serialize and save the Object to local storage
            localStorage.setItem('pgUser' , JSON.stringify (pgUserObj) ) ;

            // Return the Object
            return pgUserObj ;

        } ;  //  END FX  <<<<<<<<<<<<<<<<<

                    //  FUNTION TO Retrieve THE [$USER] for the page
        const getPageUser = function () {

            // LOCAL STORAGE SOURCE ONLY FOR NOW

            const pgUserObj = (localStorage.getItem('pgUser') !== null ) ? JSON.parse ( localStorage.getItem('pgUser')) :  initPageUser () ;
            return pgUserObj ;

            // LATER INCLUDE DATABASE SOURCE (by ASYNC )

        } ;  // END FX    <<<<<<<<<<<<<<


//ahmad start


        //  FUNTION TO INITIALIZE THE [$FRM] for the page
        const initPageFRM = function () {

            //  HOSTING FRM
            const pgFrmObj = (localStorage.getItem('pgFrm') !== null ) ? JSON.parse ( localStorage.getItem('pgFrm')) :  getSubSiteFRM (subSiteFRMid ) ;
                         ;

                        // >>>>>>>  FOR UPGRADES    <<<<<<<

                    // check if pgFrmObj.id is available in Database < ASYNC >
                    // Get it if available 
                    // Serialize and save to LocStorage
                    // Return the Object retrieved

                    //<<<<<<<<<<<<<<<<<<<

            // Serialize and save the Object to local storage
            localStorage.setItem('pgFrm' , JSON.stringify (pgFrmObj) ) ;

            // Return the Object
            return pgFrmObj ;

        } ;  //  END FX  <<<<<<<<<<<<<<<<<<<<


        //  FUNTION TO Retrieve THE [$FRM] for the page
        const getPageFRM = function () {

            const pgFrmObj = (localStorage.getItem('pgFrm') !== null ) ? JSON.parse ( localStorage.getItem('pgFrm')) :  initPageFRM () ;
             // Return the Object
             return pgFrmObj ;

        } ;  // END FX    <<<<<<<<<<<<<<





        //  FUNTION TO INITIALIZE THE [$CART] for the page
        const initPageCart = function ( ) {

            // PAGE CART
            const pgCartObj = (localStorage.getItem('pgCart') !== null ) ? JSON.parse ( localStorage.getItem('pgCart')) : 
                            
                           {   // looked up from cookie, session and DB  data , (latest edited is taken )
                                cart_id : 'ct-0' +  getGen5T() + getRanfix3() ,
                                cart_created : 0 , // Not untill first Item Added
                                cart_last_edit : 0 ,
                                cart_last_sync : 0 ,
                                cart_checkedOut : 0 ,

                                cart_temp_user : getPageUser() ,
                                cart_customer : '' , // set when Logged in
                            
                                cart_subtotal : 0 ,
                                cart_pr_items : [

                                    /*  {   // NOT AVAILABLE UNTILL ITEM ADDED  

                                            item_id :'' ,                       
                                            item_pr_id :'' ,  // NOT NOW
                                            item_pr_sku :'' ,
                                            item_pr_name : '' ,  //  Important mainly in Combo , band and Auction items

                                            item_pr_unit_price : 0 ,
                                            item_pr_quantity : 0 ,
                                            item_sub_value : 0 ,

                                            item_ship_class : '' ,  // NOT NOW
                                            item_sba :'' , // NOT NOW
                                            item_transp :'' , // NOT NOW
                                            item_whm : '' , // NOT NOW
                                            item_ship_meta : { } ,  // Delay till UPGRADES
                                            item_ship_bill : 0 ,  // Delay till Shipping Calculation Stage

                                            item_added :0 ,
                                            item_last_edit :0 ,
                                            item_removed :0 ,
                                            item_checkedout : 0 ,
                                            item_payed : 0 ,
                                        
                                            item_progress_report :[    // <<<<<<  NOT FOR PUBLIC  >>>>> INTERNAL ONLY
                                                {
                                                    sNum : '',
                                                    submitTime : '',
                                                    subject : '',
                                                    body : '',
                                                    attention : '',
                                                    reviewBy : '',
                                                    reviewTime : '',
                                                    reviewNote : '',
                                                    auditBy : '',
                                                    auditTime : '',
                                                    auditNote : '' ,
                                                    auditStatus : '' ,
                                                    status : '',

                                                }
                                                
                                            ] 


                                        } 
                                    */


                                ] ,


                            }  ;

                            // >>>>>>>  FOR UPGRADES    <<<<<<<

                    // check if pgFrmObj.id is available in Database < ASYNC >
                    // Get it if available 
                    // Serialize and save to LocStorage
                    // Return the Object retrieved





                    // Shipping 
                    /*

                     
                    item_ship_meta : {
                                    ship_type : "" ,
                                    ship_unit_price : 0 ,
                                    ship_size_factor : 0 ,
                                    ship_extra_addon : 0 ,
                                    ship_dicount_factor : 0 ,
                                    ship_discount_deduct : 0 ,
                                    ship_final_bill : 0 ,
                                    ship_bill_paid : 0 ,
                                    ship_bill_dropped : 0 ,
                                    ship_approval_status : {go: 0 , giveby: "" , givetime : 0 } ,
                                    ship_execute_status : {
                                        t-supply : 0 ,
                                        t-qa-passed : 0 ,
                                        t-pack-label : 0 ,
                                        t-trans-start : 0 ,
                                        t-trans-land : 0 ,

                                        t-zone-land : 0 ,
                                        t-zone-cleared : 0 ,
                                        t-pick-alert : 0 ,
                                        t-pick-ack : 0 ,

                                        t-lastmile-start : 0 ,
                                        t-lastmile-land : 0 ,
                                        t-lastmile-relay : 0 ,
                                        t-deliv-alert : 0 ,
                                        t-deliv-confirmed : 0 ,

                                        t-pss-call : 0 ,
                                        t-case-archived : 0 ,
                                        t-audit : 0 ,

                                        trans-provider = "" ,
                                        zona-reception-agent = "" ,
                                        deliv-provider = "" ,
                                        deliv-contact-agent = "" ,
                                        source-provider = "" ,
                                        qa-agent = "" ,
                                        whm-agent = "" ,
                                        crm-agent = "" ,
                                        admin-agent
                                        audit-agent = "" ,

                                        supply-status = "" ,
                                        qa-status = "" ,
                                        pack-status = "" ,
                                        trans-status = "" ,
                                        zoned-status = "" ,
                                        lastmile-status = "" ,
                                        deliv-status = "" ,
                                        pss-status = "" ,
                                        pay-status = "" ,
                                        archived-status = "" ,
                                        sum-status = "" ,
                                        audit-status = "" ,
                                    } ,

                                    ship_sum_status: "" 

                                } ,



                    */




                    //<<<<<<<<<<<<<<<<<<<

            // Serialize and save the Object to local storage
            localStorage.setItem('pgCart' , JSON.stringify (pgCartObj) ) ;

            // Return the Object
            return pgCartObj ;

        } ;   // END FX    <<<<<<<<<<<<<<


        //  FUNTION TO Retrieve THE [$CART] for the page
        const getPageCart = function () {

            const pgCartObj = (localStorage.getItem('pgCart') !== null ) ? JSON.parse ( localStorage.getItem('pgCart')) : initPageCart (pgUserObj) ;

            // Return the Object
            return pgCartObj ;

        } ;  // END FX    <<<<<<<<<<<<<<




        //  FUNTION TO INITIALIZE THE [$PAGE-META-DATA] for the page
        const initPageMeta = function ( us , frm  , ct  ) {

            const pgMetaObj = (localStorage.getItem('pgMeta') !== null ) ? JSON.parse ( localStorage.getItem('pgMeta')) : 
                            
                            {   // looked up from cookie, session and DB  data , (latest edited is taken )
                                id : genT5R3 ,
                                user_id : us.id ,
                                frm_id : frm.id ,
                                cart_id : ct.cart_id ,

           
                               // instance : 0 ,
                                opened : new Date().valueOf() ,
                                last_sync : 0 ,
                                due_sync : 0 ,

                                helper_links : [] ,
                                prod_blocks : [] ,
                                banner_sets : [] ,
                                //history : [] ,
                                status : {} ,
                                metrics : {} ,
                                misc_meta : []

                             }  ;
 
                             // >>>>>>>  FOR UPGRADES    <<<<<<<
 
                     // check if pgMetaObj.id is available in Database < ASYNC >
                     // Get it if available 
                     // Serialize and save to LocStorage
                     // Return the Object retrieved
 
                     //<<<<<<<<<<<<<<<<<<<
 
             // Serialize and save the Object to local storage
             localStorage.setItem('pgMeta' , JSON.stringify (pgMetaObj) ) ;
 
             // Return the Object
             return pgMetaObj ;



        } ;  // END FX    <<<<<<<<<<<<<<


        //  FUNTION TO Retrieve THE [$PAGE-META-DATA] for the page
        const getPageMeta = function () {

            const pgMetaObj = (localStorage.getItem('pgMeta') !== null ) ? JSON.parse ( localStorage.getItem('pgMeta')) : initPageMeta () ;

             // Return the Object
             return pgMetaObj ;

        } ;  // END FX    <<<<<<<<<<<<<<




        //>>>>>>>>> FUNCTION TO INITITIALIZE AND RETURN ALL ESSENTIAL PAGE OBJECTS>>>>>>>>>>>>>>>>>>>>
        const getPgEssParams = function( ) {

                // let pgUserObj =  initPageUser () ;

                let PgEssParams = {
                        pgUserObj : initPageUser () ,
                        pgFrmObj :  initPageFRM (),
                        pgCartObj : initPageCart ( ),
                        pgMeta : initPageMeta ( initPageUser() ,  initPageFRM()  , initPageCart() ) ,
                } ;

                return PgEssParams ;

        } ;   // END FX    <<<<<<<<<<<<<<
       


        //>>>>>>>>> FUNCTION TO CHECK  LOGIN STATUS , USER , CART  >>>>>>>>>>>>>>>>>>>>
        const checkLogin = function ( ) {

        }



//ahmad start


        //>>>>>>>>> FUNCTION TO RECKON LOGIN STATUS , USER , CART  >>>>>>>>>>>>>>>>>>>>

        const reckonLogin = function ( loginCheck ){

            // IF LOGIN >> FALSE

                // IF localStorage User isset

                    // IF USER NOT isDefault
                        // Change to Default User in Local Storage

                        // Keep a copy of localStorage - Cart in LocalStorage archiveCart

                        // Change to DefaultCart in LocalStorage - Cart 

                        // Toast  Need to Login (setTimeout) 



                    // ELSE  >>> USER  isDefault
                        // Leave things the way they are 

                        // Toast  Need to Login (setTimeout) 


                //  ELSE   >>>  localStorahge User NOT isset 
                    // Set Default User in Local Storage

                    // Set Default Cart in  localStorage 

                   // Toast  Need to Login (setTimeout)




            // ELSE  >> LOGIN TRUE

                // Get localStorage pgUser
                
                    //  IF localStorage pgUser isset   >>>>

                        // IF pgUser ['type'] !== 'temp'  NOT isDefault

                            // IF loginCheck['user_id '] === localStorage pgUser['id']

                                // Update localStorage User with checkLogin User

                                // Leave Cart as it is

                                // Check for Active Orders  (checkLogin-User)

                                // If Active-Orders
                                    // Add to LocalStorage


                            // ELSE   >>>  localStorage USER  DIFFERENT FROM loginCheck-User

                                // Keep a copy of old localStorage User in localStorage acrchiveUser

                                // Update localStorage User with checkLogin User

                                // Replace Cart with Default Cart

                                // Set Cart Customer = checkLogin-User
                                // Set Cart DefaultUser = checkLogin-User

                                // Check for Active Orders  (checkLogin-User )

                                // If Active-Orders
                                    // Add to LocalStorage


                            // END IF   >>>>>>    pgUser  IS ||  NOT  === checkLogin-User




                        // ELSE USER pgUser ['type'] == 'temp'   isDefault

                            // Change Customer User in Local Storage  = checkLogin-User

                            // Get Cart in LocalStorage 
                         
                            // Get Archive Cart in localStorage

                            // IF localStorage Archive Cart NOT empty >>>>
                                    // IF Archive-Cart ['cart_customer '] == checkLogin-User

                                        // IF localStorage Cart ['cart_pr_items'].length > 0  //  Cart Not EMPTY 
                                            // Update the cart ['cart_custumer']
                                            // Update any other neccessary
                                            // Set in localStorage

                                        // ELSE  >>    localStorage Cart ['cart_pr_items'].length < 1 //  Cart is EMPTY

                                                // Take Archive cart
                                                // Update any other Necessaary
                                                // Save Updated Archive Cart to localStorage
                                                // Empty localStorage Archive Cart

                                    // ELSE  >>>  Archive-Cart ['cart_customer ']  NOT  == checkLogin-User
                                        // Set Default Cart for localStorage
                                        // Set Cart Customer = checkLogin-User
                                        // leave Cart DefaultUser 
                                        // Add the set Cart to localStorage

                            //  ELSE  >>   localStorage Archive Cart -  empty >>>>

                                // Get Cart  in localStorage
                                // Set the Cart Customer = checkLogin-User
                                // leave Cart DefaultUser 
                                // Update any other Neccessary
                                // Add the set Cart to localStorage

                                        


                        // END IF   >>>>>>    pgUser ['type'] IS ||  NOT isDefault



                    //  ELSE >> localStorage pgUser NOT  isset  >>>>>

                        // Set checkLogin-User in Local Storage

                        // Set Default Cart in  localStorage 

                        // Set Cart Customer = checkLogin-User
                        // Set Cart DefaultUser = checkLogin-User


                    // END IF   >>>>>>    pgUser  IS ||  NOT isset



            // END IF   >>>>>>   LOGIN  == true  ||  false 



        } ;





        

                                        //>>>>>>>>>     PAGE INITIALIZATION   >>>>>>>>>>>>>>>>>>>>
                                       //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                                         // ESSENTIAL INITIALIZATIONS


                                        //  let check = checkLogin () ;

                                        //  let reck = reckonLogin (check) ;


                                        //  LocalStorage already set to Approrpriate state as per User , Cart  and  Orders 


                                        //  getPgEssParams can now be called to refresh the Page Essential Objects 

                                        const PgEP = getPgEssParams () ;

                                        //  ALL ESSENTIAL OBJECT INITIALIZED AND IN LOCAL-STORAGE and AVAILABLE in Object [ PgEP ]

                                        // Essential Objects can be called through PgEP as PgEP.pgUserObj , PgEP.pgCartObj , etc   >>>>>>>>>>>>


                                        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        



        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // PRODUCT RANGE LOADING  >>>>    FOR SWIPPER-TYPE RANGES
        // bnch
        const switchRange = function (bnch , cont , label = '' , schMarker = '' , catgr = '' , pageId =''  ) {


            // Track the Container
            let sxbox = $(cont) ;

            // Track Collect the itemBoxes
            let itemSet = $('.itemBox' , sxbox) ;

            // Fade-Out All itemBoxes
            $('.subSxnBox' , sxbox).fadeOut(600 , function(){
                
                    // Loop through bnch and itemBoxes ( each loop < till itemBoxes.length > ) - to set each itemBox    [pxs]       
                    itemSet.each( function($i , elmt ){

                        // get the current item ELEMENT
                        let pxs = $(elmt) ;
                        // get the  current item DATA
                        let elm = bnch[$i] ;

                        if (typeof elm == 'object' ){ // elm.lenght !== 0

                                // FILL THE PRODUCT ITEM ATTRIBUTES 
                                // sku, s_num , p_title ,  maker  ,  img_url 
                                // Image
                                $('.img-full' , pxs).attr('src' , elm['img_url']) ;

                                // IMAGE ENLARGE HREF
                                    // img
                                    $('.img-full' , pxs).attr('href' , elm['img_url']) ;

                                    // .pr-ad-action
                                    $('.product-add-action' , pxs).attr('href' , elm['img_url']) ;

                                //Title
                                    // Remember to replace the apostrophes
                                $('p.pTitle' , pxs).html( elm['p_title']. replaceAll ( '_' , '\'')) ;

                                //Maker 
                                    // Remember to replace the apostrophes
                                $('p.pMaker' , pxs).html( elm['maker']. replaceAll ( '_' , '\'')) ;

                                // SKU 
                                $('p.skuNum' , pxs).html( elm['sku']) ;

                                // Display Price Value 
                                $('span.price-val' , pxs).html( elm['price_up']) ;  //pxs.attr('data-item-price' ,elm['on_show_price'] ) ; 

                                // BUY NOW BTN Data- params 
                                $('.add-to-cart a' , pxs) .attr('data-buttonMarker' , `add-cart_${elm['sku']}` ) ;
                                $('.add-to-cart a' , pxs) .attr('data-var-cartAdd' , elm['sku'] ) ;  //  <<<<<<  Change to wp_id later 


                                pxs.attr('data-itemInstance' , $i + 1 ) ;
                                pxs.attr('data-item-id' , elm['sku'] ) ; // use sku for now
                                pxs.attr('data-item-price' , elm['price_up'] ) ;   //pxs.attr('data-item-price' ,elm['on_show_price'] ) ; 
                                pxs.attr('data-itemMeta' , JSON.stringify( elm ) ) ;


                                //  THE OLD ONE ::: >>>>>
                                // data-categ-serial
                                pxs.attr('data-categ-serial' , elm['s_num'] ) ; //  OLD ONES
                            
                                // data-prod-meta
                                pxs.attr('data-prod-meta' , JSON.stringify( elm ) ) ; 

                        } //  END OF IF 




                    }) ; // END OF FOR LOOP on PXS


                    //  Thereafter Fade-in All itemBoxes
                    $('.subSxnBox' , sxbox).fadeIn(800 );

            }) ;

            

            // SearchMarker and Category Data Attribute for Search Elements
            if (schMarker !== undefined ){
                // Switch [data-searchMarker] working for .seeALL  Btn &  searchBtn >> Located on the parents('goFind') (schMarker)
                $('.goFind', pxs).attr('data-searchMarker' , schMarker ) ;
              
            }
            
            if (catgr !== undefined ){
                // Switch [data-categ]  working for .seeALL  Btn &  searchBtn >> Located on the parents('goFind') (schMarker)
                $('.goFind', pxs).attr('data-categ' , catgr ) ;
              
            }

            // Switch Section Title (label)  pageLabel
            if (label !== undefined ){
                
                $('.pageLabel', sxbox ).html( label ) ;
              
            }


            // Switch other necessary Params  
                // container.currentPage   data-currentPage
             if (pageId !== undefined ){    
                sxbox.attr('data-currentPage' , pageId ) ;

             }

             // Scroll the Window to the top of the container
             $('html ,body'). animate ({ scrollTop : sxbox.offset().top + 8 } , 1000) ;




            //  >>>>>>>   LATER ....  :::  Check Container.lastUpdate and Update PageStore before Switch (if too-old) <<<<<<<<





        } ; // END OF FUNCTION  <<< switchRange >>>>>





        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // MAIN PAGE PRODUCT RANGE LOADING 
        // bnch
        //  Loading in either .primeRangeBox   OR  .secRangeBox
        //  Append cloned productItems to $('.row' , $contClone) 
        //  Append $contClone to .primeRangeBox 

        const pageLoadRange = function (bnch , pgX , cont ) {

                                    
                // CLone A Sample container
                var contx = $('.container.sample' , $(cont) ).clone(true);

                // LOOP THROUGH data bunch : {
                for (let index = 0; index < bnch.length; index++) {
                    var elm = bnch[index];

                    // load all into Cloned Container :
                            // check it is photo >>  
                    if (typeof elm == 'object' ){ // elm.lenght !== 0 
                        
                            // clone another unit >> 
                            let pxs = $('.container.sample .pxSample').clone(true) ;

                            // FILL THE PRODUCT ITEM ATTRIBUTES 
                            // sku, s_num , p_title ,  maker  ,  img_url 
                                // Image
                                $('.img-full' , pxs).attr('src' , elm['img_url']) ;

                                // IMAGE ENLARGE HREF
                                    // img
                                    $('.img-full' , pxs).attr('href' , elm['img_url']) ;

                                    // .pr-ad-action
                                    $('.product-add-action' , pxs).attr('href' , elm['img_url']) ;

                                //Title
                                    // Remember to replace the apostrophes
                                $('p.pTitle' , pxs).html( elm['p_title']. replaceAll ( '_' , '\'')) ;

                                //Maker 
                                    // Remember to replace the apostrophes
                                $('p.pMaker' , pxs).html( elm['maker']. replaceAll ( '_' , '\'')) ;

                                // SKU 
                                $('p.skuNum' , pxs).html( elm['sku']) ;


                                // ..................................



                                // FILL THE PRODUCT ITEM ATTRIBUTES 
                            // sku, s_num , p_title ,  maker  ,  img_url 
                            // Image
                            $('.img-full' , pxs).attr('src' , elm['img_url']) ;

                            // IMAGE ENLARGE HREF
                                // img
                                $('.img-full' , pxs).attr('href' , elm['img_url']) ;

                                // .pr-ad-action
                                $('.product-add-action' , pxs).attr('href' , elm['img_url']) ;

                            //Title
                                // Remember to replace the apostrophes
                            $('p.pTitle' , pxs).html( elm['p_title']. replaceAll ( '_' , '\'')) ;

                            //Maker 
                                // Remember to replace the apostrophes
                            $('p.pMaker' , pxs).html( elm['maker']. replaceAll ( '_' , '\'')) ;

                            // SKU 
                            $('p.skuNum' , pxs).html( elm['sku']) ;



                            // Display Price Value 
                            $('span.price-val' , pxs).html( elm['sku']) ;

                            // BUY NOW BTN Data- params 
                            $('.add-to-cart a' , pxs) .attr('data-buttonMarker' , `add-cart_${elm['sku']}` ) ;
                            $('.add-to-cart a' , pxs) .attr('data-var-cartAdd' , elm['sku'] ) ;  //  <<<<<<  Change to wp_id later 


                            pxs.attr('data-itemInstance' , $i + 1 ) ;
                            pxs.attr('data-item-id' , elm['sku'] ) ; // use sku for now
                            pxs.attr('data-item-price' , elm['price_up'] ) ;   //pxs.attr('data-item-price' ,elm['on_show_price'] ) ; 
                            pxs.attr('data-itemMeta' , JSON.stringify( elm ) ) ;





                                //..................................





                                // data-categ-serial
                                pxs.attr('data-categ-serial' ,elm['s_num'] ) ;
                            
                                // data-prod-meta
                                pxs.attr('data-prod-meta' , JSON.stringify(elm ) ) ;


                                                    
                                //>>                             
                            // Change Item to VISIBLE :
                            pxs.removeClass('pxSample').addClass('pxShow'); 

                            // Append the item sample to Section Shell
                            // append display unit
                            $('.row' , contx).append(pxs) ; 
                            
                        //} >> 

                    }   // IF CLOSED - for (elm !== 'undefined')
                            
                }  // FOR - LOOP CLOSED  --  ALL DATA SET IN PLACE


                // If cont not defined 
                if (cont == 'undefined' || cont == ''){

                    var wrap = $('.grabLoad') ;

                } 
                else{
                    var wrap = $( cont) ;
                }


                // Replace Placeholder Container with   Loading-gif
                $('.abdicate' , wrap).hide (700) ;
                $('.phold' , wrap).hide(700);

                // Append Container to Body >>  
                wrap.append(contx) ;

                // Show The Generated Section : Change Status of Cloned Container - to display and set in data-pgNum>> 
                contx.show(800).removeClass('sample').addClass('displayed').addClass('current-page').attr('data-pgNum' , pgX ) ;

                // Scroll Window to top 
                $('html ,body'). animate ({ scrollTop :  0} , 1500) ;

                // Scroll Container Up as well
                wrap.animate({ scrollTop :  0} , 1500) ;

        } ;   // END OF FUNCTION  <<< loadRange >>>>>



        
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // PRODUCT RANGE LOADING 
        // bnch
        const loadRange = function (bnch , pgX , cont ) {

                         
                // CLone A Sample container
                var contx = $('.container.sample' , $(cont) ).clone(true);

                // LOOP THROUGH data bunch : {
                for (let index = 0; index < bnch.length; index++) {
                    var elm = bnch[index];

                    // load all into Cloned Container :
                            // check it is photo >>  
                    if (typeof elm == 'object' ){ // elm.lenght !== 0
                    
                        // clone another unit >> 
                        let pxs = $('.container.sample .pxSample'  , $(cont) ).clone(true) ;

                        // FILL THE PRODUCT ITEM ATTRIBUTES 
                        // sku, s_num , p_title ,  maker  ,  img_url 
                            // Image
                            $('.img-full' , pxs).attr('src' , elm['img_url']) ;

                            // IMAGE ENLARGE HREF
                                // img
                                $('.img-full' , pxs).attr('href' , elm['img_url']) ;

                                // .pr-ad-action
                                $('.product-add-action' , pxs).attr('href' , elm['img_url']) ;

                            //Title
                                // Remember to replace the apostrophes
                            $('p.pTitle' , pxs).html( elm['p_title']. replaceAll ( '_' , '\'')) ;

                            //Maker 
                                // Remember to replace the apostrophes
                            $('p.pMaker' , pxs).html( elm['maker']. replaceAll ( '_' , '\'')) ;

                            // SKU 
                            $('p.skuNum' , pxs).html( elm['sku']) ;


                                // NEW ADDITIONS in REVIEW  : NOV-2023 >>>>>>>>>>>
                                

                                // Display Price Value 
                                $('span.price-val' , pxs).html( elm['price_up']) ;  //pxs.attr('data-item-price' ,elm['on_show_price'] ) ; 

                                // BUY NOW BTN Data- params 
                                $('.add-to-cart a' , pxs) .attr('data-buttonMarker' , `add-cart_${elm['sku']}` ) ;
                                $('.add-to-cart a' , pxs) .attr('data-var-cartAdd' , elm['sku'] ) ;  //  <<<<<<  Change to wp_id later 


                                pxs.attr('data-itemInstance' , index + 1 ) ;
                                pxs.attr('data-item-id' , elm['sku'] ) ; // use sku for now
                                pxs.attr('data-item-price' , elm['price_up'] ) ;   //pxs.attr('data-item-price' ,elm['on_show_price'] ) ; 
                                pxs.attr('data-itemMeta' , JSON.stringify( elm ) ) ;

                                //  <<<<<<<<<<<<<<<<<<<<<<<<



                                // THE OLD ONE  : >>>>>>>

                            // data-categ-serial
                            pxs.attr('data-categ-serial' ,elm['s_num'] ) ;
                        
                            // data-prod-meta
                            pxs.attr('data-prod-meta' , JSON.stringify(elm ) ) ;


                                                
                            //>>                             
                        // Change Item to VISIBLE :
                        pxs.removeClass('pxSample').addClass('pxShow'); 

                        // Append the item sample to Section Shell
                        // append display unit
                        $('.row' , contx).append(pxs) ; 
                        
                    //} >> 

                }   // IF CLOSED - for (elm !== 'undefined')
                        
                }  // FOR - LOOP CLOSED  --  ALL DATA SET IN PLACE


                // If cont not defined 
                if (cont == 'undefined' || cont == ''){

                    var wrap = $('.grabLoad') ;

                } 
                else{
                    var wrap = $( cont) ;
                }


                // Replace Placeholder Container with   Loading-gif
                $('.abdicate' , wrap).hide (700) ;
                $('.phold' , wrap).hide(700);

                // Append Container to Body >>  
                wrap.append(contx) ;

                // Show The Generated Section : Change Status of Cloned Container - to display and set in data-pgNum>> 
                contx.show(800).removeClass('sample').addClass('displayed').addClass('current-page').attr('data-pgNum' , pgX ) ;

                // Scroll Window to top 
                $('html ,body'). animate ({ scrollTop :  0} , 1500) ;

                // Scroll Container Up as well
                wrap.animate({ scrollTop :  0} , 1500) ;

        } ;





                // ?move=searchRange&categ=[ categID:CategName eg 1:COSMETICS  ]&schTerm=searchword&schFields=title|categ|maker


                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                //  PAGINATION EVENT TO LOAD PAGES
                    // .pagin <span class="pg-lk" data-pgx=""></span>

                $(document).on('click' , '.pagin .pg-lk' , function(ep){
                        ep.preventDefault() ;
                        var t = ep.target ;
                        var tgp = $(t) ;
                        var tprnt = tgp.parents('.pagin') ;
                        var pgN = tgp.attr('data-pgx') ;

                        var pgCl = tprnt.clone(true) ;

                        // prep old page for removal
                        $('.grabLoad .displayed.current-page').addClass('abdicate').addClass(`abdicated-pg-${pgN}`).removeClass('current-page') ;

                        // Extract the stored Data
                        var pgPrDat = JSON.parse( $('#pgStore').html() ) ;

                        //Extract the Page to show Data
                        var bnchX = pgPrDat['data'][pgN -1] ;

                        // Call the loadRange ()

                        loadRange (bnchX , pgN , '.grabLoad') ;

                        // Replace The Pagination  >> determined by pgN
                        // Empty the current Pagination
                        $('.current-page .pagin.pgtop ').html(pgCl.html()) ;
                        $('.current-page .pagin.pgbtm ').html(pgCl.html())  ;

                        // Set all page buttons in-Active
                        $('.pg-lk' , '.grabLoad .current-page').removeClass('activePg') ;

                        // Set Current page button Active
                        $(`.pg-lk[data-pgx = "${pgN}"]`).addClass('activePg') ;

                }) ;




                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                // SEARCH BUTTON CLICK EVENT HANDLER 

                $(document).on('click' , '.goFindBtn' , function(ef){
                        ef.preventDefault() ;
                        var t = ef.target ;
                        var tgp = $(t) ;
                        var tprnt = tgp.parents('.goFind') ;

                        var goData = { } ;

                        //xxxxxxxxxxxxxxxx sba
                        goData['sba'] = 'Open-Slot';  // THE CASE FOR SBA MANIFEST 

                        //  $acslev 
                        goData['acslev'] = 0 ;

                        // $pglim   
                        goData['pgSz'] = 48 ;

                        // $pglim   
                        goData['pglim'] = 48 ;

                        //???????????????? $categ  Get Categ into goData  .findCateg
                        //if ( $('.findCateg' , tprnt).val() !== 'undefined' &&  $('.findCateg' , tprnt).val() !== '' )

                        // $categ  Get Categ into goData  .findCateg
                        if ( $('.findCateg' , tprnt).val() !== undefined &&  $('.findCateg' , tprnt).val() !== '' )
                            {
                                goData['categ'] = $('.findCateg' , tprnt).val()
                            }
                            else {
                                if ( tprnt.attr('data-categ') !== undefined &&  tprnt.attr('data-categ') !== '' )
                                    {
                                        goData['categ'] = tprnt.attr('data-categ') ;
                                    }
                                    else{ goData['categ'] = 'all'  ; }
                            }


                        

                        // $expr  Get Search Term goData  .findTerm
                        if ( $('.findTerm' , tprnt).val() !== 'undefined'  )
                        {
                        goData['schTerm'] = $('.findTerm' , tprnt).val().trim() ;

                        goData['expr'] = $('.findTerm' , tprnt).val().trim() ;


                        }

                        // Search Fields
                        goData['schFields'] = 'title|categ|maker' ;


                        // >>>>>>>> call sxnLoad Modal with load url and goData and complete fx with the ajax success and error incorporated



                        // Make AJAX Call
                        $.ajax({
                            type: 'post',
                            //url : 'remd-manifest-helper.php?move=searchProd'  ,
                            url : 'page-init-helper-pre.php?move=searchProd'  ,
                            data : {batch: JSON.stringify( goData)},
                            
                            dataType : 'json',
                            beforeSend : function(x){if (x && x.overrideMimeType) {
                                x.overrideMimeType('application/json; charset= utf-8') ;
                                                        }
                                        } ,
                                        // SUCCESS
                            success : function(resData , stat , xhr) {

                            console.log(resData) ;

                                // THE WHOLE PACKET 
                                var pkt = resData ;
                                // ['status''=>
                                var repot = pkt['status'] ;
                                // 'data'=>
                                var pkData = pkt['data'] ;
                                // 'count''=>
                                var itmN = pkt['count'] ;
                                // 'pgnum''=>
                                var pgN = pkt['pgnum'] ;

                                // Check Data NOT Empty 
                                if(itmN >= 1) {
                                    // =======>>>>> Make a #pgStore and Tag it 

                                    // Keep the packet
                                    $('#pgStore').html(JSON.stringify( pkt)) ;


                                    // prep old page for removal
                        $('.grabLoad .displayed.current-page').addClass('abdicate').addClass(`abdicated-pg-${$('.grabLoad .displayed.current-page').attr('data-pgNum')}`) ;

                        $('.grabLoad .displayed.current-page').removeClass('current-page') ;


                                    //  set the first Page in place
                                    var bchN = pkData[0] ;
                                    var pg1 = 1 ;
                                        // call  loadRange = function (bnch , cont ) 
                                    loadRange(bchN , pg1 , '.grabLoad')

                                    // Replace The Pagination  >> determined by pgN
                                            // Empty the current Pagination
                                            $('.current-page .pagin.pgtop ').html('') ;
                                            $('.current-page .pagin.pgbtm ').html('') ;

                                    for (let index = 0; index <= pgN -1 ; index++) {
                                        // Append a Page link Set to both top and bottom
                                        $('.current-page .pagin.pgtop ').append(`<span class="pg-lk" data-pgx="${index+1}"> ${index+1} </span>|`) ;
                                        $('.current-page .pagin.pgbtm ').append(`<span class="pg-lk" data-pgx="${index+1}"> ${index+1} </span>|`) ;
                                        
                                    }

                                    // Set First Page as Active 
                                    $(`.pg-lk[data-pgx="1"]`).addClass('activePg') ;

                                    // Alert Number of Products and Number of Pages 

                                    iziToast.success({
                                                        id: 'success',
                                                        zindex: 9999,
                                                        timeout: 3000,
                                                        title: 'SEARCH SUCCESSFUL : ',
                                                        overlay: true,
                                                        position: 'center',
                                                        message: `Items Found : ${itmN}  ; <br>Arranged in ${pgN} Pages.`
                                                        });


                                }
                                else{
                                    // Just Alert that result was not found
                                    
                                iziToast.info({
                                                timeout: 6000,
                                                overlay: true,
                                                displayMode: 1,
                                                id: 'inputs',
                                                zindex: 999,
                                                title: 'NO ITEM TO DISPLAY :',
                                                message: `${repot}`,
                                                position: 'center',
                                                drag: false,

                                                inputs: [
                                                        
                                                ] ,


                                                buttons: [
                                                        ['<button><b>Try Again</b></button>', function (instance, toast, button, e, inputs) {

                                                        

                                                        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                                        iziToast.success({
                                                        id: 'success',
                                                        zindex: 9999,
                                                        timeout: 3000,
                                                        title: 'Trying Again? ',
                                                        overlay: true,
                                                        message: 'Hint : Make sure you spell correctly'
                                                        });

                                                        // Scroll to the Search Bar
                                                        $('html ,body'). animate ({ scrollTop :  0} , 1500) ;


                                                }, false], 

                                                        ['<button><b>OK Then</b></button>', function (instance, toast, button, e, inputs) {
                                                            
                                                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                                            iziToast.success({
                                                            id: 'success',
                                                            zindex: 9999,
                                                            timeout: 3000,
                                                            title: 'Leaving The Search? ',
                                                            overlay: true,
                                                            message: 'What You are looking for could be here still. It May be in another Category.',
                                                            position: 'topLeft'
                                                            });

                                                            

                                                            }, false],

                                                ],


                                        });
                                }
                            
                            
                            } ,
                                        

                                        // ERROR
                            error : function(xr , sts , er) {

                                // Alert there was an error

                                iziToast.error({
                                        title: 'Oops! Error :',
                                        position: 'center',
                                        message: 'We encountered an Error while running Your search. <br> Please adjust your input.'
                                    });

                                    console.log (sts + ' -##- '  + er ) ;

                            }

                        }) ;

                } ) ;






        
        //  PAGE INIT ESSENTIALS  ------   [  ON PAGE LOAD ] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


        $(document). on ('load' , function(){


              //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

                

                //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


        } ) ;  // <<<<<<<<<<<  END OF [ DOC.LOAD() ]







        //  PAGE INIT ESSENTIALS  ------   [  ON PAGE READY ] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        $(document). on ('ready' , function(){



            // :  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

            
        
   
        
        


                // SMooth Scroll    << data-xScroll >>
            
                $('[data-xScrollTo]').on('click' , function(ev){
                    ev.preventDefault() ;
                    let t = ev.target ;
                    let tg = $(t) ; 
                    let des = $(`[data-xScrollAnchor="${tg.attr('data-xScrollTo')}"`) ;
                    let desPos = des.offset().top ;
                    console.log(des) ;
                    console.log (desPos);

                    $('html ,body'). animate ({ scrollTop : desPos -80} , 1500) ;
                    
    
                })




                // SMooth Scroll  IN PARENT  << data-pScroll    >>>>>>>>>>>>>>>>>>>>>
    
                $('[data-pScrollTo]').on('click' , function(ev){
                    ev.preventDefault() ;
                    let t = ev.target ;
                    let tg = $(t) ; 
                    let scrParent = tg.parents('.scroll-parent')
                    let des = $(`[data-pScrollAnchor="${tg.attr('data-pScrollTo')}"`) ;
                    let desPos = des.offset().top ;
                    
                    
                    scrParent.animate ({ scrollTop : desPos - 20 } , 1800) ;
                    
    
                })






                //  JS_MORE BOX - OUTER    OPEN AND CLOSE   >>>>>   GENERAL >>>>>>>>



                // SET 1  >>>>>>>>>>>>>

                $('.js-more-btn-out' ).on('click', function(ex){
                
                ex.preventDefault();
                let t = ex.target ;
                let tg = $(t) ; 
                let tbx = tg.parents('.js-more-box-out') ;
                $('.js-comp-more-out' , tbx).show(500 , function() {   

                    // get offset of opened box
                    let pnt = $('.js-comp-more-out' , tbx).offset().top ;

                    // scrol to the point
                    $('html ,body'). animate ({ scrollTop : pnt -30} , 500) ;
                    
                }) ;

            // Deal with alternates
            if ($('.js-comp-more-out2' , tbx) !== 'undefined' ) {$('.js-comp-more-out2' , tbx) .hide(600); }
            if ( $('.js-more-btn-out2' , tbx) !== 'undefined') {$('.js-more-btn-out2' , tbx).removeClass('btn-fade'); }
                
            // 

                tg.addClass('btn-fade');
                
            }) ;
                
                
                
            $('.js-more-close-out' ).on('click' , function (e) {
                e.preventDefault();
                let t = e.target ;
                let tg = $(t) ; 
                let tbx = tg.parents('.js-more-box-out') ;

                // Get Parents Top Offset
            let desPos = tbx.offset().top ;

            //Close More Box                    
            $('.js-comp-more-out' , tbx).hide(600); 

                // UNFADE Box-Open Button
                $('.js-more-btn-out' , tbx).removeClass('btn-fade');

                // Scroll Parent Up 
                $('html ,body'). animate ({ scrollTop : desPos -20} , 800) ; 

                                                
                
            } ) ;



            // SET 2   >>>>>>>>>>>>

            $('.js-more-btn-out2' ).on('click', function(ex){
                
                ex.preventDefault();
                let t = ex.target ;
                let tg = $(t) ; 
                let tbx = tg.parents('.js-more-box-out') ;
                $('.js-comp-more-out2' , tbx).show(500 , function() {   

                    // get offset of opened box
                    let pnt = $('.js-comp-more-out2' , tbx).offset().top ;

                    // scrol to the point
                    $('html ,body'). animate ({ scrollTop : pnt -30} , 500) ;
                    
                }) ;

            // Deal with alternates
            if ($('.js-comp-more-out' , tbx) !== 'undefined' ) {$('.js-comp-more-out' , tbx) .hide(600); }
            if ( $('.js-more-btn-out' , tbx) !== 'undefined') {$('.js-more-btn-out' , tbx).removeClass('btn-fade'); }
                
            // 

                tg.addClass('btn-fade');
                
            }) ;
                
                
                
            $('.js-more-close-out2' ).on('click' , function (e) {
                e.preventDefault();
                let t = e.target ;
                let tg = $(t) ; 
                let tbx = tg.parents('.js-more-box-out') ;
                $('.js-comp-more-out2' , tbx).hide(600); 
                
                $('.js-more-btn-out2' , tbx).removeClass('btn-fade');


                // Get Parents Top Offset
                let desPos = tbx.offset().top ;
                // Scroll Parent Up 
                $('html ,body'). animate ({ scrollTop : desPos -20} , 800) ;
                                                
                
            } ) ;






            //  JS_MORE BOX - INNER    OPEN AND CLOSE   >>>>>   GENERAL >>>>>>>>



                // SET 1  >>>>>>>>>>>>>

                $('.js-more-btn' ).on('click', function(ex){
                
                ex.preventDefault();
                let t = ex.target ;
                let tg = $(t) ; 
                let tbx = tg.parents('.js-more-box') ;
                $('.js-comp-more' , tbx).show(600 ); 



            // Deal with alternates
            if ($('.js-comp-more2' , tbx) !== 'undefined' ) {$('.js-comp-more2' , tbx) .hide(600); }
            if ( $('.js-more-btn2' , tbx) !== 'undefined') {$('.js-more-btn2' , tbx).removeClass('btn-fade'); }
                
            // 

                tg.addClass('btn-fade');
                
            }) ;
                
                
                
            $('.js-more-close' ).on('click' , function (e) {
                e.preventDefault();
                let t = e.target ;
                let tg = $(t) ; 
                let tbx = tg.parents('.js-more-box') ;
                $('.js-comp-more' , tbx).hide(600); 
                
                $('.js-more-btn' , tbx).removeClass('btn-fade');

                // Get Parents Top Offset
                let desPos = tbx.offset().top ;
                // Scroll Parent Up 
                $('html ,body'). animate ({ scrollTop : desPos -20} , 800) ;
                
                                                
                
            } ) ;




            // SET 2   >>>>>>>>>>>>

            $('.js-more-btn2' ).on('click', function(ex){
                
                ex.preventDefault();
                let t = ex.target ;
                let tg = $(t) ; 
                let tbx = tg.parents('.js-more-box') ;
                $('.js-comp-more2' , tbx).show(600); 

            // Deal with alternates
            if ($('.js-comp-more' , tbx) !== 'undefined' ) {$('.js-comp-more' , tbx) .hide(600); }
            if ( $('.js-more-btn' , tbx) !== 'undefined') {$('.js-more-btn' , tbx).removeClass('btn-fade'); }
                
            // 

                tg.addClass('btn-fade');
                
            }) ;
                
                
                
            $('.js-more-close2' ).on('click' , function (e) {
                e.preventDefault();
                let t = e.target ;
                let tg = $(t) ; 
                let tbx = tg.parents('.js-more-box') ;
                $('.js-comp-more2' , tbx).hide(600); 
                
                $('.js-more-btn2' , tbx).removeClass('btn-fade');


                // Get Parents Top Offset
                let desPos = tbx.offset().top ;
                // Scroll Parent Up 
                $('html ,body'). animate ({ scrollTop : desPos -20} , 800) ;
                                                
                
            } ) ;









            //  >>>>>>>  RETURN TO TOP OF SECTION  >>>>>

            $('.sxn-goup').on('click', function(ex){
                    ex.preventDefault();
                    let t = ex.target ;
                    let tg = $(t) ; 
                    let pos = tg.parents('.container').offset().top ;
                
                    
                    $('html ,body').animate({scrollTop:pos-80}, 800);
                
                
                
                });

            
            





        


            /*
        ,function(){
                        $('#myModal-x').modal({show:true});
                    }
            */


           



            //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


        } ) ;

/**/
// TESTERS:  >>>>>>>>>>>>>>>>>>>>>>>>>>
        $(document). on ('ready' , function(){      
      
            console.log(PgEP.pgUserObj.id) ;

            console.log(PgEP) ;

        } ) ;
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<







        // END >>>  PAGE BUILDER  SUPPORT  :>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
         //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



         








        //  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            


        //>> Payment - 
            //> direct -
                //initPayment
                    // Triggered by Btn/Link : Pay By Direct Transfer
                    // IF (!Network)  -  Display Network Disconnected alert(toast)
                    // Get the Payment Details(purpose, amount, customer_id,  payment_option, frm_id )
                    // Call route initPayment
                    // Receive the Payment Details (payIndex ,purpose, amount, customer_id,  payment_option, frm_id , amountPaying, expireTime )
                    // Display payIndex
                    // Display further instructions + expireTime
                    // Btn/Link to ReportPayment (with payIndex in data-ref)
                    


                //initPayReport
                    // Set as handler for Btn: Report Payment
                    // Get the Payment Details(payIndex) - call route initPayReport
                    // Check ExpireTime - if expired -  Display Expired Alert, 
                    // else - Display Payment Report Form - prefilled with initPayReport details
                    // Submit PayReport Btn/Link :  submitPayReport (with payIndex in data-ref)

                //submitPayReport
                    // Set as handler for Btn: Submit Payment Report
                    // Get the Payment Details(payIndex, reportDetails) - call route submitPayReport
                    // Validate Report Details complete and valid
                    // Update localStorage['pgCartObj'] with new Payment Status : payReported
                    // Display Payment Report Success Alert (toast)

            //> agent -
                // CustomerInitPayment
                    // Triggered by Btn/Link : Pay By Agent
                    // IF (!Network)  -  Display Network Disconnected alert(toast)
                    // Get the Payment Details(purpose, amount, customer_id,  payment_option, frm_id )
                    // Call route initPayReport
                    // Receive the Payment Details (payIndex ,purpose, amount, customer_id,  payment_option, frm_id , amountPaying, expireTime )
                    // Get FRM Details - call route OR from PgEP : (frm_id, frm_name, frm_phone, frm_email, frm_address)
                    // Display payIndex
                    // Display further instructions + AgentContactDetails + expireTime
                    // Btn/Link to AckAgentPayment (with payIndex in data-ref)
                    
                //initAgentPayReport (agent in FRM Dashboard)
                    // Set as handler for Btn: AgentReportPayment (in FRM Dashboard)
                    // Display Agent's Payment Report Form (payIndex ,purpose, amount, Btn:Continue)
                    // onChange (payIndex) {Btn:Continue.attr('data-ref' , payIndex) } 
                    // Btn:Continue - call route initAgentPayReport (agent) - with payIndex in data-ref
                    // Receive the Payment Details (payIndex ,purpose, amount, customer_id,  payment_option, frm_id , amountPaying, expireTime )
                    // Get FRM Details - call route OR from PgEP : (frm_id, frm_name,)
                    // Display form entries for { payIndex , amountPaid, transferRef , frmPassword, frmComment }
                    // (when all essential entries filled) ? Display Btn/Link to submitAgentPayReport (with payIndex in data-ref) : hide Btn  < put onChange on all essential entries >
                    


                //submitPayReport
                    // Set as handler for Btn: SubmitAgentPayReport
                    // Get the Entries (payIndex, reportDetails) - into FormData
                    // Validate Report Details complete and valid
                    // Call route submitAgentPayReport
                    // Display Payment Report Success Alert (toast)

                //InitCustomerAck
                    // Set as handler for Btn: AckAgentPayment
                    // Get the Payment Details(payIndex) - call route initCustomerAck 
                    // Display customerAckReport Form - prefilled with AgentPayReport details { payIndex ,purpose, amountPaid, frm_id , frm_name , customer_id } 
                    // Display entries for customerAck , customerAckComment , customerAckPassword
                    // Display Submit Btn/Link :  submitCustmAck (with payIndex in data-ref)

                //submitCustmAck
                    // Set as handler for Btn: SubmitCustmAck
                    // Get the Entries (payIndex, reportDetails) - into FormData
                    // Validate Report Details complete and valid
                    // Call route submitCustmAck
                    // Display CustomerAckReport Success Alert (toast)

            


            //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            //   >>>>>>>>>>>     GO-10-50  FUNCTIONS     >>>>>>>>>>>>>>>>>>>>>>>>>>>>        
            //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


            /*

                ##-1
                >> Login-sync, 
                > front-back sync
                > wp-back sync

                >> Payment - 
                > direct -
                initPayment
                initPayReport
                submitPayReport
                > agent -
                initPayReport 
                submitPayReportl
                InitCustomerAck
                submitCustmAck


                > mnger - < IN MANGER DASHBOARD >
                initAdminPayment
                Actions :  
                - confirm (sing/multi)
                - approve (sing/multi)
                - decline 1q(sing/multi)
                - flag (sing/multi)


                >> WalletPay - < IN FRONT & WP >
                > checkWalletFit () 
                    { getBillValue , updateWalletBal () ; getWalletBalance ; if ( billValue > walletBalance ) ? return false : return true ; } , 
                > displayWalletBal 
                    { reckonLogin () ; get customerID ; call route getWallet ; display .walletBal in widgets ; update localStorage ; update PgEP.walletBal; reckonWallet() ; },
                > updateWalletBal()
                    {reckonLogin () ; get customerID ; call route getWallet ; update .walletBal in widgets ; update localStorage ; update PgEP.walletBal; reckonWallet() ; }, 
                > payByWallet() 
                    {getValue , getPurpose, getOrderID , getCustomerID, getFrmID ; call route payByWallet; Alert Success/Fail ; updateWalletBal();  reckonWallet(); }, 
                > reckonWallet() 
                    { refreshes all .btn['data-wfit'] , .sxn['data-wfit'] :: hide if > current walletValue }
                > 

                >> CustomerRegistration -
                .+ mnger - reg from whatsapp
                init
                submit
                .+ dump sheet 

                






                ##-2
                >> Cart (+ cartNotificationWidgets + PgEp.cartObj + localStorage['pgCartObj'] ), 
                init, 
                add , 
                edit, 
                dump, 

                >>  Checkout - 
                > init , 
                > cancel , 
                > finish = walletPay || initPay** 


                >> Product display 
                > init(
                fullpage , 
                inModal
                ) , 
                > switchRange , 
                > singleDetail, 
                > MultiDetail,



            */



















        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // PRODUCT RANGE LOADING 
        // <@ININT> Loads A Category Page Section with fresh details : Tags, Search , Title , SeeAll link , ProductItems , ContainerAttributes
        const loadTagBlock = function (bnch , cont  ) {

          

            // Title , 
                // Built From Tag Label

            //  SeeAll link , :  To show ALL fetched products from a TAG's search ( displayed with pagination in Modal) 
                // Leave the search Marker   : WP-Category to search [ categID:CategName eg 1:COSMETICS  ] 
                // replace data-schTerm
                // replace data-schFields
                // replace Total Count  :  tagSet['itemNum']

            //  ProductItems ,
                // Get Prod-items in Container
                // Set Iterator 
                // LOOP Through to replace params with corresponding params in bnch[ix]
                    // replace Shell attributes
                        // data-item-price
                        // data-prodMeta  = JSON.stringify (bnch[ix] ) 
                        // data-item-index  = ix
                        // data-specLabel
                        
                    // Image
                    // title
                        // Remember to replace the apostrophes
                    // sku
                    // price
                    // 

            //  ContainerAttributes 
                // replace data-activeCateg
                // replace data-activeTag  :  @INIT = 0 == featured [ set to current data-tagIndex ]

            // MARK ACTIVE TAG



            // ??  Section Banner for the Current Tag




            } ;



        
        $('.sxn-tag').on ('click' , function(v){

            v.preventDefault();
            let prt = $(v.target).parents('.subSxn-shell') ;
           // var cl = $('.swiper-wrapper' , prt).clone(true) ;
           // cl.addClass ('d-none').addClass('treated') ;
           let wrap = $('.swiper-wrapper' , prt);
            wrap.addClass('abdicate') ;
           let ph = $('.img-full' , wrap) ;

            wrap.fadeOut(1000, function(){
                ph.each(function(k,tm){
            $(tm).attr('src' ,'../assetsecm/images/prhv/034285672027_360x.png' ) ;}) ;
           wrap.fadeIn(1800 ) ;

           }) ;
           
           
           
          //  cl.removeClass('d-none') ;
            console.log( $(v.target).parents('.subSxn-shell') ) ;
        }) ;




        
                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>         
                // WHEN PAGE FIRST LOAD
                $(document).on('ready' , function (){

                // Get all Category Sections On the Page  :  Get all $('.sxn-block')
               

                // LOOP THROUGH (.each)
                    // Get the corresponding Store Data  :  = JSON.parse(  $(`.pgStore #${sxn.attr ('data-sxnNm')}`).html( ) )

                    // set the data-sxnNm data-pgSz , data-sxnStyle , data-categ and data-marker



                } ) ;








                // SHOW MORE PRODUCTS   >>>>>>

                $('.seeMore').on('click' , function(e){

                    e.preventDefault();

                    let t = e.target ;
                    let tg = $(t) ; 
                    let tp = tg.parents('.container') ;
                    
                    $('.more-products' , tp).show(2500);

                    tg.addClass('btn-fade');

                }) ;


                $(document).on('ready' , function (){ $('.tempo.hideSlide').hide() ;}) ;



        

            

            
    
                            



            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // PRODUCT RANGE LOADING 
        // <@ININT> Loads A Category Page Section with fresh details : Tags, Search , Title , SeeAll link , ProductItems , ContainerAttributes
        const loadCateg = function (bnch , $cont , tagSet , pgSz ,  schMarker ) {

            // Tags,   tagSet = [  { index: 0 ,  label:'', searchTerm:'' , searchFields: 'title|categ|maker' , markerCateg: 'o:all' ,  itemNum : 0 } , ]
                // Prep Old Tags for removal
                $('.sxn-tag' , $cont ).addClass('expire') ;
                // Initiate builder string
                $nTg = '' ;
                // Open with tag - "featured"
                // LOOP THROUGH tagSet :

                    // clone sample tag

                    // fix label
                    // fix data-schTerm
                    // fix data-schFields
                    // add clone to builder
                // END LOOP
                // Prep Clone to show and Append to shell
                // Fade-out old tags
                // show new Tags
                // remove old tags

            // Search ,
                // fix the data-searchMak :  searchMarker =  WP-Category to search [ categID:CategName eg 1:COSMETICS  ] 

            // Title , 
                // Built From Tag Label

            //  SeeAll link , :  To show ALL fetched products from a TAG's search ( displayed with pagination in Modal) 
                // fix the search Marker   : WP-Category to search [ categID:CategName eg 1:COSMETICS  ] 
                // fix data-schTerm
                // fix data-schFields
                // fix Total Count  :  tagSet['itemNum']

            //  ProductItems ,
                // Get Prod-items in Container
                // Set Iterator 
                // LOOP Through to replace params with corresponding params in bnch[ix]
                    // Shell attributes
                        // data-item-price
                        // data-prodMeta  = JSON.stringify (bnch[ix] ) 
                        // data-item-index  = ix
                        // data-specLabel
                        
                    // Image
                    // title
                        // Remember to replace the apostrophes
                    // sku
                    // price
                    // 

            //  ContainerAttributes 
                // data-activeCateg  :  set to the arg searchMarker [ categID:CategName eg 1:COSMETICS  ] 
                // data-activeTag  :  @INIT = 0 == featured [ set to current data-tagIndex ]

            // ??  Section Banner for the Current Tag





            } ;















    
        //  Check Cart Status BEFORE running the function ( if checked out : DO NOT RUN , but prompt to create another cart )
        /*
        function addCart ( prCartData , CartData  )

        */
        const addCart  = function ( prCartData , CartData  )
        {
                            

                                

                                
                            
                // Arrange the constants , prefixes and suffixes :
                let sn = CartData.cart_pr_items.length + 1 ;  //  if an item was removed , the array length would have changed 
                let curTime = new Date().valueOf() ;  
                // Item Product Object (full)
                let extrPrObj = JSON.parse (prCartData.itmData)  //  A full Product object invoved in the Cart Add 


            


                // keep in storage

                    // 
                    // create cartProductItem and load properties
                    //let cPI  =CartData.pr ;
                    let cPI = { } ;
                        // item_id :'' ,  >>  TO BE GENERATED
                        cPI['item_id'] = CartData.cart_id + `_${sn}` ;
                        // item_pr_id :'' ,  
                        cPI['item_pr_id'] = prCartData.itmID ;
                        // item_pr_sku :'' ,
                        cPI['item_pr_sku'] = prCartData.itmData['wp_sku'] ;
                        // item_pr_title :'' ,
                        
                        // item_pr_unit_price : 0 ,
                        cPI['item_pr_unit_price'] =  prCartData.itmUnPrice ;
                        // item_pr_quantity : 0 ,
                        cPI['item_pr_quantity'] =  prCartData.itmQty ;
                        // item_sub_value : 0 ,
                        cPI['item_sub_value'] = prCartData.itmUnPrice *  prCartData.itmQty  ;

                        // item_ship_class : '' ,  // NOT NOW
                        // item_sba :'' , // NOT NOW
                        // item_transp :'' , // NOT NOW
                        // item_whm : '' , // NOT NOW

                        // item_added :0 ,
                        cPI['item_added'] = curTime ;
                        // item_last_edit :0 ,
                        // item_removed :0 ,
                        // item_checkedout : 0 ,
                        // item_payed : 0 ,
                    
                        // item_progress_report :[ ]
                    // page-object store
                        // Update pgStorage prItems
                        PgEP.pgCartObj.cart_pr_items[sn -1] = cPI ;
                        // Update pgStorage Object Props
                            //cart_last_edit : 0 ,
                            PgEP.pgCartObj.cart_last_edit = curTime ;
                            // cart_last_sync : 0 ,                                        
                            // cart_subtotal : 0 ,
                            PgEP.pgCartObj.cart_subtotal = CartData.cart_subtotal + ( prCartData.itmUnPrice *  prCartData.itmQty ) ;

                    
                    // localStorage
                    localStorage.setItem('pgCart' , JSON.stringify (PgEP.pgCartObj) ) ;

                // Add to page cart  $('.minicart-content')
                            // DO BEFORE RUNING FUNCTION >>>>>  // check cart status  :  cartBox.attr('data-cart-status')

                                    

                    // clone cart-item template
                    let cpt = $('.cartBox .itemBox.pxSample').clone(true) ; 


                    // fill in cloned cart-item template
                        // item serial   itemBox.attr('data-item-serial') =  cartBox.attr('data-cart-count') + 1
                        cpt.attr('data-item-serial' , sn)  ;
                        // item meta    itemBox.attr('data-item-meta') = JSON.stringify(CtData.itmData )
                        cpt.attr('data-item-meta' , function(){ JSON.stringify( cPI );} ) ;
                        // item title  : 'a.pTitle'  =  CtData.itmData.pTitle
                        $('a.pTitle' , cpt).html( extrPrObj['var_title']) ;

                        // item sku  : 'span.product-item_sku'  ,  itemBox.attr('data-item-sku') =  CtData.itmID
                            //'span.product-item_sku'
                            $('span.product-item_sku' , cpt).html(cPI['item_pr_sku']) ;
                            // itemBox.attr('data-item-sku')
                            cpt.attr('data-item-sku' , cPI['item_pr_sku'])   ;
                        
                        // item prod id  :  ,  itemBox.attr('data-item-prid') =  CtData.itmID
                            
                            //  itemBox.attr('data-item-prid')
                                cpt.attr('data-item-prid' , cPI['item_pr_id'] )  ;

                        // item photo  : $('img.img-full' , itemBox).attr('src') =  CtData.itmData.photoLink
                            $('img.img-full' , cpt).attr('src' ,   extrPrObj['var_photo-link'])  ;

                        // item quantity  : 'span.product-item_qnty'
                        $('span.product-item_qnty' , cpt).html(cPI['item_pr_quantity']) ;

                        // item unit-price  : 'span.product-item_unitPrice'  ,  itemBox.attr('data-item-price')
                            // 'span.product-item_unitPrice'
                            $('span.product-item_unitPrice' , cpt).html(cPI['item_pr_unit_price']) ;

                            // itemBox.attr('data-item-price')
                            cpt.attr('data-item-price' ,  cPI['item_pr_unit_price'] )  ;

                        // item value   : 'span.subVal'  <calc>
                        // 'span.subVal' 
                            $('span.subVal' , cpt).html( cPI['item_sub_value']) ;

                            // itemBox.attr('data-item-val')
                            cpt.attr('data-item-val' , cPI['item_sub_value']  ) ;

                    
                    // Append Item   container = $('ul.minicart-list' , cartBox )
                    cpt.removeClass('pxSample') ;
                    $('ul.minicart-list' , '.cartBox.minicart-content' ).append(cpt) ;

                    // Update Cart summary
                        // cart-subtotal  :  data-cart-subtotal  ,  data-cart-total , $('span.cart-total-val').html()
                                // data-cart-subtotal
                                $('.cartBox.minicart-content' ).attr('data-cart-subtotal' , PgEP.pgCartObj.cart_subtotal )

                                // data-cart-total  >>> Leave for Now     ( Till Shippiong Calc - to be done @ Checkout Stage)   <<<<<<

                                // $('span.cart-total-val').html()
                                $('span.cart-total-val' , '.cartBox.minicart-content').html( PgEP.pgCartObj.cart_subtotal )

                        // cart-count  :  data-cart-count  ,
                            $('.cartBox.minicart-content' ).attr('data-cart-count' , sn ) ;
                        // cart meta  :
                        $('.cartBox.minicart-content' ).attr('data-cart-meta' , function(){ JSON.stringify( PgEP.pgCartObj ) } ) ;
                        // cart notification icon :  $('.data-middle-wrap a[href="#miniCart"] span.quantity').html()
                        $('.data-middle-wrap a[href="#miniCart"] span.quantity').html(PgEP.pgCartObj.cart_subtotal) ; 
                        $('#mobileMenu a[href="#miniCart"] span.quantity').html(PgEP.pgCartObj.cart_subtotal) ;



                    //  NOW :  Check if another Cart Widget is on the page and do same as in main cart 
                    if ( $('.cartWidget.cartBox') !== undefined ) {

                    }

                        
                    /*
                    END => function addCart 

                    */

        }   //   >>>>> END OF addCart  FUNCTION   <<<<<<<<<<<<<<<<<<<




        //  FUNCTION TO REMOVE ITEM FROM CART  >>>>>>>>>>>>>>>>>>>>
        const rmvCartItem = function ( itmSerial , prodObj , cartObj   ) {


            // Get index produc-item data from array
                        
                // Update Cart Summaries
                    //  cart_last_edit : 0 , (time)
                    //  cart_last_sync : 0 , (time)
                    //  cart_checkedOut : 0 ( time)
                    //  cart_subtotal : 0 , (prod_data) >>> DISPLAYED 

                // Remove Parent Prod-item from cart.cart_pr_items

                // Save the Updated Cart Object
                        // Serialize
                        // Save  { break-off and Alert if Save fails : <else> Continue }


                // Remove Item from DisplayCart

                // Update Cart Summaries on DisplayCart
                            // Cart-Subtotal
                            // Cart data- parameters

                // Update Cart Notification Icon

                // Alert Success an Summaries + Promt ( 'Go To Checkout' || 'Continue Shopping' ) 
                            // 'Go To Checkout' >> Open Checkou Options Modal
                            // 'Continue Shopping' >> TOast (How to View and Manage Cart )
                
                        
                // remove the item 
                ctmar.splice (ix, 1) ;
                // recalculate cart totals
                let resetCartVal =  CartData['cart_subtotal'] - tm.item_sub_value ; 
                CartData['cart_subtotal'] = resetCartVal ; 
                // Readjust the pgEP Objec
                    // cart_pr_items : remove this one 
                    PgEP.pgCartObj.cart_pr_items.splice(ix , 1 ) ;
                    // cart_subtotal : deduct the value ,
                    PgEP.pgCartObj.cart_subtotal = resetCartVal ;

                // remove the item from the displayed carts 
                $(`.cartBox .itemBox[data-item-prid='${tm.item_pr_id}']`).remove() ;
                // Readjust cart data attributes  >>>   Do it in the final close, entirely from newly set variables ( after new addition ) 


                // Update Cart Object 
                // Update Cart Summaries
                    //  cart_last_edit : 0 , (time)
                    
                    //  cart_subtotal : 0 , (prod_data) >>> DISPLAYED 




        }  //   END  --  FUNCTION  >> TO remove item from Cart  >>>>>>>>>>>>









        //  FUNCTION TO DELETE THE Current Cart , then Open another one with the new-product-item in it 

        const flushCart = function ( cartID , cartProdData = null  ) { 
        
            // Remove Current Cart
                // From Database
                // From Local Storage
                // from Display
                // from PgEP

            // Buld a Fresh Cart

            // Add The Product Item (if any to add)

        
        
        }
        //  END of FUNCTION  >>  flushCart





        //  SWITCH TO CHECKOUT   >>>>>>>>>>>>>>>>>>>>>

        $('#miniCart #miniCart-pay-btn').on ('click' , function (pev) {

            // prep
            pev.preventDefault() ;
            let tg = $(pev.target)
            // define parent
            let pitc = tg.parents('#miniCart') ;

            // select cart box and checkout box
            let cart = $('#cart-box' , pitc) ;
            let chek =  $('#checkout-box' , pitc) ;
            let  walt =  $('#wallet-box' , pitc) ;

            //  Make internal changes
                // ?? >>> Update PgEP cartObject (status)
                // ?? >>>  Update localStoragve Cart (status)

                // Update Checkout Displays
                // Update Wallet Displays


            // remove checkout box from hidding  // fade-out cart box
            $('#cart-box,#walt-box' , pitc).fadeOut( 1400 , function (){ chek.fadeIn(600) ; }) ;

            // Toast Any necessary ALERTS


            } ) ;




            //  SWITCH (RETURN) TO CART     >>>>>>>>>>>>>>>>>>>>>


            $('#miniCart .return-cart').on ('click' , function (pev) {

                // prep
                pev.preventDefault() ;
                let tg = $(pev.target)
                // define parent
                let pitc = tg.parents('#miniCart') ;

                // select cart box and checkout box
                let cart = $('#cart-box' , pitc) ;
                let chek =  $('#checkout-box' , pitc) ;
                let  walt =  $('#wallet-box' , pitc) ;

                //  Make internal changes


                // remove checkout box from hidding  // fade-out cart box
                $('#wallet-box,#checkout-box' , pitc).fadeOut( 1400 , function (){ cart.fadeIn(600) ; }) ;

                // Toast Any necessary ALERTS


                } ) ;





                //  SWITCH  TO WALLETS     >>>>>>>>>>>>>>>>>>>>>


            $('#miniCart .go-wallets').on ('click' , function (pev) {

                // prep
                pev.preventDefault() ;
                let tg = $(pev.target)
                // define parent
                let pitc = tg.parents('#miniCart') ;

                // select cart box and checkout box
                let cart = $('#cart-box' , pitc) ;
                let chek =  $('#checkout-box' , pitc) ;
                let  walt =  $('#wallet-box' , pitc) ;

                //  Make internal changes


                // remove checkout box from hidding  // fade-out cart box
                $('#cart-box,#checkout-box' , pitc).fadeOut( 1400 , function (){ walt.fadeIn(600) ; }) ;

                // Toast Any necessary ALERTS


                } ) ;







                //  SWITCH  TO CHECK-OUT     >>>>>>>>>>>>>>>>>>>>>


            $('#miniCart .go-check').on ('click' , function (pev) {

                // prep
                pev.preventDefault() ;
                let tg = $(pev.target)
                // define parent
                let pitc = tg.parents('#miniCart') ;

                // select cart box and checkout box
                let cart = $('#cart-box' , pitc) ;
                let chek =  $('#checkout-box' , pitc) ;
                let  walt =  $('#wallet-box' , pitc) ;

                //  Make internal changes


                // remove checkout box from hidding  // fade-out cart box
                $('#cart-box,#wallet-box' , pitc).fadeOut( 1400 , function (){ chek.fadeIn(600) ; }) ;

                // Toast Any necessary ALERTS


                } ) ;







                






		// IZIMODAL SUPPORT 

		$(document).on('ready', function (edr) {


            // DISABLE QUANTITY CHANGERS  >>>>>>>>>>>>>>>>>>

            $('.modal-content .cart-plus-minus input').attr('disabled' ,true) ;

//ahmad start
            //  SCROLL PAGE TO LAST POINT BEFORE CLOSING 
                // Get cookie - lastpoint 
                // if not 'undefined' & not null
                    // Scroll window to that point 
                    // unset cookie - lastpoint 





            // INITIALIZE >>>>>>>>>>>>>>>>>>>>>>>>>


            //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            //   >>>>>>>>>>>     MODAL FOR ALL CATEGORY PRODUCTS PEEK        
            //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


            //   >>>>>>>>>>>  SAMPLE  CASE  >>>>>>>>>>>>>>>

            $('#iframeLoadMod').iziModal( 
            { 
                title: 'SEE MORE' ,
                headerColor : '#fa0024',
                width : '90%' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "range-sample-03.html"
            }
            );
            
            $(document).on('closed','#iframeLoadMod' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;


            //   >>>>>>>>>>> CATEGORY - RANGE - 01  >>>>>>>>>>>>>>>

            $('#iframeCategRange-01').iziModal( 
            { 
                title: 'SEE MORE' ,
                headerColor : '#fa0024',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "range-sample-01.html"
            }
            );
            
            $(document).on('closed','#iframeCategRange-01' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;




            //   >>>>>>>>>>> CATEGORY - RANGE - 02  >>>>>>>>>>>>>>>

            $('#iframeCategRange-02').iziModal( 
            { 
                title: 'SEE MORE' ,
                headerColor : '#fa0024',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "range-sample-02.html"
            }
            );
            
            $(document).on('closed','#iframeCategRange-02' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;





            //   >>>>>>>>>>> CATEGORY - RANGE - 03  >>>>>>>>>>>>>>>

            $('#iframeCategRange-03').iziModal( 
            { 
                title: 'SEE MORE' ,
                headerColor : '#fa0024',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "range-sample-03.html"
            }
            );
            
            $(document).on('closed','#iframeCategRange-03' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;




            //   >>>>>>>>>>> CATEGORY - RANGE - 04  >>>>>>>>>>>>>>>

            $('#iframeCategRange-04').iziModal( 
            { 
                title: 'SEE MORE' ,
                headerColor : '#fa0024',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "range-sample-A.html"
            }
            );
            
            $(document).on('closed','#iframeCategRange-04' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;




            //   >>>>>>>>>>> CATEGORY - RANGE - 05  >>>>>>>>>>>>>>>

            $('#iframeCategRange-05').iziModal( 
            { 
                title: 'SEE MORE' ,
                headerColor : '#fa0024',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "range-soup-pots.html"
            }
            );
            
            $(document).on('closed','#iframeCategRange-05' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;










            //  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            







            //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            //   >>>>>>>>>>>     MODAL FOR ALL VTU SYSTEM COMPONENTS PEEK        
            //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


            


            //   >>>>>>>>>>> VTU SYSTEM COMPONENTS - 01  >>>>>>>>>>>>>>>

            $('#iframeVtuSys-01').iziModal( 
            { 
                title: 'MANAGE WALLET' ,
                headerColor : '#55ff55',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "../mobile/home/fund-wallet"
            }
            );
            
            $(document).on('closed','#iframeVtuSys-01' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;




            //   >>>>>>>>>>> VTU SYSTEM COMPONENTS - 02  >>>>>>>>>>>>>>>

            $('#iframeVtuSys-02').iziModal( 
            { 
                title: 'BUY AIRTIME' ,
                headerColor : '#55ff55',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "../mobile/home/buy-airtime"
            }
            );
            
            $(document).on('closed','#iframeVtuSys-02' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;





            //   >>>>>>>>>>> VTU SYSTEM COMPONENTS - 03  >>>>>>>>>>>>>>>

            $('#iframeVtuSys-03').iziModal( 
            { 
                title: 'MOBILE DATA SUB' ,
                headerColor : '#55ff55',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "../mobile/home/buy-data"
            }
            );
            
            $(document).on('closed','#iframeVtuSys-03' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;




            //   >>>>>>>>>>> VTU SYSTEM COMPONENTS - 04  >>>>>>>>>>>>>>>

            $('#iframeVtuSys-04').iziModal( 
            { 
                title: 'CABLE-TV SUB' ,
                headerColor : '#55ff55',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "../mobile/home/cable-tv"
            }
            );
            
            $(document).on('closed','#iframeVtuSys-04' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;




            //   >>>>>>>>>>> VTU SYSTEM COMPONENTS - 05  >>>>>>>>>>>>>>>

            $('#iframeVtuSys-05').iziModal( 
            { 
                title: 'ELECTRICITY RECHARGE' ,
                headerColor : '#55ff55',
                width : '90%' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "../mobile/home/electricity"
            }
            );
            
            $(document).on('closed','#iframeVtuSys-05' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;




            //   >>>>>>>>>>> VTU SYSTEM COMPONENTS - 06  >>>>>>>>>>>>>>>

            $('#iframeVtuSys-06').iziModal( 
            { 
                title: 'EXAMINATION PINS' ,
                headerColor : '#55ff55',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "../mobile/home/exam-pins"
            }
            );
            
            $(document).on('closed','#iframeVtuSys-06' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;




            //   >>>>>>>>>>> VTU SYSTEM COMPONENTS - 07  >>>>>>>>>>>>>>>

            $('#iframeVtuSys-07').iziModal( 
            { 
                title: 'RECHARGE CARD PIN' ,
                headerColor : '#55ff55',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "../mobile/home/recharge-pin"
            }
            );
            
            $(document).on('closed','#iframeVtuSys-07' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;






            //   >>>>>>>>>>> VTU SYSTEM COMPONENTS - 08  >>>>>>>>>>>>>>>

            $('#iframeVtuSys-08').iziModal( 
            { 
                title: 'ACCOUNT OVERVIEW' ,
                headerColor : '#55ff55',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "../mobile/home/account"
            }
            );
            
            $(document).on('closed','#iframeVtuSys-08' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;





            //   >>>>>>>>>>> VTU SYSTEM COMPONENTS - 09  >>>>>>>>>>>>>>>

            $('#iframeVtuSys-09').iziModal( 
            { 
                title: 'ACCOUNT HOME' ,
                headerColor : '#55ff55',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "../mobile/home/homepage"
            }
            );
            
            $(document).on('closed','#iframeVtuSys-09' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 

//ahmad start
                                    // >>>>> ADD THIS SNIPET TO ALL #iframeVtuSys-xx  Modal on 'closed' Handler function 
                                        // var lastState = $(this).attr('data-onopen-state') ;

                                        // if (lasState == 'login') { 

                                                    // check Login 

                                                            // IF LOGIN == true  {
                                                                // Unset cookie - lastpoint
                                                            //}
                                                            // ELSE >>  LOGIN == false   { reload page }
                                        
                                    
                                    
                                        // }
                                        // else {  //  (lastState == 'logout'
                                                    // check Login 
                                                        // IF LOGIN == true  { reload page}
                                                        // ELSE >>  LOGIN == false   {
                                                             // Unset cookie - lastpoint
                                                        //}
                                                    
                                                    
                                        // }

                                       

                                        
    
                                                    } ) ;











            //  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@






            //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            //   >>>>>>>>>>>     MODAL FOR ALL MTR PACKAGES / PROGRAMMES  PEEK        
            //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


            

            //   >>>>>>>>>>> MTR PACKAGES / PROGRAMMES - 01   -   >>>>>>>>>>>>>>>

            $('#iframeMtrPackg-01').iziModal( 
            { 
                title: 'SEE MORE' ,
                headerColor : '#fa0024',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "range-sample-01.html"
            }
            );
            
            $(document).on('closed','#iframeMtrPackg-01' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;




            //   >>>>>>>>>>> MTR PACKAGES / PROGRAMMES - 02    -   >>>>>>>>>>>>>>>

            $('#iframeMtrPackg-02').iziModal( 
            { 
                title: 'SEE MORE' ,
                headerColor : '#fa0024',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "range-sample-02.html"
            }
            );
            
            $(document).on('closed','#iframeMtrPackg-02' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;





            //   >>>>>>>>>>> MTR PACKAGES / PROGRAMMES - 03    -   >>>>>>>>>>>>>>>

            $('#iframeMtrPackg-03').iziModal( 
            { 
                title: 'SEE MORE' ,
                headerColor : '#fa0024',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "range-sample-03.html"
            }
            );
            
            $(document).on('closed','#iframeMtrPackg-03' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;




            //   >>>>>>>>>>> MTR PACKAGES / PROGRAMMES - 04    -   >>>>>>>>>>>>>>>

            $('#iframeMtrPackg-04').iziModal( 
            { 
                title: 'SEE MORE' ,
                headerColor : '#fa0024',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "range-sample-A.html"
            }
            );
            
            $(document).on('closed','#iframeMtrPackg-04' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;




            //   >>>>>>>>>>> MTR PACKAGES / PROGRAMMES - 05    -   >>>>>>>>>>>>>>>

            $('#iframeMtrPackg-05').iziModal( 
            { 
                title: 'SEE MORE' ,
                headerColor : '#fa0024',
                width : '350px' ,
                iconColor: '#ed3237b2' ,
            
                fullscreen : true ,
                //restoreDefaultContent : true ,

                iframe: true, 
                iframeHeight: 800,
               iframeURL: "range-soup-pots.html"
            }
            );
            
            $(document).on('closed','#iframeMtrPackg-05' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;










            //  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@





            //  THE MODAL OPENENR >>>>>>>>>>>>>>>>

            $('.seeIframe-mod').on ('click' , function(e){


                e.preventDefault();
                let t = e.target ;
                let tg = $(t) ;
                let addr = tg.attr('href') ;
                var modMak  =  tg.attr('data-linkMod') ;
                // Get the current position of the body
                bdTop = $(window).scrollTop () ;
                //  pass the data on the modal and show 
                $(modMak).attr('data-lastP' , bdTop ) ;
            
                $(modMak).iziModal('open'); 
//ahmad start

                //  IF >>> $(modMak) is one of those needing page refresh  >> VTUsys Modals 
                    // Check Login
                    // IF LOGIN === true
                        // set data-onopen-state = 'login'

                        // set cookie - lastpoint = bdTop = $(window).scrollTop () ;

                    // ELSE  >>>   LOGIN === false
                        // set data-onopen-state = 'logout'


                        // set cookie - lastpoint = bdTop = $(window).scrollTop () ;



                // ELSE 
                    // Do nothing


            
                $(`${modMak} .iziModal-wrap`).animate({scrollTop:0}, 800);



            }) ;



            


            //  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@




            
            // SEARCH LOAD MODAL  modal init
            $('#search-loadMod').iziModal(
                {

                    title: 'PRODUCT SEARCH RANGE' ,
                    headerColor : '#55ff55',
                    width : '790px' ,
                    iconColor: '#ed3237b2' ,

                    top: '3%' ,
                    bottom :'30%' ,
                    
                    fullscreen : true ,

                    afterRender: function(){

                    

                        // CUSTOMIZE THE MODAL CONTENTS 





                        //  ***NOTE**** BEST TO PUT ALL METADATA AS AN ARRAY OF OBJECTS HERE
                        
                        // var metObj = { var_pr_id:'$name-x' , var_price : 1000 } ;

                        
                        /*----------------------------------------*/
                        /*  QTY Button
                        /*----------------------------------------
                        $('.cart-plus-minus', '#search-loadMod').append(
                            '<div class="dec qtybutton"><i class="fa fa-minus"></i></div><div class="inc qtybutton"><i class="fa fa-plus"></i></div>'
                        );
                        */

                        // Set the value in Subtotal  :
                        var svi = $('input.item-subtotal', '#search-loadMod') ;

                        svi.map(function(ix, el ){
                            let pbx = $(el).parents('.variant-item') ;
                            let qt = $('.cart-plus-minus-box' , pbx).val() ;
                            
                            // let upr =  JSON.parse( pbx.attr('data-var-itemMeta')).var_price ;
                            let upr =  pbx.attr('data-varPrice') ;

                        // console.log (pbx.attr('class')) ;

                            $(el).val(qt*upr) ;       

                        } ) ;
                                                
                            // Set the value in Quantities To CART-QUANTITIES ***LATER***  :
                            /*
                            
                            */

                            // Change QUANTITY  PLUS  Recalculate SUBTOTAL when  -EVENT- Quantity changed:

                        $('.qtybutton', '#search-loadMod').on('click', function () {
                            var $button = $(this);
                            var oldValue = $button.parent().find('input').val();
                            if ($button.hasClass('inc')) {
                                var newVal = parseFloat(oldValue) + 1;
                            } else {
                                // Don't allow decrementing below zero
                                if (oldValue > 1) {
                                    var newVal = parseFloat(oldValue) - 1;
                                } else {
                                    newVal = 1;
                                }
                            }
                            $button.parent().find('input').val(newVal);


                            // Recalculate SUB-TOTAL  : when  -EVENT- Quantity changed:
                            let pbx = $button.parents('.variant-item') ;

                            let upr =  pbx.attr('data-varPrice') ;

                            $('input.item-subtotal',pbx).val(newVal*upr) ;
                        


                        });
                            



                
                        // Set ADD-TO-CART  -EVENT- :

                        $('.prod-cart-add', '#search-loadMod').on('click', function (aev) {
                        

                            aev.preventDefault();
                            let t = aev.target ;
                            let tg = $(t) ; 
                            let pitm = tg.parents('div.variant-item') ;

                            

                            // Fetch ItemID , Qnty
                            let CtData = {} ; 
                            CtData.itmID = pitm.attr('data-varID') ;  // sku instead
                            CtData.itmQty = $('li.quantity input' , pitm).val() ;
                            CtData.itmUnPrice = pitm.attr('data-varPrice') ;
                            CtData.itmData = JSON.parse(pitm.attr('data-var-itemMeta')) ;


                            //  Open Up Necessary Objects 
                                // Cart Object
                                let ctD = PgEP.cartObj  ;

                                // Produc-Item Data
                                let prD = CtData



                            // check if item already in cart  << FOR NOW REMOVE IT AND ,  ALTERNATIVE IS TO CHANGE TO ADD THEM UP  >>
                            let existB4 = 0 ;
                                CtD['cart_pr_items'].array.forEach( function(tm , ix , ctmar) {

                                    if (tm.item_pr_id  == prD.itmID ) {

                                        //   <<<< IN UPDATE : PROMPT TO CONFIRM IF TO REMOVE OR OVER-WRITE   >>>>
                                        // remove the item
                                        ctmar.splice (ix, 1) ;
                                        // recalculate cart totals
                                        let resetCartVal =  CtD['cart_subtotal'] - tm.item_sub_value ; 
                                        CtD['cart_subtotal'] = resetCartVal ; 
                                        // Readjust the pgEP Objec
                                            // cart_pr_items : remove this one 
                                            PgEP.pgCartObj.cart_pr_items.splice(ix , 1 ) ;
                                            // cart_subtotal : deduct the value ,
                                            PgEP.pgCartObj.cart_subtotal = resetCartVal ;

                                        // remove the item from the displayed carts 
                                        $(`.cartBox .itemBox[data-item-prid='${tm.item_pr_id}']`).remove() ;
                                        // Readjust cart data attributes  >>>   Do it in the final close, entirely from newly set variables ( after new addition )

                                        // incr the existB4'
                                        existB4++ ;

                                        // Inform The User 
                                        iziToast.info({
                                                                id: 'existB4',
                                                                zindex: 9999,
                                                                timeout: 5000,
                                                                title: 'DUPLICATE ITEM :',
                                                                overlay: true,
                                                                message: 'This same product has earlier been included in your Cart. <br> The old item will be replaced with your latest addition.',
                                                                position: 'center'
                                                                });
                                    } // END IF  :: existB4

                                }); // END LOOP through product items

                                if (existB4 == 0 ) {
                                    // Item does not Previously exist
                                     // Inform The User 
                                     iziToast.info({
                                                                id: 'noexistB4',
                                                                zindex: 9999,
                                                                timeout: 3000,
                                                                title: 'ADDING ITEM TO CART... ',
                                                                overlay: true,
                                                                message: 'The Item is being added to your Cart. <br> Please Wait...',
                                                                position: 'center'
                                                                });


                                    //   >>>>>>>>>>>>>> WE CAN NOW PROCEED TO ADD THE NEW ITEM  IF CART NOT CHECKED OUT  >>>>>>>>>>>


                                      // Check if Cart is  checked-out ? pop Toast to notify "not possible" + how to proceed : cando = 1 (can continue)

                                                //  UPGRADES  :  Allow a fresh cart to be created and accessible after completing pending order.
                                                //  UPGRADES  :  Allow SIMULTANEOUS MULTIPLE CARTS for same user 

                                      let cando = 0 ;
                                       if(PgEP.pgCartObj['cart_checkedOut'] !== 0 ) {
                                        cando = 0 ;
                                            // pop warning : Can not be done 

                                             // COMPLETE or CANCEL Pending Order ?
                                             iziToast.warning({
                                                        timeout: 6000,
                                                        overlay: true,
                                                        displayMode: 1,
                                                        id: 'nocando',
                                                        zindex: 999,
                                                        title: 'Sorry ! That CAN NOT Work.',
                                                        message: 'An Item can no longer be added to the Cart. <br> <strong>REASON :</strong>  Items can neither be ADDED nor CHANGED in the Cart after Checking Out the Cart.<br> To make your request for that item, you may have to create a fresh Request. <br> But first you will need to either COMPLETE or CANCEL the Pending Order that you started checking out earlier . ',
                                                        position: 'center',
                                                        drag: false,

                                                        inputs: [
                                                                
                                                        ] ,


                                                        buttons: [

                                                                ['<button><b>COMPLETE Pending Order</b></button>', function (instance, toast, button, e, inputs) {
                                                                    
                                                                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                                                    iziToast.success({
                                                                    id: 'dopending',
                                                                    zindex: 9999,
                                                                    timeout: 3000,
                                                                    title: 'OK,COMPLETING The Pending Order:',
                                                                    overlay: true,
                                                                    message: 'Please Open the Cart to to finish the Chekout Process you started earlier. <br> You can return to placing your order for the new item after completing the Pending Order <br> Thank you.',
                                                                    position: 'topLeft'
                                                                    });

                                                                    // UPGRADES  :  Save the Requested product-item data in sessionStorage , and add it to cart automatically after the pending order is completed
                                                                    // UPGRADES :  Effect automatic openeing of Checkout Modal 


                                                                    }, false],


                                                                ['<button><b>CANCEL Pending Order</b></button>', function (instance, toast, button, e, inputs) {

                                                                

                                                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                                                iziToast.info({
                                                                id: 'droppending',
                                                                zindex: 9999,
                                                                timeout: 8000,
                                                                title: 'CANCELING Pending Order ...',
                                                                overlay: true,
                                                                message: 'ALL the items in the Order will be deleted and the Order Cart will be emptied. <br> <strong> Please note that the move is IRREVERSIBLE.</strong> <br> To do this : <br> Pleasse use the "Cancel Order" button , then you may go ahead to add the New Request , as well as any other desired requests.<br> Thank you.',
                                                                position: 'topLeft'
                                                                });
                                                                
                                                                //  >>>>>>>>   THIS IS FOR THE UPGRADES    <<<<<<<<<

                                                                // MAKE ALL THE MOVES TO DELETE THE Current Cart , then Open another one with the new-product-item in it 
                                                                    // Invoke the Method to flush the Cart with new product
                                                                    
                                                                   /*
                                                                    flushCart ( ctD['cart_id'] , prD   ) ;


                                                                    // Pop A Toast To Indicate Successful deletion 
                                                                    iziToast.success({
                                                                        id: 'success',
                                                                        zindex: 9999,
                                                                        timeout: 3000,
                                                                        title: 'Old Order OUT, New Request IN ...',
                                                                        overlay: true,
                                                                        message: 'The pending Order has been deleted PERMANENTLY. <br> The Item you requested has been set into your Fresh New Cart.<br> Thank You.',
                                                                        position: 'topLeft'
                                                                        });
                                                                    */

                                                        }, false], 

                                                                

                                                        ],


                                                });

                                           
                                       }
                                       else {
                                            cando = 1 ;
                                        //Continue
                                            // Prompt to confirm 

                                            // Add the Product Item
                                            // Invove the addCart Method
                                            addCart( prD , ctD) ;


                                            // Alert Success an Summaries + Promt ( 'Go To Checkout' || 'Continue Shopping' ) 
                                                    // 'Go To Checkout' >> Open Checkou Options Modal
                                                    // 'Continue Shopping' >> TOast (How to View and Manage Cart )
                                                     
                                                    iziToast.info({
                                                        timeout: 8500,
                                                        overlay: true,
                                                        displayMode: 1,
                                                        id: 'inputs',
                                                        zindex: 999,
                                                        title: 'ITEM SUCCESSFULLY ADDED',
                                                        message: 'The Item Has been SUCCESSFULLY ADDED to your Cart <br> What would you like to do next ? ',
                                                        position: 'center',
                                                        drag: false,

                                                        inputs: [
                                                                
                                                        ] ,


                                                        buttons: [
                                                                ['<button><b>Go To CHECK-OUT</b></button>', function (instance, toast, button, e, inputs) {

                                                                

                                                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                                               // Redirect or Open Modal for Checkout


                                                        }, false], 

                                                                ['<button><b>Continue Shopping</b></button>', function (instance, toast, button, e, inputs) {
                                                                    
                                                                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                                                    iziToast.success({
                                                                    id: 'success',
                                                                    zindex: 9999,
                                                                    timeout: 3000,
                                                                    title: 'OK, Happy SHopping !',
                                                                    overlay: true,
                                                                    message: 'There is much more to get. We are here for YOU !!',
                                                                    position: 'topLeft'
                                                                    });


                                                                    }, false],

                                                        ],


                                                });

                                

                                             

                                       }  //  END ELSE :: cando = 1





                                }


                           


                                            // >>>>>>>>>> LATER VERSION   <<<<<<<<<<<<<
                                                // Set Request Data                                          
                                                // Make Ajax call
                                                // Toast on Success  >> Then Ask If : @:Open Cart ||  @:Open Checkout  || @:Continue
                                                // OR Alert on Failure

                        } ) ;   //  END of AddCart Click Handler      
                                

                                


                        //  REMOVE ITEM FROM CART - EVENT

                        $('.product-item_remove').on('çlick', function(rtev){

                            // Track Button and the Parent cartr-prod-item
                            rtev.preventDefault();
                            let t = rtev.target ;
                            let tg = $(t) ; 

                            let pitm = tg.parents('.itemBox') ;
                                // Get Product-items serial  (to locate in cart-obj prod_items array)
                                let tsn = pitm.attr('data-item_serial') ;                                    
                                // Extract the Product Item Meta Object
                                let prObj = JSON.parse( pitm.attr('data-item_meta'))
                                
                                // Open up Cart Data Object
                                let prCartObj = PgEP.pgCartObj ;




                        






                                // Check if Cart is  checked-out ? pop Toast to notify "not possible" + how to proceed : cando = 1 (can continue)
                                let cando = 0 ;
                                if(PgEP.pgCartObj['cart_checkedOut'] !== 0 ) {
                                cando = 0 ;
                                    // pop warning : Can not be done 
                                    iziToast.info({
                                                        id: 'candonot',
                                                        zindex: 9999,
                                                        timeout: 5000,
                                                        title: 'YOU CAN NOT DELETE',
                                                        overlay: true,
                                                        message: 'Sorry!  - This Item can no longer be deleted from the Cart. <br> <strong>REASON :</strong>  Items can neither be DELETED nor CHANGED from the Cart after Checking Out the Cart.<br> To cancel your request for that item, you may have to delete the whole Order.',
                                                        position: 'center'
                                                        });


                                }
                                else {
                                    cando = 1 ;
                                //Continue
                                    // Prompt to confirm 

                                        // Toast ?Are you sure ?
                                        iziToast.warning({
                                                timeout: 6000,
                                                overlay: true,
                                                displayMode: 1,
                                                id: 'inputs',
                                                zindex: 999,
                                                title: 'Are You Sure?',
                                                message: 'Do you really wish to Permanently DELETE this product from your Cart ? <br> The action is IRREVERSIBLE. ',
                                                position: 'center',
                                                drag: false,

                                                inputs: [
                                                        
                                                ] ,


                                                buttons: [
                                                        ['<button><b>Yes, DELETE It.</b></button>', function (instance, toast, button, e, inputs) {

                                                        

                                                        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                                        iziToast.info({
                                                        id: 'success',
                                                        zindex: 9999,
                                                        timeout: 3000,
                                                        title: 'OK, DELETING Cart item ...',
                                                        overlay: true,
                                                        message: 'This Item will no longer be included in your Order again.',
                                                        position: 'topLeft'
                                                        });

                                                        // MAKE ALL THE MOVES TO DELETE THE ITEM HERE 
                                                            // Invoke the Method to delete the Cart Item 
                                                            rmvCartItem ( tsn , prObj , prCartObj   ) ;


                                                            // Pop A Toast To Indicate Successful deletion 
                                                            iziToast.success({
                                                                id: 'success',
                                                                zindex: 9999,
                                                                timeout: 3000,
                                                                title: 'Item Successfully Deleted',
                                                                overlay: true,
                                                                message: 'The Item has been permanently Deleted from your Cart.',
                                                                position: 'topLeft'
                                                                });


                                                }, false], 

                                                        ['<button><b>Oh... NO!</b></button>', function (instance, toast, button, e, inputs) {
                                                            
                                                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                                            iziToast.success({
                                                            id: 'success',
                                                            zindex: 9999,
                                                            timeout: 3000,
                                                            title: 'OK, Retaining Cart Item:',
                                                            overlay: true,
                                                            message: 'The Item will remain in your Cart and Included in your Order .',
                                                            position: 'topLeft'
                                                            });


                                                            }, false],

                                                ],


                                        });



                                }  //  END ELSE :: cando = 1


                                



                        } ) ;
                            
                            

                                    
                                         

                                      

                                        



                        //  CHANGE ITEM IN CART

                        // CANCEL CART

                        // SUBMIT REQUEST FUNCTION


                        //  CHECKOUT CART



                        
                            

                            


                        
                            

                        





                    }
                }
            );

                    
            $(document).on('closed','#search-loadMod' , function(e){ e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 

                                                    } ) ;

            $(document).on('opened', '#search-loadMod', function (e) {

           

                // CUSTOMIZE THE MODAL SHELL
                
                //>>>>>>>>>>  $('.varMod-header h4.varMod-title' , $(this) ).html(`${ $('#prDetailModal').attr('data-prName')}`)



                // CUSTOMIZE THE MODAL CONTENTS 


                                                });







            
            $(document).on('click', '.seeMod-searchLoad', function (e) {
                    
                    e.preventDefault();
                    let t = e.target ;
                    let tg = $(t) ; 
                    let tprnt = tg.parents('.goFind') ;

                    let mk = tprnt.attr('data-searchMarker') ;
                    let catg = tprnt.attr('data-categ') ;
                    

                    // console.log(mk + '   ' + gosxn)

                    // MODAL MARKER
                    
                        var modMak  =  tg.attr('data-linkMod') ;
        
                    // Get the current position of the body
                    bdTop = $(window).scrollTop () ;
                    //  pass the data on the modal and show 
                    $(modMak).attr('data-lastP' , bdTop ) ;
                
                        //console.log($(this).attr('href'))
                            

                            // Open Modal and Scroll it up
                        //  console.log (tg) ;
                    $(modMak).iziModal('open'); 
                        // Set in The Ajax content 
                    //   $("#sxn-loadMod .iziModal-content").load(`kwabaz-frm-pageHelper-01.php?loadsxn=${$(this).attr('href')}`) ;
                    
                    $(`${modMak} .iziModal-wrap`).animate({scrollTop:0}, 800);



                    //  LOAD PRELIMINARY SEARCH


                    var goData = { } ;

                    // sba
                    goData['sba'] = 'Open-Slot';  // THE CASE FOR SBA MANIFEST 

                    // $acslev 
                    goData['acslev'] = 0 ;

                    // $pglim   
                    goData['pglim'] = 48 ;

                    // $categ  Get Categ into goData  .findCateg
                    if ( $('.findCateg' , tprnt).val() !== undefined &&  $('.findCateg' , tprnt).val() !== '' )
                    {
                        goData['categ'] = $('.findCateg' , tprnt).val()
                    }
                    else {
                        goData['categ'] = catg ;
                    }

                    // $expr  Get Search Term goData  .findTerm
                    if ( $('.findTerm' , tprnt).val() === undefined ) 
                    {

                     goData['expr'] = ' ' ;

                    }
                    else{
                        
                         goData['expr'] =  ( $('.findTerm' , tprnt).val().trim() !== '' ) ? $('.findTerm' , tprnt).val().trim() : ' ' ;
                    }



                    // Make AJAX Call
                    $.ajax({
                            type: 'post',
                            url : 'remd-manifest-helper.php?move=searchProd'  ,
                            data : {batch: JSON.stringify( goData)},
                            
                            dataType : 'json',
                            beforeSend : function(x){if (x && x.overrideMimeType) {
                                x.overrideMimeType('application/json; charset= utf-8') ;
                                                        }
                                        } ,
                                        // SUCCESS
                            success : function(resData , stat , xhr) {

                              //  console.log(resData) ;

                                // THE WHOLE PACKET 
                                var pkt = resData ;
                                // ['status''=>
                                var repot = pkt['status'] ;
                                // 'data'=>
                                var pkData = pkt['data'] ;
                                // 'count''=>
                                var itmN = pkt['count'] ;
                                // 'pgnum''=>
                                var pgN = pkt['pgnum'] ;

                                var more = pkt['qry']

                                // Check Data NOT Empty 
                                if(itmN >= 1) {
                                    // Keep the packet
                                    $('#pgStore').html(JSON.stringify( pkt)) ;


                                    // prep old page for removal
                        $( `${modMak} .grabLoad .displayed.current-page`).addClass('abdicate').addClass(`abdicated-pg-${$(`${modMak} .grabLoad .displayed.current-page`).attr('data-pgNum')}`) ;

                        $(`${modMak} .grabLoad .displayed.current-page`).removeClass('current-page') ;


                                    //  set the first Page in place
                                    var bchN = pkData[0] ;
                                    var pg1 = 1 ;
                                        // call  loadRange = function (bnch , cont ) 
                                    loadRange(bchN , pg1 , `${modMak} .grabLoad`)

                                    // Replace The Pagination  >> determined by pgN
                                            // Empty the current Pagination
                                            $('.current-page .pagin.pgtop ').html('') ;
                                            $('.current-page .pagin.pgbtm ').html('') ;

                                    for (let index = 0; index <= pgN -1 ; index++) {
                                        // Append a Page link Set to both top and bottom
                                        $('.current-page .pagin.pgtop ').append(`<span class="pg-lk" data-pgx="${index+1}"> ${index+1} </span>|`) ;
                                        $('.current-page .pagin.pgbtm ').append(`<span class="pg-lk" data-pgx="${index+1}"> ${index+1} </span>|`) ;
                                        
                                    }

                                    // Set First Page as Active 
                                    $(`.pg-lk[data-pgx="1"]`).addClass('activePg') ;


                                    // Mark the Search Display with the search category

                                    $( `${modMak} form.header-searchbox.goFind`).attr ('data-categ' , goData['categ'] ) ;

                                    // Alert Number of Products and Number of Pages 

                                    iziToast.success({
                                                        id: 'success',
                                                        zindex: 9999,
                                                        timeout: 3000,
                                                        title: 'SEARCH SUCCESSFUL : ',
                                                        overlay: true,
                                                        position: 'center',
                                                        message: `Items Found : ${itmN}  ; <br>Arranged in ${pgN} Pages. <br><br> ${more} `
                                                        });


                                }
                                else{
                                    // Just Alert that result was not found
                                    
                                iziToast.info({
                                                timeout: 6000,
                                                overlay: true,
                                                displayMode: 1,
                                                id: 'inputs',
                                                zindex: 999,
                                                title: 'NO ITEM TO DISPLAY :',
                                                message: `${repot}`,
                                                position: 'center',
                                                drag: false,

                                                inputs: [
                                                        
                                                ] ,


                                                buttons: [
                                                        ['<button><b>Try Again</b></button>', function (instance, toast, button, e, inputs) {

                                                        

                                                        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                                        iziToast.success({
                                                        id: 'success',
                                                        zindex: 9999,
                                                        timeout: 3000,
                                                        title: 'Trying Again? ',
                                                        overlay: true,
                                                        message: 'Hint : Make sure you spell correctly'
                                                        });

                                                        // Scroll to the Search Bar
                                                        $('html ,body'). animate ({ scrollTop :  0} , 1500) ;


                                                }, false], 

                                                        ['<button><b>OK Then</b></button>', function (instance, toast, button, e, inputs) {
                                                            
                                                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                                            iziToast.success({
                                                            id: 'success',
                                                            zindex: 9999,
                                                            timeout: 3000,
                                                            title: 'Leaving The Search? ',
                                                            overlay: true,
                                                            message: 'What You are looking for could be here still. It May be in another Category.',
                                                            position: 'topLeft'
                                                            });

                                                            

                                                            }, false],

                                                ],


                                        });
                                }
                            } ,
                                        

                                        // ERROR
                            error : function(xr , sts , er) {

                                // Alert there was an error

                                iziToast.error({
                                        title: 'Oops! Error :',
                                        position: 'center',
                                        message: 'We encountered an Error while running Your search. <br> Please adjust your input.'
                                    });

                                    console.log (sts + ' -##- '  + er  + JSON.stringify( goData)) ;

                            }

                    }) ;




                        
            });

                





            //  VTU-SYS  WINDOW NODAL    Modal Init:
        $("#vtuSysMod").iziModal(
                            { 
                            title: 'AREA BAZAAR BILLS & SUBSCRIPTIONS' ,
                            headerColor : '#55ff55',
                            //width : '90%' ,
                            iconColor: '#ed3237b2' ,
                        
                            fullscreen : true ,
                            //restoreDefaultContent : true ,

                            iframe: true, 
                            iframeHeight: 780,
                            iframeURL: "../mobile/home/fund-wallet"
                            }
                        );

        $(document).on('closed','#vtuSysMod' , function(e){  e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 

                                                    } ) ;





            // REGISTRATION FORM IFRAME MODAL
            $('#custmRegMod').iziModal({
                iframe: true,
                iframeHeight: 800,
                iframeURL: "https://docs.google.com/forms/d/e/1FAIpQLSfVW5efA7j1838k1VA1YVDgMJATmAbE0cZlFC3OzCuz-GTcaQ/viewform?embedded=true"
            });
            /**  <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfVW5efA7j1838k1VA1YVDgMJATmAbE0cZlFC3OzCuz-GTcaQ/viewform?embedded=true" width="640" height="3570" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe> 
            * **/
            $(document).on('closed','#custmRegMod' , function(e){  e.preventDefault ();
                                                var lastP = $(this).attr('data-lastP') ;                                   
                                                $('html,body').animate({scrollTop : lastP} , 1500); 

                                                            } ) ;



            // SECTION AJAX MODAL modal unit
            $('#sxn-loadMod').iziModal( 
                { 
                    title: 'PRODUCT RANGE' ,
                    headerColor : '#55ff55',
                    width : '90%' ,
                    iconColor: '#ed3237b2' ,
                   
                    fullscreen : true ,
                    restoreDefaultContent : true 
                } 
            );

            $(document).on('closed','#sxn-loadMod' , function(e){ e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 

                                                    } ) ;



            // PHOT-LOAD AJAX MODAL modal unit
            $('#photo-loadMod').iziModal( 
                { 
                    title: 'IMAGE CLOSE VIEW' ,
                    headerColor : '#ed3237b2',
                    width : '600px' ,
                    top: '10%' ,
                    bottom: '15%' ,
                    zindex: '1200' ,
                   
                    fullscreen : false ,
                    timeout : '9500' ,
                    tomeoutProgressbar : true ,
                    pauseOnHover: true,
                    timeoutProgressbarColor: 'rgba(0,0,0)',
                    restoreDefaultContent : true 
                } 
            );

            $(document).on('closed','#photo-loadMod' , function(e){ e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 

                                                    } ) ;   




            // PRODUCT DETAIL MODAL test card modal init
            $('#prDetailModal').iziModal(
                {

                    title: 'PRODUCT DETAILS' ,
                    headerColor : '#55ff55',
                    width : '790px' ,
                    iconColor: '#ed3237b2' ,

                    top: '3%' ,
                    bottom :'30%' ,
                    
                    fullscreen : true ,

                    afterRender: function(){

                    

                        // CUSTOMIZE THE MODAL CONTENTS 





                        //  ***NOTE**** BEST TO PUT ALL METADATA AS AN ARRAY OF OBJECTS HERE
                        
                        // var metObj = { var_pr_id:'$name-x' , var_price : 1000 } ;

                        
                        /*----------------------------------------*/
                        /*  QTY Button
                        /*----------------------------------------*/
                        $('.cart-plus-minus', '#prDetailModal').append(
                            '<div class="dec qtybutton"><i class="fa fa-minus"></i></div><div class="inc qtybutton"><i class="fa fa-plus"></i></div>'
                        );

                        // Set the value in Subtotal  :
                        var svi = $('input.item-subtotal', '#prDetailModal') ;

                        svi.map(function(ix, el ){
                            let pbx = $(el).parents('.variant-item') ;
                            let qt = $('.cart-plus-minus-box' , pbx).val() ;
                            
                            // let upr =  JSON.parse( pbx.attr('data-var-itemMeta')).var_price ;
                            let upr =  pbx.attr('data-varPrice') ;

                        // console.log (pbx.attr('class')) ;

                            $(el).val(qt*upr) ;       

                        } ) ;
                                                
                            // Set the value in Quantities To CART-QUANTITIES ***LATER***  :
                            /*
                            
                            */

                            // Change QUANTITY  PLUS  Recalculate SUBTOTAL when  -EVENT- Quantity changed:

                        $('.qtybutton', '#prDetailModal').on('click', function () {
                            var $button = $(this);
                            var oldValue = $button.parent().find('input').val();
                            if ($button.hasClass('inc')) {
                                var newVal = parseFloat(oldValue) + 1;
                            } else {
                                // Don't allow decrementing below zero
                                if (oldValue > 1) {
                                    var newVal = parseFloat(oldValue) - 1;
                                } else {
                                    newVal = 1;
                                }
                            }
                            $button.parent().find('input').val(newVal);


                            // Recalculate SUB-TOTAL  : when  -EVENT- Quantity changed:
                            let pbx = $button.parents('.variant-item') ;

                            let upr =  pbx.attr('data-varPrice') ;

                            $('input.item-subtotal',pbx).val(newVal*upr) ;
                        


                        });
                            




                        // Set ADD-TO-CART  -EVENT- :

                        $('.prod-cart-add', '#prDetailModal').on('click', function (aev) {
                        

                            aev.preventDefault();
                            let t = aev.target ;
                            let tg = $(t) ; 
                            let pitm = tg.parents('div.variant-item') ;

                            // Fetch ItemID , Qnty
                            let CtData = {} ; 

                            if ( pitm.attr('data-itemMeta')!== undefined &&  pitm.attr('data-itemMeta')!== '' )
                            {
                                CtData.itmData = JSON.parse(pitm.attr('data-itemMeta')) ; // an Object with Pr Data from the Database
                                    // Map Out The Parameters 
                                        
                                        // title
                                        // sku
                                        // unit price
                                        // Photo Link
                            }
                            else{

                                        // Item Title
                                    CtData.itmTitle = $('a.product-name' , pitm).html() ;
                                        // Item SKU
                                    CtData.itmID = pitm.attr('data-varID') ;  // sku instead
                                        // Unit Price
                                    CtData.itmUnPrice = pitm.attr('data-varPrice') ;

                                        // Photo Link
                                    CtData.itmPhtLink = $('img.img-full' , pitm).attr('src') ;

                            }
                                


                                // Item Quantity
                            CtData.itmQty = $('li.quantity input' , pitm).val() ;
                                
                                // Item Sub Value
                            CtData.subVal = $('input.item-subtotal' , pitm).val() ;

                            
                            

                             /*
                            function addCart ( prCartData , CartMeta  )
                            {
                            */




                            // Mark the Time 


                           //  Prep AddCart Product Data [prCartData] 
                                    // item_name  //  >>> DISPLAYED
                                    // item_photoLink  //  >>> DISPLAYED

                                                                                                                                        
                                    // item_pr_sku :'' ,  //  >>> DISPLAYED

                                    // item_pr_unit_price : 0 ,  //  >>> DISPLAYED

                                    // item_pr_quantity : 0 ,  //  >>> DISPLAYED
                                    // item_sub_value : 0 ,  //  >>> DISPLAYED

                                    // item_added :0  (time)


                                    // item_last_edit :0 ,
                                    // item_removed :0 ,
                                    // item_checkedout : 0 ,
                                    // item_payed : 0 ,

                           
                            
                           //  Get Cart Object  PgEP.pgCartObj / getPageCart ()

                                // check cart status  :  cartBox.attr('data-cart-status')

                                // check if item already in cart  : JSON.parse(cartBox.attr('data-cart-meta'))['items'][ix]['itmID']

                           

                           // Update Cart Object 
                                // Update Cart Summaries
                                    //  cart_last_edit : 0 , (time)
                                    //  cart_last_sync : 0 , (time)
                                    //  cart_checkedOut : 0 ( time)
                                    //  cart_subtotal : 0 , (prod_data) >>> DISPLAYED 

                                // Add [prod-Data] to cart.cart_pr_items

                            // Save the Updated Cart Object
                                     // Serialize
                                     // Save  { break-off and Alert if Save fails : <else> Continue }


                            // Add [prCartData] to DisplayCart

                                // clone cart-item template

                                // fill in cloned cart-item template
                                    // item serial   itemBox.attr('data-item-serial') =  cartBox.attr('data-cart-count') + 1
                                    // item meta    itemBox.attr('data-item-meta') = JSON.stringify(CtData.itmData )
                                    // item title  : 'a.pTitle'  =  CtData.itmData.pTitle
                                    // item sku  : 'span.product-item_sku'  ,  itemBox.attr('data-item-sku') =  CtData.itmID
                                    // item photo  : $('img.img-full' , itemBox).attr('src') =  CtData.itmData.photoLink
                                    // item quantity  : 'span.product-item_qnty'  
                                    // item unit-price  : 'span.product-item_unitPrice'  ,  itemBox.attr('data-item-price')
                                    // item value   : 'span.subVal'  <calc>
                                
                                // Append Item   container = $('ul.minicart-list' , cartBox )
                                     

                            // Update Cart Summaries on DisplayCart
                                        // Cart-Subtotal
                                        // Cart data- parameters

                            // Update Cart Notification Icon

                            // Alert Success an Summaries + Promt ( 'Go To Checkout' || 'Continue Shopping' ) 
                                        // 'Go To Checkout' >> Open Checkou Options Modal
                                        // 'Continue Shopping' >> TOast (How to View and Manage Cart )

                            // END >>>>>>>>>>

                    

                        

                            // Add to page cart  $('.minicart-content')
                                
                                // Append Item   container = $('ul.minicart-list' , cartBox )

                                // Update Cart summary
                                    // cart-subtotal  :  data-cart-subtotal  ,  data-cart-total , $('span.cart-total-val').html()
                                    // cart-count  :  data-cart-count  ,
                                    // cart meta  :
                                    // cart notification icon :  $('a#miniCart span.quantity').html()


                                    


                                    // >>>>>>>>>> LATER VERSION   <<<<<<<<<<<<<
                                        // Set Request Data                                          
                                        // Make Ajax call
                                        // Toast on Success  >> Then Ask If : @:Open Cart ||  @:Open Checkout  || @:Continue
                                        // OR Alert on Failure


                                

                                // >>>>>>>>>>>>>>>>>>>>    SUBMIT REQUEST FUNCTION


                                //  >>>>>>>>>>>>>>>>>>>>     CHECKOUT CART


                                //  >>>>>>>>>>>>>>>>>>>>     REMOVE ITEM FROM CART


                                //  >>>>>>>>>>>>>>>>>>>>     CHANGE ITEM IN CART

                                // >>>>>>>>>>>>>>>>>>>>     CANCEL CART
                            

                            


                        
                            

                        } ) ;   //  END of AddCart Click Handler





                    }
                }
            );

                    
            $(document).on('closed','#prDetailModal' , function(e){ e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 

                                                    } ) ;

            $(document).on('opened', '#prDetailModal', function (e) {

            // console.log ( $(this).attr('data-prName') +'    '+  $(this).attr('data-pHLk') +'    '+ $(this).attr('data-priceDn')  )

                // CUSTOMIZE THE MODAL SHELL
                // title  .varMod-title   data-prName  
                $('.varMod-header h4.varMod-title' , $(this) ).html(`${ $('#prDetailModal').attr('data-prName')}`)


                



                // CUSTOMIZE THE MODAL CONTENTS 


                                                });



            $(document).on('click', '.seeMod-photoLoad', function (e) {
                
                        e.preventDefault();
                        let t = e.target ;
                        let tg = $(t) ; 
                        let gosxn = tg.attr('href') ;
                        let mk = tg.attr('data-buttonMarker') ;
                

                        // console.log(mk + '   ' + gosxn)

                        // MODAL MARKER
                        
                            var modMak  =  tg.attr('data-linkMod') ;
            
                        // Get the current position of the body
                        bdTop = $(window).scrollTop () ;
                        //  pass the data on the modal and show 
                        $(modMak).attr('data-lastP' , bdTop ) ;
                    
                            //console.log($(this).attr('href'))
                                

                                // Open Modal and Scroll it up
                            //  console.log (tg) ;
                    $(modMak).iziModal('open'); 
                                // Set in The IMG content         
                    $("#photo-loadMod .iziModal-content").append( `<img src="${gosxn}" class="img-full"  height="450px" />`) ;     
                    $(`${modMak} .iziModal-wrap`).animate({scrollTop:0}, 800);

                      
            });

        

            /// >>>>>>>>>>>>>>  THE OPENER FOR PRODUCT DETAIL MODAL  >>>>>>>
                                                    
            $(document).on('click', '.seeMod', function (e) {

                            e.preventDefault();
                            let t = e.target ;
                            let tg = $(t) ; 
                            let gosxn = tg.attr('href') ;
                            let mk = tg.attr('data-buttonMarker') ;
                            

                        // console.log(mk + '   ' + gosxn)

                        // MODAL MARKER
                        var modMak  =  tg.attr('data-linkMod') ;
                            // Parent
                        let tgP = tg.parents('.itemBox') ;

                            // Item Name
                        let itNam = $('.pTitle' , tgP).html() ;
                        $(modMak).attr('data-prName' , itNam ) ;
                        $('.variant-item .product-name' , modMak).html(itNam) ;

                            // Item photo link
                        let itPhLk = $('.img-full' , tgP).attr('src') ;
                        $(modMak).attr('data-pHLk' , itPhLk ) ;
                        $('.variant-item .img-full' , modMak).attr('src', itPhLk).attr('href', itPhLk) ;


                        

                            
                        // Item PRICE VALUE
                        let itPriceVal = tgP.attr('data-item-price') ;
                            // Element Data Price Values
                        $(modMak).attr('data-priceVal' , itPriceVal ) ;
                        $('.variant-item' , modMak).attr('data-varPrice' , itPriceVal) ;
                            // Dispalyed Price Value
                        $('.variant-item .price-val' , modMak).html(itPriceVal) ;

                       // Item FROM-PRICE
                        let itPrice = $('.new-price' , tgP).html() ;
                        $(modMak).attr('data-priceDn' , itPrice ) ;
                       // $('.product-item .new-price' , modMak).html(itPrice) ;  //>>>>   REVIEWED  NOV-2023  <<<<<
                       
    
                       //  PROduct ID and/or  SKU                     
                       $('.variant-item' , modMak).attr('data-varID' , tgP.attr('data-item-id') ) ;       


                       ///>>>>>>>>>>>  NEED TO INCLUDE THE ITEM META DATA
                            //  For the MOdal Shell
                       $(modMak).attr('data-prod-meta' , tgP.attr('data-itemMeta') ) ;
                            // For the Product Item
                       $('.variant-item' , modMak).attr('data-itemMeta' , tgP.attr('data-itemMeta') ) ;



                        // Get the current position of the body
                        bdTop = $(window).scrollTop () ;
                        //  pass the data on the modal and show 
                        $(modMak).attr('data-lastP' , bdTop ) ;
                    
                            console.log(bdTop) ;





                            // Set the value in Subtotal  :
                        var svi = $('input.item-subtotal', '#prDetailModal') ;

            svi.map(function(ix, el ){
                let pbx = $(el).parents('.variant-item') ;
                let qt = $('.cart-plus-minus-box' , pbx).val() ;
                
                // let upr =  JSON.parse( pbx.attr('data-var-itemMeta')).var_price ;
            // let upr =  pbx.attr('data-varPrice') ;
            let upr =    itPriceVal ;

            // console.log (pbx.attr('class')) ;

                $(el).val(qt*upr) ;       

            } ) ;


                        // GET THE VARIANTS SET


                        // LOOP THROUGH TO FILL THE LIST  ( if longer than max length : Set pagination in )

                        

                        // REMOVE THE PLACEHOLDERS  >> then >>> SHOW THE LOADED VARIANTS 



                                

                            

                                // Open Modal and Scroll it up
                        $(modMak).iziModal('open' ); 
                                // Set in The Ajax content 
                    // $("#sxn-loadMod .iziModal-content").load(`kwabaz-frm-pageHelper-01.php?loadsxn=${$(this).attr('href')}`) ;

                            $(`${modMak} .iziModal-wrap`).animate({scrollTop:0}, 800);



                                
                                    
                    });                                                




            // VARIANT MODAL test card modal init
			$('#variantModal').iziModal(
                {
                  title: 'PRODUCT VARIANTS' ,
                    headerColor : '#55ff55',
                    width : '90%' ,
                    iconColor: '#ed3237b2' ,
                    
                    fullscreen : true ,
               
                    afterRender: function(){ 

                      



                        //  ***NOTE**** BEST TO PUT ALL METADATA AS AN ARRAY OF OBJECTS HERE
                        
                       // var metObj = { var_pr_id:'$name-x' , var_price : 1000 } ;

                        
                        /*----------------------------------------*/
                        /*  QTY Button
                        /*----------------------------------------*/
                        $('.cart-plus-minus', '#variantModal').append(
                            '<div class="dec qtybutton"><i class="fa fa-minus"></i></div><div class="inc qtybutton"><i class="fa fa-plus"></i></div>'
                        );

                        // Set the value in Subtotal  :
                        var svi = $('input.item-subtotal', '#variantModal') ;

                        svi.map(function(ix, el ){
                            let pbx = $(el).parents('.variant-item') ;
                            let qt = $('.cart-plus-minus-box' , pbx).val() ;
                            
                            // let upr =  JSON.parse( pbx.attr('data-var-itemMeta')).var_price ;
                            let upr =  pbx.attr('data-varPrice') ;

                           // console.log (pbx.attr('class')) ;

                            $(el).val(qt*upr) ;       

                        } ) ;
                                                  
                            // Set the value in Quantities To CART-QUANTITIES ***LATER***  :
                            /*
                            
                            */

                            // Change QUANTITY  PLUS  Recalculate SUBTOTAL when  -EVENT- Quantity changed:

                        $('.qtybutton', '#variantModal').on('click', function () {
                            var $button = $(this);
                            var oldValue = $button.parent().find('input').val();
                            if ($button.hasClass('inc')) {
                                var newVal = parseFloat(oldValue) + 1;
                            } else {
                                // Don't allow decrementing below zero
                                if (oldValue > 1) {
                                    var newVal = parseFloat(oldValue) - 1;
                                } else {
                                    newVal = 1;
                                }
                            }
                            $button.parent().find('input').val(newVal);


                            // Recalculate SUB-TOTAL  : when  -EVENT- Quantity changed:
                            let pbx = $button.parents('.variant-item') ;

                            let upr =  pbx.attr('data-varPrice') ;

                            $('input.item-subtotal',pbx).val(newVal*upr) ;
                        


                        });
                            


                        // Set ADD-TO-CART  -EVENT- :
                            /*

                            // Fetch ItemID , Qnty 

                            // Set Request Data

                            // Make Ajax call

                            // Toast on Success  >> Then Ask If : @:Open Cart ||  @:Open Checkout  || @:Continue

                            // OR Alert on Failure 


                          
                            */


                    }
                }
            );

                    
            $(document).on('closed','#variantModal' , function(e){ e.preventDefault ();
                                        var lastP = $(this).attr('data-lastP') ;                                   
                                        $('html,body').animate({scrollTop : lastP} , 1500); 
    
                                                    } ) ;
            
            $(document).on('opened', '#variantModal', function (e) {

               // console.log ( $(this).attr('data-prName') +'    '+  $(this).attr('data-pHLk') +'    '+ $(this).attr('data-priceDn')  )

                // CUSTOMIZE THE MODAL SHELL
                // title  .varMod-title   data-prName  
                $('.varMod-header h4.varMod-title' , $(this) ).html(`${ $('#variantModal').attr('data-prName')}`)


                // top icon   data-pHLk  .top-gif - src
                $('img.top-gif' , $(this) ).attr( 'src', $('#variantModal').attr('data-pHLk'))

                // top intro   .top-intro  `Please browse through and select your choice. Price - ${  data-priceDn }`
                $('.top-intro' ,'#variantModal .container' ).html(`Please browse through the available package options and select your choice. Prices range - ${ $('#variantModal').attr('data-priceDn')}`) 




                // CUSTOMIZE THE MODAL CONTENTS 

        
                                                });



                                                    
                $(document).on('click', '.seeVarMod', function (e) {
            
                                e.preventDefault();
                                let t = e.target ;
                                let tg = $(t) ; 
                                let gosxn = tg.attr('href') ;
                                let mk = tg.attr('data-buttonMarker') ;
                                

                            // console.log(mk + '   ' + gosxn)

                            // MODAL MARKER
                            var modMak  =  tg.attr('data-linkMod') ;
                                // Parent
                            let tgP = tg.parents('.itemBox') ;

                                // Item Name
                            let itNam = $('.product-name' , tgP).html() ;
                            $(modMak).attr('data-prName' , itNam ) ;

                                // Item photo link
                            let itPhLk = $('.img-full' , tgP).attr('src') ;
                            $(modMak).attr('data-pHLk' , itPhLk ) ;

                                // Item FROM-PRICE
                            let itPrice = $('.new-price' , tgP).html() ;
                            $(modMak).attr('data-priceDn' , itPrice ) ;

                                // Item PRICE VALUE
                            let itPriceVal = tgP.attr('data-item-price') ;
                            $(modMak).attr('data-priceVal' , itPriceVal ) ;



                            //  NEED TO ADD PRODUCT META ( of mother-product )
                            $(modMak).attr('data-prod-meta' , tgP.attr('data-itemMeta') ) ;



                                    //>>>>>>>>>>> DISABLE FOR TESTING  <<<<<<<<<
                        // $('.variant-item' , modMak).attr('data-varPrice' , itPriceVal) ;

                       
                        //  NEED TO LOOP THROUGH THE VARIANT ITEMS WITHIN THE BOX - TO FIX IN PARAMS OF THE VARIANTS OF THE MOTHER-PRODUCT
                            // Get    $( '.variant-item' , 'div[data-varMod-ItemsWrap]')  >>
                            var varSet = $( 'div[data-varMod-ItemsWrap] .variant-item' , modMak ) ;


                            // Get Product Meta collection for the Variants of the Mother product 

                            if (  tgP.attr('data-itemMeta') !== undefined &&   tgP.attr('data-itemMeta') !== ''){

                                    let prMetaObj = JSON.parse ( tgP.attr('data-itemMeta') ) ;
                                    var varDataSet =  prMetaObj['variants'] ;  //  <<<<<<<  The Array of VariantObjects

                                  //  In TESTING LOOP THROUGH THE ELEMENTS [varSet] >>> In PRODUCTION : LOOP THE DATA  [varDataSet]
                                    varSet. each( function( $i , itm ) {

                                        let varX = $(itm );
                                        let varDataObj = varDataSet[$i] ;  //  An Object from the DataBase Fetch

                                        // fill varItem[$ix] with data from varObj[$ix]
                                                // Item Name

                                                // Item Unit Price

                                                // Item SKU

                                                // Item Intro

                                                // Item Photo src

                                                // Item Data Attributes

                                                   //  data-title-fix
                                                   //  data-sku-fix

                                                   //  data-var-itemInstance
                                                   //  data-varID

                                                   //  data-varPrice
                                                   //  data-var-itemMeta
                                                    



                                    })  ;   // END OF EACH  LOOP  
                                    
                                    // AFTER THE LOOP >>>>>>>
                                    
                                            // if there is more more varDataSet[$i] to go  >>> then 
                                                    //  clone varItem .sample >> 
                                                    // fill in  >>  
                                                    // append after ;


                            } //  END OF IF [tgP.attr('data-itemMeta') !== undefined]
                            else {  // >>>  if Prod-Meta not available >>>>  SITUATION AT TESTING TIME NOW  >>>>>>>                                

                                 //  In TESTING LOOP THROUGH THE ELEMENTS [varSet] >>> In PRODUCTION : LOOP THE DATA  [varDataSet]
                                    varSet. each( function( $i , itmE ) {

                                        let itm = $(itmE) ;

                                        //  Just set the Prod Title right   data-title-fix=" - 50K Size" 
                                        let ptl =  itNam + itm.attr('data-title-fix') ;

                                        $('.product-name' , itm).html(ptl) ;

                                        // Set the Item-Instance
                                        itm.attr('data-var-itemInstance' , $i + 1 ) ;


                                    })  ;   // END OF EACH  LOOP  
                                    
                                    // AFTER THE LOOP >>>>>>>
                                    
                                            // if there is more more varDataSet[$i] to go  >>> then 
                                                    //  clone varItem .sample >> 
                                                    // fill in  >>  
                                                    // append after ;

                            }
                             

                            // Get the current position of the body
                            bdTop = $(window).scrollTop () ;
                            //  pass the data on the modal and show 
                            $(modMak).attr('data-lastP' , bdTop ) ;
                        
                                //console.log($(this).attr('href'))



                            // Set the value in Subtotal  :
                                var svi = $('input.item-subtotal', '#variantModal') ;

                            svi.map(function(ix, el ){
                                let pbx = $(el).parents('.variant-item') ;
                                let qt = $('.cart-plus-minus-box' , pbx).val() ;
                                
                                // let upr =  JSON.parse( pbx.attr('data-var-itemMeta')).var_price ;
                            let upr =  pbx.attr('data-varPrice') ;
                            //let upr =    itPriceVal ;

                            // console.log (pbx.attr('class')) ;

                                $(el).val(qt*upr) ;       

                            } ) ;



                            // GET THE VARIANTS SET


                            // LOOP THROUGH TO FILL THE LIST  ( if longer than max length : Set pagination in )

                            

                            // REMOVE THE PLACEHOLDERS  >> then >>> SHOW THE LOADED VARIANTS 



                                    

                                

                                    // Open Modal and Scroll it up
                            $(modMak).iziModal('open' ); 
                                    // Set in The Ajax content 
                        // $("#sxn-loadMod .iziModal-content").load(`kwabaz-frm-pageHelper-01.php?loadsxn=${$(this).attr('href')}`) ;

                                $(`${modMak} .iziModal-wrap`).animate({scrollTop:0}, 800);
                                $(`${modMak} .iziModal-wrap .modal-body`).animate({scrollTop:0}, 800);



                                    
                                        
                });                                                





                //  MODAL OPENER by .seeMod
        
                $(document).on('click', '.seeMod-gen' , function(e){
                
                e.preventDefault();
                let t = e.target ;
                let tg = $(t) ;
                let mk = tg.attr('data-buttonMarker') ;
                var modMak  =  tg.attr('data-linkMod') ;
                // Get the current position of the body
                bdTop = $(window).scrollTop () ;
                //  pass the data on the modal and show 
                $(modMak).attr('data-lastP' , bdTop ) ;
            
                $(modMak).iziModal('open' ); 
            
                $(`${modMak} .iziModal-wrap`).animate({scrollTop:0}, 800);
            
            
                    }) ; 



                $(document).on('click', '.seeMod-sxnLoad', function (e) {
                    
                    e.preventDefault();
                    let t = e.target ;
                    let tg = $(t) ; 
                    let gosxn = tg.attr('href') ;
                    let mk = tg.attr('data-buttonMarker') ;
                    

                    // console.log(mk + '   ' + gosxn)

                    // MODAL MARKER
                    
                        var modMak  =  tg.attr('data-linkMod') ;
        
                    // Get the current position of the body
                    bdTop = $(window).scrollTop () ;
                    //  pass the data on the modal and show 
                    $(modMak).attr('data-lastP' , bdTop ) ;
                
                        //console.log($(this).attr('href'))
                            

                            // Open Modal and Scroll it up
                        //  console.log (tg) ;
                    $(modMak).iziModal('open'); 
                        // Set in The Ajax content 
                    //   $("#sxn-loadMod .iziModal-content").load(`kwabaz-frm-pageHelper-01.php?loadsxn=${$(this).attr('href')}`) ;
                    $('#sxn-loadMod .iziModal-content').load(`${$(this).attr('href')}`) ;
                    $(`${modMak} .iziModal-wrap`).animate({scrollTop:0}, 800);

                        
            });

                // var strD =  JSON.parse( $('.rangeStore' , '#sxn-loadMod .iziModal-content' ).html() )  ; 
                // $('#sxn-loadMod .iziModal-content').load('product-range.php?move=see_all_range' , {categ: encodeURIComponent(categ), marker :  encodeURIComponent(marker)} , function(resp , sts , xhr) { loadRange( str['data'] , )  }) ;
                    
            
                

                
                    /*----------------------------------------*/
                    /* FUNCTIONS FOR #MINICART  MODAL  -  CART , CHECKOUT, WALLET
                    /*----------------------------------------*/

                    // Open Specific DESTINATION in #MINICART  <<<  Later pass another argument for Function to run Internal Processes >>>>
                    function openSpecGo ( dest ) {

                        // get the element that hass the data-specgo
                        let prim = $(`[data-specgo ="${dest}"]`) ;
                        // Get the parent '#miniCart'
                        let priMum = prim.parents('#miniCart') ;
                        
                        // Hide all elements with data-specgo in the parent - including our guy - THEN - Show that element ONLY
                        $('[data-specgo]' , priMum ).hide(100 , function() { $('#miniCart').addClass('open');  prim.show(600) ;} ) ;
console.log(prim) ;
                    } ; 

                    

                    // SPECIFIC OPENER FOR CHECKOUT

                    $('.toolbar-btn[href = "#miniCart"]').on('click' , function(we){

                        let t = we.target ;
                        let tg = $(t) ;
                        // Get the data-specgo - The Destination
                        let specgo = tg.attr('data-speclink') ;

                        console.log(specgo) ;

                        // Open ONLY The  specgo Element ( "cart" || "checkout" || "wallet"  || other can be added)
                        openSpecGo ( specgo ) ;  // others get closed

                        // Carry out other Internal Processes 


                    }) ;






                    // SPECIFIC OPENER FOR WALLEL-MANAGEMENT









                    // MINICART + CHECKOUT SEE-MORE  TOGGLES

                    $('.js-more-btn' , '#miniCart').on('click', function(ex){
                
                        ex.preventDefault();
                        let t = ex.target ;
                        let tg = $(t) ; 
                        let tbx = tg.parents('.js-more-box') ;
                        $('.js-comp-more' , tbx).show(600); 

                       // Deal with alternates
                       $('.js-comp-more2' , tbx).slideUp(600); 
                        $('.js-more-btn2' , tbx).removeClass('btn-fade');

                        tg.addClass('btn-fade');
                        
                    }) ;
                        
                        
                        
                    $('.js-more-close'  ,  '#miniCart').on('click' , function (e) {
                        e.preventDefault();
                        let t = e.target ;
                        let tg = $(t) ; 
                        let tbx = tg.parents('.js-more-box') ;
                        $('.js-comp-more' , tbx).hide(600); 
                        
                        $('.js-more-btn' , tbx).removeClass('btn-fade');
                                                        
                        
                    } ) ;




                    //  SECOND SET OF JS-MORE-BOX CONTROL

                    $('.js-more-btn2' , '#miniCart').on('click', function(ex){
                
                        ex.preventDefault();
                        let t = ex.target ;
                        let tg = $(t) ; 
                        let tbx = tg.parents('.js-more-box') ;
                        $('.js-comp-more2' , tbx).show(600); 

                        // Deal with alternates
                        $('.js-comp-more' , tbx).slideUp(600); 
                        $('.js-more-btn' , tbx).removeClass('btn-fade');

                        

                        tg.addClass('btn-fade');
                        
                    }) ;
                        
                        
                        
                    $('.js-more-close2'  ,  '#miniCart').on('click' , function (e) {
                        e.preventDefault();
                        let t = e.target ;
                        let tg = $(t) ; 
                        let tbx = tg.parents('.js-more-box') ;
                        $('.js-comp-more2' , tbx).hide(600); 
                        
                        $('.js-more-btn2' , tbx).removeClass('btn-fade');
                                                        
                        
                    } ) ;




                    //  B - RANGE -- SET 1 OF JS-MORE-BOX CONTROL


                    $('.js-more-btn-b' , '#miniCart').on('click', function(ex){
                
                        ex.preventDefault();
                        let t = ex.target ;
                        let tg = $(t) ; 
                        let tbx = tg.parents('.js-more-box-b') ;
                        $('.js-comp-more-b' , tbx).show(600); 

                        // Deal with alternates
                        

                        

                        tg.addClass('btn-fade');
                        
                    }) ;
                        
                        
                        
                    $('.js-more-close-b'  ,  '#miniCart').on('click' , function (e) {
                        e.preventDefault();
                        let t = e.target ;
                        let tg = $(t) ; 
                        let tbx = tg.parents('.js-more-box-b') ;
                        $('.js-comp-more-b' , tbx).hide(600); 
                        
                        $('.js-more-btn-b' , tbx).removeClass('btn-fade');
                                                        
                        tbx.animate({scrollTop:0}, 800) ;
                        
                    } ) ;









                $('.js-more-btn' , '#sxn-LoadMod .container').on('click', function(ex){
                
                ex.preventDefault();
                let t = ex.target ;
                let tg = $(t) ; 
                let tbx = tg.parents('.js-more-box') ;
                $('.js-comp-more' , tbx).show(600); 

                console.log('I deey O');

                tg.addClass('btn-fade');
                
                }) ;
                
                
                
                $('.js-more-close'  , '#sxn-LoadMod .container').on('click' , function (e) {
                e.preventDefault();
                let t = e.target ;
                let tg = $(t) ; 
                let tbx = tg.parents('.js-more-box') ;
                $('.js-comp-more' , tbx).hide(600); 
                
                $('.js-more-btn' , tbx).removeClass('btn-fade');
                                                
                
                } ) ;




                $(document).on('opened', '#sxn-LoadMod', function (e) {

                                // Set the value in Quantities To CART-QUANTITIES ***LATER***  :
                                    /*
                                    
                                    */

                    // CUSTOMIZE THE MODAL CONTENTS 


                                    });




        }) ;

	
	
    

    
                
                
    
    
					




		//   IZITOAST SUPPORT FUNCTIONS


		$(document).on('ready', function (edr) {

            

           
				
								/*	iziToast.show(
										{
											title: "Hey!" ,
											message: "We gat you covered. Let's rock this town! <br> <div class=\"align-self-center mb-3\"  style=\"text-align: center;\"> <audio controls > <source src=\"../media/bits-aud-part-megasales-rev-2.mp4\" type=\"audio/mpeg\" > </audio> </div> ",
											backgroundColor : "#b2d105" ,
                                            position : "center" ,
                                            tomeout : 2000
										}
									);

										*/
				//  TELL_ME TRIGGERS 

                    
                $(".trigger-tellme").on('click', function (event) {
                                 event.preventDefault();
 
                                 iziToast.info({
                                         timeout: 20000,
                                         overlay: true,
                                         displayMode: 1,
                                         id: 'inputs',
                                         zindex: 999,
                                         title: 'NOT READY YET...',
                                        message: '<br>But we can Inform you when ready, - <br> <strong>If you wish to be notified, <br> - please check the box, then enter your email address,<br> so we can inform you when ready.</strong>',
                                        position: 'center',
                                        drag: false,
                                        onOpened : function() {
                                                                            $('.iziToast-inputs input:text').attr('disabled' ,true) ;

                                                                            $('.iziToast-inputs textarea').attr('disabled' ,true) ;

                                                                            $(document).on('click' , '.iziToast-inputs input , .iziToast-body' , function(ce){
                                                                                $('.iziToast-inputs input').attr('disabled' ,false) ;

                                                                                $('.iziToast-inputs textarea').attr('disabled' ,false) ;

                                                                            }) ;

                                                                        } ,
                                
                                        inputs: [
                                                ['<input type="checkbox">', 'change', function (instance, toast, input, e) {
                                                console.info(input.checked);
                                                }],
                                                ['<input type="text" placeholder="Email Address" >', 'blur', function (instance, toast, input, e) {
                                                console.info(input.value);
                                                }, true],

                                        ] ,


 
                                         buttons: [
                                                 ['<button><b>Notify Me</b></button>', function (instance, toast, button, e, inputs) {
 
                                                 //console.info(button);
                                                 //console.info(e);
 
                                                // alert(inputs[1].value)
 
                                                 instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
 
                                                 iziToast.success({
                                                 id: 'success',
                                                 zindex: 9999,
                                                 timeout: 2000,
                                                 title: 'Great!',
                                                 overlay: true,
                                                 message: 'Thank you , we will notify you when Ready.',
                                                 position: 'topLeft'
                                                 });
 
                                                 }, false], 
 
                                         ],
 
 
                                 });
 
                         });
 
 
 
 
     
 
 
                     $(".trigger-askQ" ).on('click', function (event) {
                                         event.preventDefault();
                     
                                         iziToast.info({
                                             timeout: 20000,
                                             overlay: true,
                                             displayMode: 1,
                                             id: 'inputs',
                                             zindex: 999,
                                             title: 'Great! Please Ask.',
                                             message: 'Type Your Question -',
                                             position: 'center',
                                             drag: false,

                                             onOpened : function() {
                                            $('.iziToast-inputs input:text').attr('disabled' ,true) ;

                                            $('.iziToast-inputs textarea').attr('disabled' ,true) ;

                                            $(document).on('click' , '.iziToast-inputs input , .iziToast-body' , function(ce){
                                                $('.iziToast-inputs input').attr('disabled' ,false) ;

                                                $('.iziToast-inputs textarea').attr('disabled' ,false) ;

                                            }) ;

                                         } ,
                                             
                                             inputs: [
                                                 
                                                 ['<input type="checkbox">', 'change', function (instance, toast, input, e) {
                                                     console.info(input.checked);
                                                 }] , 

                                                 ['<input type="text" placeholder="Email Address" >', 'blur', function (instance, toast, input, e) {
                                                     console.info(input.value);
                                                     
                                                 }, true],

                                                 ['<textarea placeholder="Type Your Question" >', 'blur', function (instance, toast, input, e) {
                                                     console.info(input.value);
                                                     
                                                 }, true],

                                             ] ,
                     
                     
                                             buttons: [
                                 ['<button><b>Submit</b></button>', function (instance, toast, button, e, inputs) {
                     
                                     console.info(button);
                                     console.info(e);
                     
                                    // alert('Thanks, we\'ll answer you on ' + inputs[1].value +' as soon as possible.')
                     
                                     instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                     
                                 iziToast.success({
                                         id: 'success',
                                         zindex: 9999,
                                         timeout: 4000,
                                         title: 'Great!',
                                         overlay: true,
                                         message: 'Thanks, we\'ll answer you on ' + inputs[1].value +' as soon as possible.',
                                         position: 'topLeft'
                                     });
                     
                                 }, false], 
                     
                                                         ],
                     
                     
                                         });
                                     });
     
     
     
                     $(".trigger-comeArea" ).on('click', function (event) {
                                     event.preventDefault();
                 
                                     iziToast.info({
                                         timeout: 20000,
                                         overlay: true,
                                         displayMode: 1,
                                         id: 'inputs',
                                         zindex: 999,
                                         title: 'Great! We\'d Be Glad',
                                         message: 'Where is Your Area Please? -',
                                         position: 'center',
                                         drag: false,

                                         onOpened : function() {
                                            $('.iziToast-inputs input:text').attr('disabled' ,true) ;

                                            $('.iziToast-inputs textarea').attr('disabled' ,true) ;

                                            $(document).on('click' , '.iziToast-inputs input , .iziToast-body' , function(ce){
                                                $('.iziToast-inputs input').attr('disabled' ,false) ;

                                                $('.iziToast-inputs textarea').attr('disabled' ,false) ;

                                            }) ;

                                         } ,
                                         
                                         inputs: [
                                             ['<input type="checkbox">', 'change', function (instance, toast, input, e) {
                                                 console.info(input.checked);
                                             }],

                                             ['<input type="text" placeholder="Email Address" >', 'blur', function (instance, toast, input, e) {
                                                 console.info(input.value);
                                                 
                                             }, true],
                                             
                                             ['<input type="text" placeholder="Your Address" >', 'blur', function (instance, toast, input, e) {
                                                 console.info(input.value);
                                                 
                                             }, true],
                                             
                                             
                                         ] ,
                 
                 
                                         buttons: [
                             ['<button><b>Notify Me</b></button>', function (instance, toast, button, e, inputs) {
                 
                                 console.info(button);
                                 console.info(e);
                 
                                 //alert(inputs[0].value + '. Thanks, we\'ll notify you on ' + inputs[1].value +' when included.')
                 
                                 instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                 
                             iziToast.success({
                                     id: 'success',
                                     zindex: 9999,
                                     timeout: 4000,
                                     title: 'Great!',
                                     overlay: true,
                                     message: inputs[0].value + ' : Address Noted. Thanks, we\'ll notify you on ' + inputs[1].value +' when included.',
                                     position: 'topLeft'
                                 });
                 
                             }, false], 
                 
                                                     ],
                 
                 
                                     });
                                 });
 
 
 
 
                         $(".trigger-addMine" ).on('click', function (event) {
                                     event.preventDefault();
                 
                                     iziToast.info({
                                         timeout: 20000,
                                         overlay: true,
                                         displayMode: 1,
                                         id: 'inputs',
                                         zindex: 999,
                                         title: 'Great! We\'d Be Glad',
                                         message: 'State Your Favorite Please. -',
                                         position: 'center',
                                         drag: false,

                                         onOpened : function() {
                                            $('.iziToast-inputs input:text').attr('disabled' ,true) ;

                                            $('.iziToast-inputs textarea').attr('disabled' ,true) ;

                                            $(document).on('click' , '.iziToast-inputs input , .iziToast-body' , function(ce){
                                                $('.iziToast-inputs input').attr('disabled' ,false) ;

                                                $('.iziToast-inputs textarea').attr('disabled' ,false) ;

                                            }) ;

                                         } ,
                                         
                                         inputs: [
                                            
                                         ['<input type="checkbox">', 'change', function (instance, toast, input, e) {
                                                 console.info(input.checked);
                                             }],
                                             
                                             
                                             ['<input type="text" placeholder="Your Email Address" >', 'blur', function (instance, toast, input, e) {
                                                 console.info(input.value);
                                                 
                                             }, true],



                                             ['<input type="text" placeholder="Your Favorite" >', 'blur', function (instance, toast, input, e) {
                                                 console.info(input.value);
                                                 
                                             }, true],
                                             
                                             
                                         ] ,
                 
                 
                                         buttons: [
                             ['<button><b>Notify Me</b></button>', function (instance, toast, button, e, inputs) {
                 
                                 console.info(button);
                                 console.info(e);
                 
                                 //alert(inputs[0].value + ' Noted. Thanks, we\'ll notify you on ' + inputs[1].value +' when included.')
                 
                                 instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                 
                             iziToast.success({
                                     id: 'success',
                                     zindex: 9999,
                                     timeout: 4000,
                                     title: 'Great!',
                                     overlay: true,
                                     message: inputs[0].value + ' Noted. Thanks, we\'ll notify you on ' + inputs[1].value +' when included.',
                                     position: 'topLeft'
                                 });
                 
                             }, false], 
                 
                                                     ],
                 
                 
                                     });
                                 });
                 
     
     
 

							
									
									
									
									
												}); 


        // COUNTDOWN TIMER  SUPPORT  :

        //  FUNCTION TO GET THE CURRENT DATE FROM THE SERVER   (tentatively just returns empty string)
        const getCurrentDate = function(){
            // prep AJAX
            // Make AJAX call
                // SUCCESS :
                    // Return response data  ( Server-GMT-date + 24 hrs )

            // Meanwhile , just return the current Date
            return new Date().valueOf() ;

        } ;  // END OF FUNCTION




        //  FUNCTION TO SET CTD TIMER AND MESSAGE

        const setTimer = function( ctdArgObj ) { 

                // Set Determining Params : set by attr - data- : [cycle] { **single|**daily|weekly|monthly| others }); [countdown]{deadline Datetime (full expression format)} ; [percutoff] {(NOT applicable to "single" cycle)periodic cutoff time for each period : defaults : "00-00"(midnight) for daily , "0-00"(midnight-sunday) for weekly  , "01-00"(midnight,first day)for monthly, ... etc } ;  [peropen] { (NOT applicable to "single" cycle)periodic open time for each period : defaults : "00-01"(12:01 am) for daily , "1-01"(12:01 am-Monday) for weekly  , "01-01"(1:00 am,first day)for monthly, ... etc } ;

                 
                // NOTE : Only Single and Daily cycles treated here 

                var ctd = $('.countdown-wrap>.countdown').attr('data-countdown') ;

                var cycle = $('.countdown-wrap>.countdown').attr('data-cycle') ;




                let dtok = getCurrentDate () ;

                var current = new Date( dtok ) ;

                


                if ($('.countdown-wrap>.countdown').attr('data-cycle') === 'daily'){

                            // If the Cycle of Countdown is DAILY ::


                        var pcfdata = $('.countdown-wrap>.countdown').attr('data-percutoff') ;
                        var popendata= $('.countdown-wrap>.countdown').attr('data-peropen') ;


                        var pcf =  pcfdata.split('-') ;
                        var popen =  popendata.split('-') ;

                        var t2p = new Date(new Date().setHours(Number(pcf[0]),Number(pcf[1]),0)) ;

                        var topenHr = Number(popen[0]) , 
                            topenMin = Number(popen[1]) ;


                        // if the time is later than 2pm
                        if ((current.getTime() - t2p.getTime()) > 0) { 

                        //  console.log(current.getTime() - t2p.getTime()) ;  //<TESTER>

                                // if later than OpenTime (10pm)
                            if (current.getTime() >= current.setHours(topenHr,topenMin,0)) {

                                //set countdown to cutofftime (2pm ) tomorrow
                                let t2ptm = new Date (t2p.setDate(t2p.getDate() + 1)) ;
                                var nCTD = t2ptm.toString(); 
                                $('.countdown-wrap>.countdown').attr('data-countdown' , nCTD) ; // changes countdown
                                $('span.ctd.sub-title').html('Pre-Order before 2:00 PM Tomorrow') ;  //changes day to tomorrow
                                $('a.btn.ctd').removeAttr('disabled'); // enable the button

                            }
                            else { // if time is between cutofftime (2pm ) and opentime ( 10 pm)
                                        // Announce delay till 10 pm
                                $('.countdown-wrap').replaceWith('<div class="row" style="height:140px; background-image: url(../assetsecm/images/misc/vector-hourglass.png); background-position: center; background-size: contain; background-repeat: no-repeat;" ></div>') ; // changes countdown to hour glass
                                $('span.ctd.sub-title').html('Pre-Order starting from   <i class="fa fa-clock-o" style="font-size:1.5em;"></i> '+ popendata.replace('-', ':') +',') ;  //changes preorder to topen (10pm )
                                $('a.btn.ctd').attr('disabled' , true).addClass('disabled'); // disable the button

                            }


                        }
                        else {  
                                // if time is not yet cutofftime (2pm ) :
                                // console.log(current.getTime() - t2p.getTime()) ;

                                $('.countdown-wrap>.countdown').attr('data-countdown' , t2p.toString()) ; // changes countdown
                                $('span.ctd.sub-title').html('Pre-Order before  <i class="fa fa-clock-o" style="font-size:1.5em;"></i> '+ pcfdata.replace('-', ':') +' TO GET DISCOUNTS & BONUSES') ;  //Announce cutoff time
                                $('a.btn.ctd').removeAttr('disabled').removeClass('disabled'); // enable the button

                        }

                } 

              //  console.log(current.valueOf() );
             // console.log(Date().valueOf()) ; 
                                                         

        } ;   //  END OF FUNCTION --  setTimer



        //  CALLING THE TIMER WITH PERIODIC UPDATE
        
		$(document).on('ready', function(edr){ 

            let ctdArgs = { } ;
            
            setTimer (ctdArgs ) ;

            window.setInterval ( function(){  setTimer ( {}) ; } , 6000 , {} ) ;
        
        } ); 





        // XXXXXXX  ABDICATED   XXXXXXXX ABDICATED    XXXXXXXX ABDICATED xxxxxxxxxxxxxxxxxx
        // XXXXXXX  ABDICATED   XXXXXXXX ABDICATED    XXXXXXXX ABDICATED xxxxxxxxxxxxxxxxxx

        

            // PAGE INIT ESSENTIALS  :


                                                    
                        //  PAGE OBJECT-BASED STORAGE
            var pageObject = {


                        helperLink : '' ,

                        frmID : '' ,

                        $pageOwnerFrm : {

                            type : '' ,
                            id : '' ,
                            nick : '' ,
                            created: 0 , 
                            handlerID : '' ,
                            ref_code : '' ,

                            contactInfo : { } ,
                            contact_location : { } ,

                            frmMeta : {} ,
                            
                            status :  {}   // Object of several params
                            //prefs : '' ,
                            //customerLog : [ ] ,
                            //transaction_log : [ ] ,


                        } ,
                        
                        $user: { 
                            type : '' ,
                            id : '' ,
                            nick : '' ,
                            created: 0 , 

                            ref_code : '' ,
                            ref_frm : '' ,
                            contact_location : '' ,
                            
                            status : '' ,
                            prefs : '' ,
                            transaction_log : '' ,

                        } , 
                                

                        prodBlocks: { 

                        default_prodBlock : {

                                block_name : '' ,
                                block_id : '' ,
                                block_category : '' ,
                                block_category_id : '' ,

                                shellType : '' ,
                                shellStyle : '' ,

                                blockTitle : '' ,
                                sideLeftBannerUrl : '' ,
                                sideRightBannerUrl : '' ,
                                topBannerUrl : '' ,
                                sxnIconUrl : '' ,
                                buttonLabel : '' ,
                                buttonUrl : '' ,

                                filterMarker : [ 
                                                [ ]   // TEMPLATE : ['refCol1' , 'refval' , '=' , 'AND' ]
                                ] ,
                            
                                sortMarker :   [ 
                                                {
                                                    field : '' , 
                                                    direction : ''  // DEFAULT :  'Ascending'
                                                }
                                ] ,
                                

                                listLimit : 0 ,

                                $blockFirstTab : {
                                            tabTile: '' ,
                                            tabSlug : '' ,
                                            tabDescription : '' ,
                                            tabImageLink : '' ,
                                            tabItemsCount : 0 ,
                                            tabPageSize : 48 ,
                                            tabFilterMarker : [ 
                                                [ ]   // TEMPLATE : ['refCol1' , 'refval' , '=' , 'AND' ]
                                            ] ,
                                            tabItemSet : [
                                                {
                                                    front_pr_id : '' ,
                                                    front_title : '' ,
                                                    front_sku : '' ,
                                                    front_product_type : '' , // simple || variableStat || variableDyna
                                                    front_parent_id : '' ,
                                                    front_show_price : 0 ,
                                                    front_price_top : 0 ,
                                                    front_price_btm : 0 ,
                                                    front_photo_link : '' ,
                                                    front_morephoto_links : [] ,
                                                    front_product_specs : {} ,
                                                    front_product_intro : [] , // Put as array to hold several paragraphs in each element .
                                                    front_product_category : '' , 
                                                    product_lastUpdate : 0 ,
                                                    product_sba : '' ,
                                                    product_stockState : '' ,
                                                    product_stockCount : 0 ,
                                                    product_promoState : 0 ,

                                                    front_product_meta : {} 
                                                }

                                            ]
                                            
                    
                                } ,
            
                                $blockTabSet : [
                                        {
                                            tabTile: '' ,
                                            tabSlug : '' ,
                                            tabDescription : '' ,
                                            tabImageLink : '' ,
                                            tabItemsCount : 0 ,
                                            tabPageSize : 48 ,
                                            tabFilterMarker : [ 
                                                [ ]   // TEMPLATE : ['refCol1' , 'refval' , '=' , 'AND' ]
                                            ] ,
                                            tabItemSet : [
                                                {
                                                    front_pr_id : '' ,
                                                    front_title : '' ,
                                                    front_sku : '' ,
                                                    front_product_type : '' , // simple || variableStat || variableDyna
                                                    front_parent_id : '' ,
                                                    front_show_price : 0 ,
                                                    front_price_top : 0 ,
                                                    front_price_btm : 0 ,
                                                    front_photo_link : '' ,
                                                    front_morephoto_links : [] ,
                                                    front_product_specs : {} ,
                                                    front_product_intro : [] , // Put as array to hold several paragraphs in each element .
                                                    front_product_category : '' , 
                                                    product_lastUpdate : 0 ,
                                                    product_sba : '' ,
                                                    product_stockState : '' ,
                                                    product_stockCount : 0 ,
                                                    product_promoState : 0 ,

                                                    front_product_meta : {} 
                                                }

                                            ]
                    
                                        }

                                ] ,
                                $filterTagsSet: [
                                    {
                                        tag_label : '' ,
                                        tag_slug : '' ,
                                        tag_marker : ''  // intitle || intags || inmaker || intagtitle || intagmaker || intitlemaker || inALL
                                    }
                                ] ,
                                showALL : true ,
                                showMore : false ,
                                showMoreLimit : 0 ,
                                $showMoreSet : [
                                        {
                                            front_pr_id : '' ,
                                            front_title : '' ,
                                            front_price_top : 0 ,
                                            front_price_btm : 0 ,
                                            front_photo_link : '' ,
                                        }

                                ] ,

                                $lastSync : 0 ,

                            } 

                        } , 

                        $cart : {   // looked up from cookie, session and DB  data , (latest edited is taken )
                            cart_id : '' ,
                            cart_created : 0 ,
                            cart_last_edit : 0 ,
                            cart_last_sync : 0 ,
                            cart_checkedOut : 0 ,

                            cart_temp_user : '' ,
                            cart_customer : '' ,
                        
                            cart_subtotal : 0 ,
                            cart_pr_items : [
                                {
                                    item_id :'' ,                       
                                    item_pr_id :'' ,
                                    item_pr_sku :'' ,

                                    item_pr_unit_price : 0 ,
                                    item_pr_quantity : 0 ,
                                    item_sub_value : 0 ,

                                    item_ship_class : '' ,
                                    item_sba :'' ,
                                    item_transp :'' ,
                                    item_whm : '' ,

                                    item_added :0 ,
                                    item_last_edit :0 ,
                                    item_removed :0 ,
                                    item_checkedout : 0 ,
                                    item_payed : 0 ,
                                    
                                    item_progress_report :[
                                        {
                                            sNum : '',
                                            submitTime : '',
                                            subject : '',
                                            body : '',
                                            attention : '',
                                            reviewBy : '',
                                            reviewTime : '',
                                            reviewNote : '',
                                            auditBy : '',
                                            auditTime : '',
                                            auditNote : '' ,
                                            auditStatus : '' ,
                                            status : '',

                                        }
                                        
                                    ] 


                                }
                            ] ,


                        } , 

                        $open_variants: { 
                            parent:'', 
                            variantItems : [ 
                                    { 
                                        variant_id : '' ,
                                        variant_sku : '' ,
                                        var_title : '' ,
                                        parent_id : '' ,
                                        wp_id : '' ,
                                        var_photo_link : '' ,
                                        var_stock_left : '' ,
                                        var_sba : '' ,
                                        var_sba_location : '' ,
                                        var_price : 0 ,
                                        variant_specs : {} ,
                                        var_intro : [ ],
                                        var_prodMeta : {} ,


                                    } 
                                ]  
                        } ,

                        variant_modal_setting :{
                            modal_id : '' ,
                            iziModal_settings : {

                            } ,
                            header : {
                                style : '' ,
                                bg_url : '' ,
                                default_title : '' ,
                                label : '' ,
                                closeBtn :  { }  ,
                                
                            } ,
                            default_topBand : {
                                default_bgUrl : '' ,
                                default_intro : '' ,
                            } ,
                            closeBtn : {
                                btnLabel : '' ,
                                btnStyle : '' ,
                                btnUrl : '' ,
                            } ,
                            closeFxn : { 
                                sequence : '' ,
                                close_fxn : function(e){

                                } , 
                            },
                            showMore : false ,
                        } ,
                        
                        banners: [ ] 
                
                } ;


            //  INIT FUNCTION

                // Sort $FRM

                // Sort $USER
    
                // Sort $CART

                // Sort Product Blocks

                // Save Page State



        // XXXXXXX  ABDICATED   XXXXXXXX ABDICATED    XXXXXXXX ABDICATED xxxxxxxxxxxxxxxxxx





                //  DEFINE ESSENTIAL PAGE-LOADNG FUNCTIONS  :
                
    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const loadPageBlock = function( $name  ) {
        // *** THIS IS TO BE CALLED BY THE PAGE-INIT FX, WHILE LOOPING THROUGH ALL PAGE-BLOCK ELEMENTS ON THE PAGE
        // *** IT CALLS OTHER METHODS TO LOAD THE VARIOUS PARTS OF NAMED PRODUCT-BLOCK
        // *** THE BLOCK'S BASIC STRUCTURE MUST HAVE BEEN ON THE PAGE AB-INITIO, PLUS THE PAGE-OBJECT
            // Track to the index block by $name

            // Set the Block's Shell Attributes

            // Set the Top- and Side- contents

            // (if there is one) :Take the pgObj[prodBlocks][$name][$blockFirstTab] and fill the subSxn structure in the block
                // loadTabSxn(this-tabData, $name , -1)

                // loadTabIcon ( -1 , this-tabData)

            // (else) : take _[$blockTabSet][0] and fill the subSxn structure in the block
                // loadTabSxn(this-tabData, $name, 0 )

                // loadTabIcon ( 0 , this-tabData)



    }



    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const loadTabIcon = function( $tabIndex , $BlockName ) {
        // *** THIS SIMPLY LOADS THE ALREADY EXISTING TAB ICONS BY FIXING IN Attributes and innerHtml 

        // Select by .sxn-block[data-sxn-name="$BlockName"] .tabIconSet .sxn-tabIcon[data-tabItemIndex="$tabIndex"]

        // (if $tabIndex < 0 ) Track to the Parent SubSxn by matching pgObj[prodBlocks][$BlockName][$blockFirstTab]

            // Fill the attributes and content :
                // data-tabItemIndex
                // this>a - data-tabLinkMarker  ( $tabIndex )
                // img  ($subSxnData['tabImageLink'])
                // label  (pgObj[prodBlocks][$BlockName][$blockFirstTab]['tabTitle'])


        // (if $tabIndex >= 0) Track to the Parent SubSxn by matching pgObj[prodBlocks][$BlockName][$blockTabSet][ $tabIndex ]
        
            // Fill the attributes and content :
                // data-tabItemIndex
                // this>a - data-tabLinkMarker  ( $tabIndex )
                // img  ($subSxnData['tabImageLink'])
                // label  (pgObj[prodBlocks][$BlockName][$blockTabSet][ $tabIndex ]['tabTitle'])
            
        
        
        

    }      ;  //. end of loadTabIcon function



    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Loads a SubSxn in place into the named Product Block /Section
    const loadTabSxn = function( $tabData  , $blockName ,  $tabIndex  ) {
        
        
        // Clone and SET TabSxn 
            // Clone TabSxn from Template

            // SET TabSxn Shell-Top
                // Shell Attributes
                    // data-subSxn-index = $tabIndex

                // TabSxn Title

                // TabSxn Tags

                // Configure Search Bar for TabSxn

            // Set TabSxn Items Block
                
                // Shell Attributes

                // Loop through .tabItemSet

                    // Clone ProductItem from Template  ( check Pr-Type)

                    // Set itemBox Attributes  ( check Pr-Type)

                    // Set item inner elements attributes

                        // Pr-Add-Action Overlay content   ( check Pr-Type)

                        // image Wrap A-Tag (if defined )   ( check Pr-Type)
                        
                        // Pr-img  ( check Pr-Type)

                        // pr-Title

                        // Pr-SKU  ( check Pr-Type)

                        // Pr-Price  ( check Pr-Type)

                        // **Pr-Other Labels

            // Set seeALL Button (if prescribed)
                // Button Attributes
                
                // TabSxn Item-Count
        

    }      ;  //. end of loadTabSxn function




    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>> Loads the Detail of a SIMPLE type Product, into the selected container (any)
    const loadProdDetail = function( $prItemData , $container ) {
        //*** TO BE CALLED INSIDE THE MODAL-OPENER, AFTER THE PRODUCT ITEM DATA IS CALLED FROM THE STORE AND THE CONTAINER SELECTED
        //*** CAN ALSO BE CALLED ANYWHERE ELSE THAT A PRODUCT-DETAIL TEMPLATE HAS BEEN PREVIOUSLY KEPT

            // Track The Product Details Header Container  ( .varMod-header )

            // Fill in the shell attributes  : data-  , backgrounf-image:url ,

            // Fill in the contents of the Header : 
                // .varMod-title

                // 

            //  Track the Product Details Container (.varMod-body)

            // Fill in the shell Attributes

            // Fill in the content element attributes 
                // div[data-varMod-topIntro] .html()

                // .img-full

                // .product-name

                // .new-price

                // Loop through  pgObj[$cart][cart_pr_items]  , till you find el[item_pr_id] == $prItemData[front_pr_id]

                // if found  {

               

                    // ??> .quantity input .val(el[item_pr_quantity])

                    // ??> input.item-subtotal .val(el[item_sub_value] )

                    //  ??> $container .product-content .addClass ('inCart')  >> to signify item is in cart

                    //  ??> $container .incart-label .show()  >> to signify item is in cart

                    // return  >> stop the loop there
                // } 

                // else (if not found ) {  >> leave default values
                    // .quantity input .val()

                    // input.item-subtotal

                //}

                // ??>  p[data-var-intro]  >> (if defined and not == '') 

                

    }      ;  //. end of loadProdDetail function




    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const loadVariantsStat = function( $parentData  ) {
        // *** THE STATIC VARIANTS TEMPLATE TO USE WILL BE DETERMINED BY $parentData['front_product_category'] 

        // Choose Template to use by $parentData['front_product_category']

        // Hide ALL OTHER Templates 

        // Set the selected template as the $container

        // Set the container attributes necessary

        // FOR Loop through the .variant-item  (using  $.each() ) 

            // Fill yhe current element's Container Attributes

            // Fill in the attributes and contents from each iterated instance
                // .img-full

                // .product-name

                // .new-price

                // Loop through  pgObj[$cart][cart_pr_items]  , till you find el[item_pr_id] == $prItemData[front_pr_id] or sku

                // if found  {

               

                    // ??> .quantity input .val(el[item_pr_quantity])

                    // ??> input.item-subtotal .val(el[item_sub_value] )

                    //  ??> $container .product-content .addClass ('inCart')  >> to signify item is in cart

                    //  ??> $container .incart-label .show()  >> to signify item is in cart

                    // return  >> stop the loop there
                // } 

                // else (if not found ) {  >> leave default values
                    // .quantity input .val()

                    // input.item-subtotal

                //}


    }      ;  //. end of loadVariantsStat function



    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const loadVariantsDyna = function( $varSetData ) {
        // *** THIS WILL WORK WITHIN THE SUCCESS FUNCTION - USING RESPONSE FROM AJAX CALL TO GET VARIANTS-SET
        
        // Track the varDyna container

        // Set the container attributes necessary

        // FOR Loop through the $varSetData[variantItems] 
            // Clone the Variant Item template within the container

            // Fill in the attributes and contents from each iterated instance
                // .img-full

                // .product-name

                // .new-price

                // Loop through  pgObj[$cart][cart_pr_items]  , till you find el[item_pr_id] == $prItemData[front_pr_id] or sku

                // if found  {

               

                    // ??> .quantity input .val(el[item_pr_quantity])

                    // ??> input.item-subtotal .val(el[item_sub_value] )

                    //  ??> $container .product-content .addClass ('inCart')  >> to signify item is in cart

                    //  ??> $container .incart-label .show()  >> to signify item is in cart

                    // return  >> stop the loop there
                // } 

                // else (if not found ) {  >> leave default values
                    // .quantity input .val()

                    // input.item-subtotal

                //}

                // ??>  p[data-var-intro]  >> (if defined and not == '')

        // >>>> DEAL WITH LONG VARIANTS' LISTS AND PAGINATION IN NEXT UPGRADE  <<<<<<<<<
        

    }      ;  //. end of loadVariantsDyna function





                //  DEFINE ESSENTIAL PRODUCT-RANGE-LOADNG FUNCTIONS  :

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const loadProductRange = function( $calling , $search = {} , $contSelector) {
        // *** THIS WILL WORK WITH SxnLoadModal as the $container by default container - JUST PASING THE AJAX PARAMS AND LOADING THE RESPONSE

            // Find the container : $('$contSelector') or pick the default 

            // Set General AJAX Params

            // SWITCH CASES OF $calling ( to set variable Ajax params) :

                // Set corresponding  AJAX Params ready

            // Make AJAX Call

            // Success : Load result into container

            // Error : Announce error

            // Done :


    }
                        




    

                //  DEFINE ESSENTIAL EVENT HANDLER FUNCTIONS  :

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>  To Load a Tab / SubSxn 
    $('a.sxn-tabLink').on('click' , function(ev){

        // Initiate

        // check if marked 'active' ? do nothing : proceed 

        // Track to the Indexed SubSxn (in same parent .sxn-block with data-sxn-name ) with the index = data-tabLinkMarker on the Target 

        // loadTabSxn ( subSxn , parent.data-sxn-name )

        // unmark all other tab icons then mark the index Tab Icon as 'active'


    } ) ;   //. end of sxn-tabLink.on(click)  function 






     


            






        
    
                                           


