<?php
class Form_SearchForm extends Zend_Form{
	public function __construct($option =null){
		parent::__construct($option);
		$this->setName('login');
		$this->setAttrib('class','form-search');
		$this->removeDecorator('DtDdWrapper');
		$this->removeDecorator('HtmlTag');
		$this->removeDecorator('Label');
		$username= new Zend_Form_Element_Text('search');
		$username->setAttrib('class', 'input-medium search-query');
		$username->removeDecorator('DtDdWrapper');
		$username->removeDecorator('Label');
		$username->removeDecorator('HtmlTag');
		$login=new Zend_Form_Element_Submit('Search');
		$login->removeDecorator('DtDdWrapper'); 
		$login->setAttrib('class', 'btn');
		$this->addElements(array($username,$login));
		$this->setMethod(post);
		$this->setAction(Zend_Controller_Front::getInstance()->getBaseUrl().'/admin/users/list');
	}
}