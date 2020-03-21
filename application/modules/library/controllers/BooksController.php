<?php

class Library_BooksController extends Zend_Controller_Action
{

    public function init()
    {
       $contextSwith=$this->_helper->getHelper('contextSwitch');
       $contextSwith->addActionContext('list','json')
       				->initContext();
    }

    public function indexAction()
    {
    	
    }

    public function listAction()
    {
    	$bookList = new Library_Model_Listbooks();
    	$language=Zend_Registry::get('locale');
    	$books = $bookList->listbooks($this->_getParam('page',1),$language);
    	$boooks=array();
    	foreach ($books as $book){
    		$book['book_id']=$this->_helper->url('view','books','library',array('item'=>$book['book_id']));
    		$first_im=explode(',',$book['text'],-1);
    		$book['text']=Zend_Controller_Front::getInstance()->getBaseUrl().'/data/tumb/'.$first_im[0];
    		$boooks[]=$book;
    	}
    	$this->view->books= $boooks;
    	if (!$this->_request->isXmlHttpRequest()){
    	$this->view->paginator = $bookList->getPaginator();	
    	}else {
    	$this->view->currentPage = $bookList->getPaginator()->getCurrentPageNumber();
    	$this->view->lastPage = ceil($bookList->getPaginator()->getTotalItemCount()/$bookList->getPaginator()->getItemCountPerPage());
    	}
    }
	public function viewAction()
    {
    	$this->_helper->layout->disableLayout();
    	$book=new Library_Model_Book();
    	$this->view->book=$book->getBook($this->_getParam('item',1));
    	
    }
	
}
