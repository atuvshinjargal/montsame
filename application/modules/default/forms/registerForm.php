<?php
class Form_RegisterForm extends Zend_Form{
	public function __construct($option =null){
		parent::__construct($option);
		$this->setName('register');
		$this->setAttrib('class', 'form-horizontal');
		$username= new Zend_Form_Element_Text('username');
		$username->setLabel('Username: *')
				->setRequired();		
		$password= new Zend_Form_Element_Password('password');
		$password->setLabel('Password: *')
				->setRequired(true);
		$password->addFilter(new Zend_Filter_StringTrim())
    			->addValidator(new Zend_Validate_NotEmpty());
				
		$confirmpassword= new Zend_Form_Element_Password('confirmPassword');
		$confirmpassword->setLabel('Confirm Password: *')
				->setRequired(true);
		$confirmpassword->addValidator('StringLength', false, array(6,24))
            ->addFilter(new Zend_Filter_StringTrim())
    		->addValidator(new Zend_Validate_Identical($_POST['password']));		

		$firstname = new Zend_Form_Element_Text('firstname');
		$firstname->setLabel('First Name:')
				->setRequired(true);
		
		$lastname = new Zend_Form_Element_Text('lastname');
		$lastname->setLabel('Last Name:')
				->setRequired(true);
				
		$email = new Zend_Form_Element_Text('email');
		$email->setLabel('Email: *')
			->addFilters(array('StringTrim', 'StripTags'))
    		->addValidator('EmailAddress',  TRUE  )
				->setRequired(true);	
				
		$captca=new Zend_Form_Element_Captcha('captcha', array(
    'label' => "Please verify you're a human",
		'description' => '<div id="refreshcaptcha">Refresh</div>',
        'captcha' => array(
            'captcha' => 'Image',
            'font' => APPLICATION_PATH . '/../public/css/LeagueGothic/League_Gothic-webfont.ttf',
            'fontSize' => '24',
            'wordLen' => 6,
            'height' => '50',
            'width' => '150',
            'imgDir' => APPLICATION_PATH . '/../public/img/captcha/',
            'imgUrl' => Zend_Controller_Front::getInstance()->getBaseUrl().'/img/captcha/',
        )
    ));
    $captca->getDecorator('Description')->setOptions(array(
            'escape'        => false,
            'style'         => 'cursor: pointer; color: #ED1C24',
            'tag'           => 'div'
        ));

		
		$singup=new Zend_Form_Element_Submit('singup');
		$singup->setAttrib('class', 'btn');
		$singup->setLabel('Create my account')
				->setIgnore(true);;
		
		$this->addElements(array($username,$password,$confirmpassword,$firstname,$lastname,$email,$captca,$singup));
		$this->setMethod(post);
		$this->setAction(Zend_Controller_Front::getInstance()->getBaseUrl().'/autentication/signup');
	}
}