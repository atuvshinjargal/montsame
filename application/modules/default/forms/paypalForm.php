<?php
class Form_paypalForm extends Zend_Form{
	public function __construct($option =null){
		parent::__construct($option);
		$this->setName('paypal');
		$this->removeDecorator('DtDdWrapper');
		$this->removeDecorator('HtmlTag');
		$this->removeDecorator('Label');
		
		$itemname=new Zend_Form_Element_Hidden('itemname');
		$itemname->setValue('Product One');
		$itemname->removeDecorator('DtDdWrapper');
		$itemname->removeDecorator('HtmlTag');
		$itemname->removeDecorator('Label');
		
		$itemnumber=new Zend_Form_Element_Hidden('itemnumber');
		$itemnumber->setValue(1);
		$itemnumber->removeDecorator('DtDdWrapper');
		$itemnumber->removeDecorator('HtmlTag');
		$itemnumber->removeDecorator('Label');
		
		$itemprice=new Zend_Form_Element_Hidden('itemprice');
		$itemprice->setValue(10);
		$itemprice->removeDecorator('DtDdWrapper');
		$itemprice->removeDecorator('HtmlTag');
		$itemprice->removeDecorator('Label');
		
		$itemid=new Zend_Form_Element_Hidden('itemid');
		$itemid->setValue(10);
		$itemid->removeDecorator('DtDdWrapper');
		$itemid->removeDecorator('HtmlTag');
		$itemid->removeDecorator('Label');
		
		$itemQty =new Zend_Form_Element_Select('$itemQty');
		$itemQty->removeDecorator('DtDdWrapper');
		$itemQty->removeDecorator('HtmlTag');
		$itemQty->removeDecorator('Label');
		
		$submitbutt = new Zend_Form_Element_Submit('submitbutt');
		$submitbutt->setLabel('Buy it'); 
		$submitbutt->removeDecorator('DtDdWrapper');
		$submitbutt->removeDecorator('HtmlTag');
		$submitbutt->removeDecorator('Label');
		
		$this->addElements(array($itemname,$itemnumber,$itemid,$itemprice,$itemQty,$submitbutt));
		$this->setMethod(post);
		$this->setAction(Zend_Controller_Front::getInstance()->getBaseUrl().'/index/process');
	}
}