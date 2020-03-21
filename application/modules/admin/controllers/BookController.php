<?php

class Admin_BookController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
       
    }

    public function addAction()
    {
         $books= new Library_Model_Listbooks();
      	$bookspa=$books->listbooks($this->_getParam('page',1), Zend_Registry::get('locale'));
      	$this->view->data=$bookspa;
      	
        $request=$this->getRequest();
        $form =new Form_AddForm();
        $insert = new Admin_Model_InsertBook();
    if ($request->isPost()){
    		if($form->isValid($this->_request->getPost())){
	    		$title=$form->getValue('title');
	    		$category=$form->getValue('category');
    			
    		try {
				$adapter = new Zend_File_Transfer_Adapter_Http();
				$adapter->addValidator('Count', false, array('min' => 1 , 'max' => 20));
				//$adapter->addValidator('Size', false, array('min' => 400 , 'max' => 1000000 , 'bytestring' => true));
				$adapter->addValidator('Extension', false, array('extension' => 'jpg' , 'case' => true));
				//$adapter->addValidator('ImageSize',false,array('minwidth' => 10,'minheight' => 10,'maxwidth' => 300, 'maxheight' => 300));
				//$adapter->addValidator('NotExists', false, APPLICATION_PATH.'/../data/upload');
				$adapter->setDestination(APPLICATION_PATH.'/../data/upload');
				$files = $adapter->getFileInfo();
				//$adapter->addFilter('Rename',APPLICATION_PATH.'/../data/upload'.$lastid.$files['type']);
				$text='';
				foreach ($files as $fieldname => $fileinfo) {
				if (($adapter->isUploaded($fileinfo['name'])) && ($adapter->isValid($fileinfo['name']))) {
					$path=md5(microtime()).'.'.pathinfo($fileinfo['name'], PATHINFO_EXTENSION);
					$adapter->addFilter('Rename',APPLICATION_PATH.'/../public/data/'.$path);
					$adapter->receive($fileinfo['name']);

					$image = new Admin_Model_SimpleImage();
   					$image->load(APPLICATION_PATH.'/../public/data/'.$path);
   					$image->resize(212,300);
   					$image->save(APPLICATION_PATH.'/../public/data/tumb/'.$path);
  					$text .=$path.',';

					}
				}
				$insert->insertBook(array('title'=>$title,'category_id'=>$category,'text'=>$text,'date'=>Zend_Date::now()->toString('YYYY-MM-dd HH:mm:ss')));
				$this->view->error='The complete....';
				} catch (Exception $e) {
				$this->view->error='the problem was:';
				$this->view->error=$e->getMessage();
				}
				    			
    		}
    	}
    	$this->view->form=$form;
    }
    public function editAction()
    {
        
    }

    public function deleteAction()
    {
        $book=new Library_Model_Book();
        $imag=$book->getBook($this->_getParam('id',1));
        $images=explode(',',$imag['text'],-1);
						foreach ($images as $image){
                    unlink(APPLICATION_PATH.'/../public/data/'.$image); 
                    unlink(APPLICATION_PATH.'/../public/data/tumb/'.$image);
					}
    	$book->deleteBook($this->_getParam('id',1));
    	$this->_redirect('admin/book/add');
    }
    public function categoryAction(){
    	
    }

}







