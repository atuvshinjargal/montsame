<?php
class Form_AddForm extends Zend_Form{
	public function __construct($option =null){
		parent::__construct($option);
		$this->setName('add');
		//$this->setAttrib('enctype','multipart/form-data');
		
		$title= new Zend_Form_Element_Text('title');
		$title->setLabel('Title')
				->setRequired();
				
		$pdf=new Zend_Form_Element_File('pdf');
		$pdf->setLabel('Pdf file:')
			->setRequired();
		$pdf->setIsArray(true) ;
		$pdf->addValidator('Extension', false, 'jpg');
		$pdf->setAttrib('multiple','');
		$pdf->setValueDisabled(true);
		//$element = new Zend_Form_Element_File('image');
        //$element->setLabel('Picture:');
       // $element->addValidator('Count', false, 5);
       // $element->addValidator('Size', false, 2004800);
       // 
        //$element->setAttrib('multiple', 5);
        //$element->setRequired(true);
    
		$category=new Zend_Form_Element_Select('category');	
		$category->setLabel('Category')
				->setRequired();
		$categorys =new Admin_Model_Category();
		$cacat=$categorys->getCategorys();
		foreach ($cacat as $cat){
		$category->addMultiOption($cat['id'],$cat['name']);
		}
		
		$add=new Zend_Form_Element_Submit('Add');
		$add->setLabel('Add');
		
		$this->addElements(array($title,$pdf,$category,$add));
		$this->setMethod(post);
		$this->setAction(Zend_Controller_Front::getInstance()->getBaseUrl().'/admin/book/add');
	}
}