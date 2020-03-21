<?php

class IndexController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
    	$this->view->headTitle('index page','PREPEND');
    		$this->_redirect('/library/books/list');
        // action body
    }
	public function payAction()
    {
    	$categorys= new Admin_Model_Category();
    	$cates=$categorys->getCategorys();
    	$form=array();
    	foreach ($cates as $cate){
    		$tempform['form']=new Form_paypalForm();
    		$tempform['form']->getElement('itemname')->setValue($cate['name']);
    		$tempform['form']->getElement('itemprice')->setValue($cate['price']);
    		$tempform['form']->getElement('itemid')->setValue($cate['id']);
    		for($i=1;$i<6;$i++){
    			$tempform['form']->getElement('itemQty')->addMultiOption($i,$i.' year'.' ('.$i*$cate['price'].' USD)');;
    		}
    		$tempform['description']=$cate['description'];
    		$tempform['name']=$cate['name'];
			array_push($form,$tempform);
    	}
    	$this->view->form=$form;
		
    }
    public function mypayAction(){ 
       	$pays= new Admin_Model_Pay();
    	$data=$pays->getpays(Zend_Auth::getInstance()->getIdentity()->user_id);
    	$paginator=new Zend_Paginator(new Zend_Paginator_Adapter_DbSelect($data));
    	$paginator->setItemCountPerPage(10)
    			->setCurrentPageNumber($this->_getParam('page',1));
       $this->view->pays=$paginator;
    }
    public function processAction(){
    session_start();
    $PayPalMode 			= 'sandbox'; // sandbox or live
		$PayPalApiUsername 		= 'ganaa.0826_api1.yahoo.com'; //PayPal API Username
		$PayPalApiPassword 		= '1368181852'; //Paypal API password
		$PayPalApiSignature 	= 'AQU0e5vuZCvSg-XJploSa.sGUDlpAKm1nYOeHzMd3FDNDBLCYDKLgTXK'; //Paypal API Signature
		$PayPalCurrencyCode 	= 'USD'; //Paypal Currency Code
		$PayPalReturnURL 		=  'http://localhost'.Zend_Controller_Front::getInstance()->getBaseUrl().'/index/process/'; //Point to process.php page
		$PayPalCancelURL 		= 'http://localhost/paypal-express-checkout/cancel_url.php'; //Cancel URL if user clicks cancel
    	
if($_POST) //Post Data received from product list page.
{
	//Mainly we need 4 variables from an item, Item Name, Item Price, Item Number and Item Quantity.
	$ItemName = $_POST["itemname"]; //Item Name
	$ItemPrice = $_POST["itemprice"]; //Item Price
	$ItemNumber = $_POST["itemnumber"]; //Item Number
	$ItemId =$_POST['itemid'];
	$ItemQty = $_POST["itemQty"]; // Item Quantity
	$ItemTotalPrice = ($ItemPrice*$ItemQty); //(Item Price x Quantity = Total) Get total amount of product; 
	print_r($ItemTotalPrice);
	//Data to be sent to paypal
	$padata = 	'&CURRENCYCODE='.urlencode($PayPalCurrencyCode).
				'&PAYMENTACTION=Sale'.
				'&ALLOWNOTE=1'.
				'&PAYMENTREQUEST_0_CURRENCYCODE='.urlencode($PayPalCurrencyCode).
				'&PAYMENTREQUEST_0_AMT='.urlencode($ItemTotalPrice).
				'&PAYMENTREQUEST_0_ITEMAMT='.urlencode($ItemTotalPrice). 
				'&L_PAYMENTREQUEST_0_QTY0='. urlencode($ItemQty).
				'&L_PAYMENTREQUEST_0_AMT0='.urlencode($ItemPrice).
				'&L_PAYMENTREQUEST_0_NAME0='.urlencode($ItemName).
				'&L_PAYMENTREQUEST_0_NUMBER0='.urlencode($ItemNumber).
				'&AMT='.urlencode($ItemTotalPrice).				
				'&RETURNURL='.urlencode($PayPalReturnURL ).
				'&CANCELURL='.urlencode($PayPalCancelURL);	
		
		//We need to execute the "SetExpressCheckOut" method to obtain paypal token
		$paypal= new Model_MyPayPal();
		$httpParsedResponseAr = $paypal->PPHttpPost('SetExpressCheckout', $padata, $PayPalApiUsername, $PayPalApiPassword, $PayPalApiSignature, $PayPalMode);
		
		//Respond according to message we receive from Paypal
		if("SUCCESS" == strtoupper($httpParsedResponseAr["ACK"]) || "SUCCESSWITHWARNING" == strtoupper($httpParsedResponseAr["ACK"]))
		{
					
				// If successful set some session variable we need later when user is redirected back to page from paypal. 
				$_SESSION['itemprice'] =  $ItemPrice;
				$_SESSION['totalamount'] = $ItemTotalPrice;
				$_SESSION['itemName'] =  $ItemName;
				$_SESSION['itemNo'] =  $ItemNumber;
				$_SESSION['itemQTY'] =  $ItemQty;
				$_SESSION['itemId']=$ItemId;
				
				if($PayPalMode=='sandbox')
				{
					$paypalmode 	=	'.sandbox';
				}
				else
				{
					$paypalmode 	=	'';
				}
				//Redirect user to PayPal store with Token received.
			 	$paypalurl ='https://www'.$paypalmode.'.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token='.$httpParsedResponseAr["TOKEN"].'';
				header('Location: '.$paypalurl);
			 
		}else{
			//Show error message
			echo '<div style="color:red"><b>Error : </b>'.urldecode($httpParsedResponseAr["L_LONGMESSAGE0"]).'</div>';
			echo '<pre>';
			print_r($httpParsedResponseAr);
			echo '</pre>';
		}

}

//Paypal redirects back to this page using ReturnURL, We should receive TOKEN and Payer ID
if(isset($_GET["token"]) && isset($_GET["PayerID"]))
{
	//we will be using these two variables to execute the "DoExpressCheckoutPayment"
	//Note: we haven't received any payment yet.
	
	$token = $_GET["token"];
	$playerid = $_GET["PayerID"];
	
	//get session variables
	$ItemPrice 		= $_SESSION['itemprice'];
	$ItemTotalPrice = $_SESSION['totalamount'];
	$ItemName 		= $_SESSION['itemName'];
	$ItemNumber 	= $_SESSION['itemNo'];
	$ItemQTY 		=$_SESSION['itemQTY'];
	$ItemId=$_SESSION['itemId'];
	
	$padata = 	'&TOKEN='.urlencode($token).
						'&PAYERID='.urlencode($playerid).
						'&PAYMENTACTION='.urlencode("SALE").
						'&AMT='.urlencode($ItemTotalPrice).
						'&CURRENCYCODE='.urlencode($PayPalCurrencyCode);
	
	//We need to execute the "DoExpressCheckoutPayment" at this point to Receive payment from user.
	$paypal= new Model_MyPayPal();
	$httpParsedResponseAr = $paypal->PPHttpPost('DoExpressCheckoutPayment', $padata, $PayPalApiUsername, $PayPalApiPassword, $PayPalApiSignature, $PayPalMode);
	
	//Check if everything went ok..
	if("SUCCESS" == strtoupper($httpParsedResponseAr["ACK"]) || "SUCCESSWITHWARNING" == strtoupper($httpParsedResponseAr["ACK"])) 
	{
			echo '<h2>Success</h2>';
			echo 'Your Transaction ID :'.urldecode($httpParsedResponseAr["TRANSACTIONID"]);
			
				/*
				//Sometimes Payment are kept pending even when transaction is complete. 
				//May be because of Currency change, or user choose to review each payment etc.
				//hence we need to notify user about it and ask him manually approve the transiction
				*/
				
				if('Completed' == $httpParsedResponseAr["PAYMENTSTATUS"])
				{
					echo '<div style="color:green">Payment Received! Your product will be sent to you very soon!</div>';
					echo 'Please <a href="'.Zend_Controller_Front::getInstance()->getBaseUrl().'/index/mypay">check..</a>';
				}
				elseif('Pending' == $httpParsedResponseAr["PAYMENTSTATUS"])
				{
					echo '<div style="color:red">Transaction Complete, but payment is still pending! You need to manually authorize this payment in your <a target="_new" href="http://www.paypal.com">Paypal Account</a></div>';
					echo 'Please <a href="'.Zend_Controller_Front::getInstance()->getBaseUrl().'/index/mypay">check..</a>';   	
				}
			

				$transactionID = urlencode($httpParsedResponseAr["TRANSACTIONID"]);
				$nvpStr = "&TRANSACTIONID=".$transactionID;
				$paypal= new Model_MyPayPal();
				$httpParsedResponseAr = $paypal->PPHttpPost('GetTransactionDetails', $nvpStr, $PayPalApiUsername, $PayPalApiPassword, $PayPalApiSignature, $PayPalMode);

				if("SUCCESS" == strtoupper($httpParsedResponseAr["ACK"]) || "SUCCESSWITHWARNING" == strtoupper($httpParsedResponseAr["ACK"])) {
					$tr = new Model_Transaction();
					$pay = new Admin_Model_Pay();
					$data= $httpParsedResponseAr;
						unset($data['ADDRESSOWNER']); 
						unset($data['ADDRESSSTATUS']); 
						unset($data['ACK']); 
						unset($data['VERSION']); 
						unset($data['BUILD']); 
						unset($data['TRANSACTIONTYPE']);
						unset($data['PAYMENTTYPE']);
						unset($data['PAYMENTSTATUS']);
						unset($data['PENDINGREASON']);
						unset($data['REASONCODE']);
						unset($data['PROTECTIONELIGIBILITY']);
						unset($data['PROTECTIONELIGIBILITYTYPE']);
						$data['EMAIL']=rawurldecode($data['EMAIL']);
						$data['RECEIVEREMAIL']=rawurldecode($data['RECEIVEREMAIL']);
						$data['SHIPTONAME']=rawurldecode($data['SHIPTONAME']);
						$data['SHIPTOSTREET']=rawurldecode($data['SHIPTOSTREET']);
						$data['SHIPTOCOUNTRYNAME']=rawurldecode($data['SHIPTOCOUNTRYNAME']);
						$data['SHIPTOCITY']=rawurldecode($data['SHIPTOCITY']);
						$data['TIMESTAMP']=rawurldecode($data['TIMESTAMP']);
						$data['ORDERTIME']=rawurldecode($data['ORDERTIME']);
						$data['AMT']=rawurldecode($data['AMT']);
						$data['TIMESTAMP']=str_replace(array('T','Z'), ' ',$data['TIMESTAMP']);
						$data['ORDERTIME']=str_replace(array('T','Z'), ' ',$data['ORDERTIME']);
					$tr->insertTransaction($data);
					$category= new Admin_Model_Category();
					$cat=$category->getCategory($ItemId);
					$payment= new Admin_Model_Pay();
					$catLast=$payment->getCategoryLast(Zend_Auth::getInstance()->getIdentity()->user_id,$ItemId);
					$starttime=Zend_Date::now()->toString('YYYY-MM-dd');
					if (strtotime(Zend_Date::now()->toString('YYYY-MM-dd'))<strtotime($catLast['finisdate'])){
						$starttime=$catLast['finisdate'];
					}		
					$finisdate=date('Y-m-d',strtotime('+'.($data['AMT']/$cat['price']).' year',strtotime($starttime)));
					$pay->insertpay(array('pay'=>$data['AMT'],'startdate'=>$starttime,'finisdate'=>$finisdate,'tr_id'=>$data['TRANSACTIONID'],'user_id'=>Zend_Auth::getInstance()->getIdentity()->user_id,'category_id'=>$ItemId,'paydate'=>new Zend_Db_Expr('NOW()')));
				} else  {
					echo '<div style="color:red"><b>GetTransactionDetails failed:</b>'.urldecode($httpParsedResponseAr["L_LONGMESSAGE0"]).'</div>';
					echo 'Please <a href="'.Zend_Controller_Front::getInstance()->getBaseUrl().'/index/pay">try again..</a>';   	

				}
	
	}else{
			echo '<div style="color:red"><b>Error : </b>'.urldecode($httpParsedResponseAr["L_LONGMESSAGE0"]).'</div>';
			echo 'Please <a href="'.Zend_Controller_Front::getInstance()->getBaseUrl().'/index/pay">try again..</a>';   	
		}
}
    }
    public function editAction()
    {
        // action body
    }


}



