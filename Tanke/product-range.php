<?php

function wipeSpecChar($text) {  // REPLACES SPECIAL CHARS WITH EMPTY STRING - erase

            $t = $text;
            
            $specChars = array(
                '!' => '%21',    '"' => '%22',
                '#' => '%23',    '$' => '%24',    '%' => '%25',
                '&' => '%26',    '\'' => '%27',   '(' => '%28',
                ')' => '%29',    '*' => '%2A',    '+' => '%2B',
                ',' => '%2C',    '-' => '%2D',    '.' => '%2E',
                '/' => '%2F',    ':' => '%3A',    ';' => '%3B',
                '<' => '%3C',    '=' => '%3D',    '>' => '%3E',
                '?' => '%3F',    '@' => '%40',    '[' => '%5B',
                '\\' => '%5C',   ']' => '%5D',    '^' => '%5E',
                '_' => '%5F',    '`' => '%60',    '{' => '%7B',
                '|' => '%7C',    '}' => '%7D',    '~' => '%7E',
                ',' => '%E2%80%9A' //,  ' ' => '%20'
            );
            
            foreach ($specChars as $k => $v) {
                $t = str_replace($k, '' , $t);
            }
            
            return $t;
            }


function blankSpecChar($text) { // REPLACES SPECIAL CHARS WITH SPACE 

                $t = $text;
                
                $specChars = array(
                    '!' => '%21',    '"' => '%22',
                    '#' => '%23',    '$' => '%24',    '%' => '%25',
                    '&' => '%26',    '\'' => '%27',   '(' => '%28',
                    ')' => '%29',    '*' => '%2A',    '+' => '%2B',
                    ',' => '%2C',    '-' => '%2D',    '.' => '%2E',
                    '/' => '%2F',    ':' => '%3A',    ';' => '%3B',
                    '<' => '%3C',    '=' => '%3D',    '>' => '%3E',
                    '?' => '%3F',    '@' => '%40',    '[' => '%5B',
                    '\\' => '%5C',   ']' => '%5D',    '^' => '%5E',
                    '_' => '%5F',    '`' => '%60',    '{' => '%7B',
                    '|' => '%7C',    '}' => '%7D',    '~' => '%7E',
                    ',' => '%E2%80%9A' //,  ' ' => '%20'
                );
                
                foreach ($specChars as $k => $v) {
                    $t = str_replace($k, ' ' , $t);
                }
                
                return $t;
                }


function clean4DBsave ($data){
        // $data must be url decoded
            $data = trim( $data);
            
            $data = htmlspecialchars($data);
           // remove all sql injection aiding chars
           
                // urlencode for now
                $data = ( rawurlencode ($data) );

            return $data;   
}


function clean4DBsearch ($data){
    // $data must be url decoded
        $data = trim( $data);
        // remove all sql injection aiding chars
        $data = wipeSpecChar($data) ;

        return $data;   
}



function clean4link ($data){
    // $data must be url decoded
            $data = trim($data);
            // remove xss aiding chars

            // make safe for url
            $data = ( rawurlencode ($data) );
            
            return $data;   
}


function clean4page ($data){
    // $data must be url decoded
            $data = trim($data);
           // remove xss aiding chars

            
            return $data;   
}

function retrieve4RMsave ($data){
    
            $data = ( rawurldecode ($data) );

            $data = htmlspecialchars_decode ($data);    
            
            return $data;   
}


$goon = 1 ;

// Open Return Array
$ret = [] ;
// ['status''=> ,'data'=>   , 'count''=>  , 'pgName''=>   ]
$ret['status'] = '';
$ret['data'] = [] ;
$ret['count'] = 0 ;
$ret['pgnum'] = 0 ; 
$ret['pgName'] = '' ; 


while ($goon !== 0 )
{ // THE ENCAPSULATING WHILE



// Get open DB connect or return with failure report
// check ope DBcon or open one : CLOSE OFF & REPORT IF CONNECTION FAILS
if(!isset($con) ) { 
            
    $con =  mysqli_connect("localhost","vhixQ27deO4Y","pycWMzlbAksVtRK2","kwa-uwc-wp-stVVw7wS") ;

        if (mysqli_connect_errno()) {

        $ret['status'] = 'Failed to connect to Data Base: ' . mysqli_connect_error();
        $ret['data'] = [] ;
        $ret['count'] = 0 ;
        $ret['pgnum'] = 0 ; 
        $ret['pgName'] = "FAILED - " . $_GET['move'] ;
        

      //  json_encode($ret ) ; 
     // $drop = ( json_encode($ret ) ) ;
     //  Echo 'Unable to connect.<br> Ensure you are connected to the internet and try again.<br> <span id="'  . $ret['pgName'] . '"  style="display:none;" ></span> ' ;

        $goon = 0 ;   // This will QUIT THE SCRIPT
        break ;
       
        
        }

}


// ?move=search_range&categ=[ categID:CategName eg 1:COSMETICS  ]&schTerm=searchword&schFields=title|categ|maker&pgSz=48&storeName=storeElemID  
// ?move=see_all_range&categ=[ categID:CategName eg 1:COSMETICS  ]&schTerm=searchword&schFields=title|categ|maker&pgSz=48&storeName=storeElemID

// Get the params for fetch and load : move  categ  schTerm  schFields

    if ( isset ( $_GET['move'] ) &&  ( $_GET['move']  == 'search_range' || $_GET['move']  == 'see_all_range') )
    {

        $tmark = time() ;

        $categ    =  urldecode( $_POST['categ']  ) ;
        $ctgSpl = explode (':' ,$categ ) ;
            // categ id
            $catID = $ctgSpl [0] ;
            // categ name$ctgSpl
            $catNM = $ctgSpl [1] ;
            $catNM = clean4DBsearch($catNM) ;

            
        $schTerm    =  clean4DBsearch ( $_POST['schTerm']  )  ;


        if (isset ($_POST['schFields']) && $_POST['schFields'] !== ''  && $_POST['schFields'] !== NULL )
        {
            $schFields  =  $_POST['schFields']  ;
                // get array of fields
            $schSpl = explode ('|' , $schFields ) ;
                // clean each one for search 
            $cleanFields = array_map( "clean4DBsearch" , $schSpl ) ;
            $schFdNum = count( $schSpl ) ; // lets Know how deep we search : title >> category >> maker
        }
        else{ 
            // Set the search width to the widest 
            $schFdNum = 3 ;
        }

        // PAGE SIZE LIMIT 
        if (isset ($_POST['pgSz']) && $_POST['pgSz'] !== 0  && $_POST['pgSz'] !== '' )
        {
            $pglim = intval($_POST['pgSz']) ;
        }
        else{  $pglim = 48 ;} // DEFAULT PAGE LIMIT 

        //  STORE ELEMENT NAME / ID
        if (isset ($_POST['storeName']) && $_POST['storeName'] !== ''  && $_POST['storeName'] !== NULL )
        {
            $pgStrID = $_POST['storeName']  . $tmark ;
        }
        elseif (isset($_GET['move'])){
            // Deault set if not stated in Ajax POST data
            $pgStrID = $_GET['move']   . $tmark ;
        }
        else{$pgStrID = 'mySite'   . $tmark ; }

       
        

    }
    else{
        $ret ['status'] = 'No Request Info' ;
        $ret['data'] = [] ;
        $ret ['count'] = 0 ;
        $ret ['pgnum'] = 0 ; 
        $ret['pgName'] = "FAILED SEARCH : Please Try Again. "   ;

        $goon = 0 ;   // This will QUIT THE SCRIPT
        break ;

       
    }

   
    



// Build query
$schQ = "SELECT `smart_id` , `sku`, `s_num` ,`p_title`, `maker` , CONCAT(`sav_img_link`, `sav_img_format`) AS 'img_url' ,`on_show_price`  , `wp_id` , `wp_categs`  ,  `wp_intro`  , `wp_page_link`   FROM `prhv` WHERE `wp_id` <> 0 " ;


        // if Category is specified (likely)
        if ( isset ( $catNM )  && $catNM !== 'all' ){
            $schQ .= " AND  `wp_categs` LIKE '%" . $catNM . "%' "  ;
        }



        // if Title field is to  be searched
        //if ($schFdNum >= 1 && isset ($cleanFields [0]) && $cleanFields [0] !== '' )
        if ($schFdNum >= 1  ){
            $schQ .= " OR  `p_title` LIKE '%" . $schTerm . "%' "  ;
        }

        // if Category field is to  be searched
        //if ($schFdNum >= 2 && isset ($cleanFields [1]) && $cleanFields [1] !== '' )
        if ($schFdNum >= 2  ){
            $schQ .= " OR  `wp_categs` LIKE '%" . $schTerm . "%' "  ;
        }


        // if Maker field is to  be searched
        //if ($schFdNum >= 3 && isset ($cleanFields [2]) && $cleanFields [2] !== '' )
        if ($schFdNum >= 3 ){
            $schQ .= " OR  `maker` LIKE '%" . $schTerm . "%' "  ;
        }



        // ORDER RESULT 
        // $sql .= " ORDER BY `smart_id` " ;

// Run query

// If result
if ($result = mysqli_query($con,$schQ)){

            //$drum = mysqli_fetch_all ($result , MYSQLI_ASSOC) ;

            // Pages block
            $pages = array( ) ;
            // Pages block index
            $pgN = 0 ;
            // Fetch Rows Iterator
            $ix = 0 ;
            // page length
            $pgLim = $pglim ;

            // $COUNT Total
            $total = 0 ;

        

        // while ( !empty(mysqli_fetch_assoc ( $result)) && mysqli_fetch_assoc ( $result) !== NULL )  
        /**///  while ($drum[$total] !== NULL)
        while ( $row = mysqli_fetch_assoc ( $result))                    
            {
                // $row = mysqli_fetch_assoc ( $result); 

            If($ix < $pgLim)
            {
                

                $ret ['data'][$pgN] [$ix] = $row ;

                $ix += 1 ;
            }
            else
            {
                $pgN += 1 ;
                $ix = 0 ;

                
            $ret ['data'][$pgN] [$ix] = $row ;
                $ix += 1 ;
            }

            $total += 1 ;

            } // END OF LOOP : All query results fetched in Pages
            

            $ret ['status'] = 'Search SUCCESS' ;
        // $ret ['data'] = $pages ;
        //$ret ['data'] = $pages ;                     
            $ret['count'] = $total ;
            
            $ret  ['pgnum'] = $pgN + 1 ;   
            $ret['pgName'] = "RESULT RANGE - " . ucfirst ( $schTerm ) . "In $catNM "  ;  
             $ret['storeID'] = $pgStrID  ; 
            
                
            
            mysqli_free_result ($result) ;
     
 }
 else{ 
     $ret ['status'] = 'Search Failed' ;
     $ret ['data'] = [] ;
     $ret ['count'] = 0 ;
     $ret  ['pgnum'] = 0 ; 
     $ret['pgName'] = "FAILED - " . $_GET['move'] ;

     $goon = 0 ;   // This will QUIT THE SCRIPT
     break ;

 } 


  $goon = 0 ;   

  break ;  // This will QUIT THE WHILE LOOP AFTER JUST ONE RUN


} // THE ENCAPSULATING WHILE


// Get results and put in page storage
$set = json_encode($ret )  ;    // To be placed inside storage tag


?>



<style>

        .add-to-cart a i{
            color: black !important;
            font-size: 2em;
            font-weight: 500;
        }

</style>

<div class="contact-with-map smartGrab">
                    <div class="contact-map grabLoad">
                
                
                        <div class="container sample" style="display: none;">

                            <div class="pagin pgtop text-center" >
                        
                                <span class="pg-lk" data-pgx=""> 1 </span>|
                                <span class="pg-lk" data-pgx="" > 2 </span>|
                                <span class="pg-lk" data-pgx=""> 3 </span>|
                    
                            </div>

                            <hr>

                            <div class="row">


                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox pxSample" data-item-price="1000">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                        

                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt=""  data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                        
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"  disabled  type="text"  >
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                
                                
                
                                
                                
                
                
                
                            </div>

                            <hr>

                            <div class="pagin pgbtm text-center" >
                                
                                <span class="pg-lk" data-pgx=""> 1 </span>|
                                <span class="pg-lk" data-pgx="" > 2 </span>|
                                <span class="pg-lk" data-pgx=""> 3 </span>|
                            
                            </div>

                            <hr>



                        </div>
                
                
                
                
                    <!--  <iframe class="contact-map-size"  id="getPage" src="http://localhost/ammc/kwabaz-bazaar-front-sample-01.php" allowfullscreen="" loading="lazy"></iframe>-->
                
                
                
                        <div class="container phold">
                            <div class="pagin text-center" >
                                
                                    <span class="pg-lk" data-pgx=""> 1 |</span>
                                    <span class="pg-lk" data-pgx=""> 2 |</span>
                                    <span class="pg-lk" data-pgx=""> 3 |</span>
                                
                            </div>

                            <hr>

                            <div class="row">
                
                                
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="1000">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                        

                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt=""  data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                        
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"  disabled  type="text"  >
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="2000">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="2500">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="6000">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="4000">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="1200">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="2800">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="9400">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="2500">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="6000">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="4000">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="1200">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="2800">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 pt-4 itemBox" data-item-price="9400">
                                    <div class="product-item seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                        <div class="product-img img-zoom-effect">
                                            <img class="img-full svImg seeMod" src="../assetsecm/images/prhv/52336331457_360x.png?v=1685243586" alt="" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"    >
                                            
                                            <div class="product-add-action pname seeMod"   data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"   style=" color:#000">
                                                <p style="text-align: center; " class="pname">SAMPLE PRODUCT</p>
                                                
                                            </div>
                                        </div>
                                        <div class="product-content prEnt seeMod" data-buttonMarker = "Prce-1 Section" data-linkMod="#prDetailModal"  >
                                           <!-- <a class="rmvItem"  href="javascript:void(0)" style="padding: 0em 0.6em; margin: 0em 1em; float: left; font-size: 1.0em; color: #ed3237;">
                                                <i class="pe-7s-close-circle"></i> Remove
                                            </a>-->
                                            
                                            <p class="pTitle"> Long long long long long Product Title Here</p>
                                            <p class="skuNum"> SKU here</p>


                                            <div class="price-box pb-1">
                                                <span class="new-price">&#8358 1,000</span>
                                            </div>
                                            <div class="rating-box pb-1">
                                                <ul class="quantity-with-btn pb-1">
                                                    <li class="quantity">
                                                        <div class="cart-plus-minus lsx">
                                                            <input class="cart-plus-minus-box" value="1"   disabled   type="text">
                                                        </div>
                                                    </li>
                                                    
                                                   <!-- --><li class="item-subtotal">
                                                        <input class="item-subtotal" value="00.00"  disabled  type="text">                               
                                                    </li>
                                                    
                
                                                    <li class="add-to-cart">
                                                        <a data-var-cartAdd="$varID" class="btn btn-primary btn-secondary-hover rounded-0" href="javascript:void(0)" ><i class="pe-7s-cart"></i></a>
                                                    </li>
                                                </ul>
                                            </div>




                                            <!--<input type="text" class="prEnt entTitle" placeholder="Product Title">
                                            <input type="number" class="prEnt entPrice" placeholder="Unit Price" >
                                            <textarea class="prEnt entSpecs" placeholder="Product Specifications :  Paste the template here and fill in the values ." ></textarea>-->
                                            <!--<br>
                                            <a class="prEnt sendProd" href="javascript:void(0)" >Submit Now</a>-->
                                            
                                        </div>
                                    </div>
                                </div>







                
                            </div>
                            <hr>
                            <div class="pagin text-center" >
                                
                                    <span class="pg-lk" data-pgx=""> 1 |</span>
                                    <span class="pg-lk" data-pgx=""> 2 |</span>
                                    <span class="pg-lk" data-pgx=""> 3 |</span>
                                
                            </div>
                            <hr>
                            

                        </div>
                
                
                
                    </div>
                    
                </div> 

                <span class="rangeStore"  id="<?php echo $pgStrID ; ?>" style="display: none !important;"   > <?php echo $set ; ?></span>


                <script>


                        /*----------------------------------------*/
                        /*  QTY Button
                        /*----------------------------------------*/
                        $('.cart-plus-minus.lsx').append(
                            '<div class="dec qtybutton"><i class="fa fa-minus"></i></div><div class="inc qtybutton"><i class="fa fa-plus"></i></div>'
                        );

                        // Set the value in Subtotal  :
                        var svi = $('input.item-subtotal', '#sxn-loadMod') ;

                        svi.map(function(ix, el ){
                            let pbx = $(el).parents('.itemBox') ;
                            let qt = $('.cart-plus-minus-box' , pbx).val() ;
                            
                            // let upr =  JSON.parse( pbx.attr('data-var-itemMeta')).var_price ;
                            let upr =  pbx.attr('data-item-price') ;

                           // console.log (pbx.attr('class')) ;

                            $(el).val(qt*upr) ;       

                        } ) ;



                           // Change QUANTITY  PLUS  Recalculate SUBTOTAL when  -EVENT- Quantity changed:
                            
                           $('.qtybutton',  '#sxn-loadMod').on('click', function () {
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
                                let pbx = $button.parents('.itemBox') ;

                                let upr =  pbx.attr('data-item-price') ;

                                $('input.item-subtotal',pbx).val($button.parent().find('input').val()*upr) ;



                            });









                
                            



                
                
                
                
                </script>






<?php



?>