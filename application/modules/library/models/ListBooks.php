<?php
class Library_Model_Listbooks{
	private $paginator=null;
	
	public function listbooks($page,$language){
	$db = Zend_Db_Table::getDefaultAdapter();
	$identity = Zend_Auth::getInstance()->getIdentity();
	$selectbooks = new Zend_Db_Select($db);
	if (isset($identity->user_id)){
	$selectbooks->from(array('b' => 'books'))
             ->join(array('c' => 'category'),
                    'b.category_id = c.id')
              ->where('c.alies = ?', $language)
              ->join(array('p'=>'payment'), 'c.id=p.category_id')
              ->where('p.finisdate >= ?',Zend_Date::now()->toString('YYYY-MM-dd'))
			  ->where('p.user_id = ?',$identity->user_id)
			  ->order('date DESC');
	}else
	{
		$selectbooks->from(array('b' => 'books'))
					->join(array('c' => 'category'),
                    'b.category_id = c.id')
					->where('c.alies = ?', $language)
					->order('date DESC');
	}
	
	$this->paginator =new Zend_Paginator(new Zend_Paginator_Adapter_DbSelect($selectbooks));
    	$this->paginator->setItemCountPerPage(10)
    			->setCurrentPageNumber($page);
    				
	return $this->paginator;
	}
	public function getPaginator(){
		return $this->paginator;
	}
}