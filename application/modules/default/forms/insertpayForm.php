<?php
class Form_InsertpayForm extends Zend_Form{
	public function __construct($option =null){
		parent::__construct($option);
		$this->setName('Pay');
		$this->removeDecorator('DtDdWrapper');
		$this->removeDecorator('HtmlTag');
		$this->removeDecorator('Label');
		$username= new Zend_Form_Element_Text('pay');
		$username->setAttrib('class', 'input-medium search-query');
		$username->setLabel('Pay');
		
		$category=new Zend_Form_Element_Select('category');	
		$category->setLabel('Category')
				->setRequired();
		$categorys =new Admin_Model_Category();
		$cacat=$categorys->getCategorys();
		foreach ($cacat as $cat){
		$category->addMultiOption($cat['id'],$cat['name']);
		}
		$login=new Zend_Form_Element_Submit('Add');
		$login->removeDecorator('DtDdWrapper'); 
		$login->setAttrib('class', 'btn');
		$this->addElements(array($username,$category,$login));
		$this->setMethod(post);
		$this->setAction(Zend_Controller_Front::getInstance()->getBaseUrl().'/admin/users/list');
	}
}