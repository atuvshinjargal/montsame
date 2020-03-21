<?php
class Library_Model_Book{
	protected $_name='books';
	public function getBook($id){
		$identity = Zend_Auth::getInstance()->getIdentity();
		$db = Zend_Db_Table::getDefaultAdapter();
		$select = new Zend_Db_Select($db);
        $select->from(array('b' => 'books'))
        		->where('b.book_id = ?',$id)
              ->join(array('p'=>'payment'), 'b.category_id=p.category_id')
              ->where('p.finisdate >= ?',Zend_Date::now()->toString('YYYY-MM-dd'))
			->where('p.user_id = ?',$identity->user_id)
			->group('p.category_id');
        return $select->query()->fetch();
	}
	public function deleteBook($id){
		$db = Zend_Db_Table::getDefaultAdapter();
		$db->delete('books', 'book_id = '.$id);
	}
}