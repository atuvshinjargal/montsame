<?php

class Admin_UsersController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
    }

    public function listAction()
    {
    	$request=$this->getRequest();
    	$search='';
       $users= new Model_User();
       $form= new Form_SearchForm();
    	$this->view->search=$form;
       if ($request->isPost()){
    		if($form->isValid($this->_request->getPost())){
    			$search=$form->getValue('search');
    		}
       }
       $data=$users->getUsers($search.'%');
       $paginator=new Zend_Paginator(new Zend_Paginator_Adapter_DbSelect($data));
    	$paginator->setItemCountPerPage(10)
    			->setCurrentPageNumber($this->_getParam('page',1));
       $this->view->data=$paginator;
    }
    public function payAction()
    {
    	$pays= new Admin_Model_Pay();
    	$data=$pays->getpays($this->_getParam('id',1));
    	$paginator=new Zend_Paginator(new Zend_Paginator_Adapter_DbSelect($data));
    	$paginator->setItemCountPerPage(10)
    			->setCurrentPageNumber($this->_getParam('page',1));
       $this->view->pays=$paginator;
    }
    public function editAction()
    {
	    	$user =new Model_User();
	    	$userdata=$user->getUser($this->_getParam('id',1));
	    	$request=$this->getRequest();
	    	$form=new Form_RegisterForm();
	    	$id=new Zend_Form_Element_Hidden('id');
	    	$id->setValue($this->_getParam('id',1));
	    	$form->addElement($id);
	    	$form->getElement('username')->setValue($userdata[0]['username']);
	    	$form->getElement('firstname')->setValue($userdata[0]['firstname']);
	    	$form->getElement('lastname')->setValue($userdata[0]['lastname']);
	    	$form->getElement('email')->setValue($userdata[0]['email']);
	    	$form->getElement('singup')->setLabel('Ok');
	    	$form->removeElement('captcha');
	    	$form->removeElement('password');
	    	$form->removeElement('confirmPassword');
	    	$form->setAction(Zend_Controller_Front::getInstance()->getBaseUrl().'/admin/users/edit');
    		if ($request->isPost()){
    			if($form->isValid($this->_request->getPost())){
    				$data = $form->getValues();
    				$idp=$data['id'];
    				unset($data['id']);
    				$user->updateUser($data, $idp);
    				$this->view->message='complete..';
    			}
    		}
	    	$this->view->form=$form;
	    	
	    	
    }
	public function deleteAction()
    {
    	$user =new Model_User();
    	$user->deleteUser($this->_getParam('id',1));
    	$pays=new Admin_Model_Pay();
    	$pays->deletePays($this->_getParam('id',1));
    	$this->_redirect('admin/users/list');
    }
    public function paymentAction(){
    	$request=$this->getRequest();
    	$form= new Form_SearchForm();
    	$form->setAction(Zend_Controller_Front::getInstance()->getBaseUrl().'/admin/users/payment');
    	$this->view->search=$form;
       if ($request->isPost()){
    		if($form->isValid($this->_request->getPost())){
    			$search=$form->getValue('search');
    		}
       }
    	$trans= new Model_Transaction();
    	$paginator=new Zend_Paginator(new Zend_Paginator_Adapter_DbSelect($trans->getTransactions($search.'%')));
    	$paginator->setItemCountPerPage(10)
    			->setCurrentPageNumber($this->_getParam('page',1));
    			$this->view->data=$paginator;
    }
   public function statisticsAction(){
   	$trans= new Model_Transaction();
    $this->view->gdatas=$trans->getTransactionsSelected();
       $this->view->revenueCategores=$trans->getCategoryRevenue();
       $cat= new Admin_Model_Category();
       $cont=array();
       foreach ($cat->getCategorys() as $category){
       	$cate=$trans->getCategoryCountreis($category['id']);
       		$contries=array();
       		array_push($contries,$category['name']);
       		array_push($contries,$cate);
       		array_push($cont, $contries);
       }
       $this->view->conts=$cont;
	}
}



