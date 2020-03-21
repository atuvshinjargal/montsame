<?php

class AutenticationController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
    }
	public function signupAction()
    {
 
    	$users =new Model_User();
    	$request=$this->getRequest();
    	$regform =new Form_RegisterForm();
    	if ($request->isPost()){
    		if($regform->isValid($this->_request->getPost())){
    			$data = $regform->getValues();
    		if($data['password'] != $data['confirmPassword']){
                    $this->view->errorMessage = "Password and confirm password don't match.";
                    return;
                }
            if($users->checkUnique($data['username'])){
                    $this->view->errorMessage = "Name already taken. Please choose      another one.";
                    return;
                }
                unset($data['confirmPassword']);
                unset($data['captcha']);
                $data['date']=new Zend_Db_Expr('NOW()');
                $data['password']=md5($data['password']);
                $data['role']='users';
                $users->insert($data);
                $this->view->success=1;
    		}
    	}
    	$this->view->regform=$regform;
    }
    public function loginAction(){
    	$this->view->title='Нэвтрэх';
    
    	if (Zend_Auth::getInstance()->hasIdentity()){
    		$this->_redirect('index/index');
    	}
    	$request=$this->getRequest();
    	$form =new Form_LoginForm();
    	if ($request->isPost()){
    		if($form->isValid($this->_request->getPost())){
	    		$AuthAdapter=$this->getAuthAdapter();
	    		$usename=$form->getValue('username');
	    		$password=$form->getValue('password');
	    		$AuthAdapter->setIdentity($usename)
	    					->setCredential(md5($password));
	    	
	    		$auth = Zend_Auth::getInstance();
	    		$result=$auth->authenticate($AuthAdapter);
	    	
	    		if ($result->isValid()){
	    			$identity =$AuthAdapter->getResultRowObject();
	    			$authStorage= $auth->getStorage();
	    			$authStorage->write($identity);
	    			$paer=new Admin_Model_Pay();
					$user=new Model_User();
        			if ($paer->isPayed(Zend_Auth::getInstance()->getIdentity()->user_id)==0){
        				$this->_redirect('index/pay');
        			}
	    			$this->_redirect('index/index');
	    		}
	    		else{
	    			$this->view->errorMessage ='username or password wrong';
	    		}
    		}
    			
    	}
    	
    	$this->view->form=$form;
    	
    	
        // action body
    }

    public function logoutAction()
    {
    	Zend_Auth::getInstance()->clearIdentity();
    	$this->_redirect('index/index');
        // action body
    }
    private function getAuthAdapter(){
    $AuthAdapter=new Zend_Auth_Adapter_DbTable(Zend_Db_Table::getDefaultAdapter());
    $AuthAdapter->setTablename('users')
    			->setIdentityColumn('username')
    			->setCredentialColumn('password');
   return $AuthAdapter;
    }
	public function refreshAction()
	{
	    $form = new Form_RegisterForm();
	    $captcha = $form->getElement('captcha')->getCaptcha();
	
	    $data = array();
	
	    $data['id']  = $captcha->generate();
	    $data['src'] = $captcha->getImgUrl() .
	                   $captcha->getId() .
	                   $captcha->getSuffix();
	
	   $this->_helper->json($data);
	}
}





