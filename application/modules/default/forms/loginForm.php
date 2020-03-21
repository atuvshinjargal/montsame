<?php
class Form_LoginForm extends Zend_Form{
	public function __construct($option =null){
		parent::__construct($option);
		$this->setName('register');
		$username= new Zend_Form_Element_Text('username');
		$username->setLabel('Username')
				->setRequired();
		$password= new Zend_Form_Element_Password('password');
		$password->setLabel('Password')
				->setRequired(true);
				
		$captca=new Zend_Form_Element_Captcha('captcha', array(
    'label' => "Please verify you're a human",
		'description' => '<div id="refreshcaptcha">Refresh</div>',
		'required'=>true,
        'captcha' => array(
            'captcha' => 'Image',
            'font' => APPLICATION_PATH . '/../public/css/LeagueGothic/League_Gothic-webfont.ttf',
            'fontSize' => '24',
            'wordLen' => 6,
            'height' => '50',
            'width' => '150',
            'imgDir' => APPLICATION_PATH . '/../public/img/captcha/',
            'imgUrl' => Zend_Controller_Front::getInstance()->getBaseUrl().'/img/captcha/',
		'gcFreq'=>50,
        'expiration' => 300
        )
    ));
    $captca->getDecorator('Description')->setOptions(array(
            'escape'        => false,
            'style'         => 'cursor: pointer; color: #ED1C24',
            'tag'           => 'div'
        ));
				
		$login=new Zend_Form_Element_Submit('login');
		$login->setAttrib('class', 'btn');
		$login->setLabel('Login');
		$this->addElements(array($username,$password,$captca,$login));
		$this->setMethod(post);
		$this->setAction(Zend_Controller_Front::getInstance()->getBaseUrl().'/autentication/login');
	}
}