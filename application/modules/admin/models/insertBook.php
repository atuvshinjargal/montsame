<?php
class Admin_Model_InsertBook extends Zend_Db_Table_Abstract{
	protected $_name='books';
	public function insertBook($data){
	$db = Zend_Db_Table::getDefaultAdapter();
	$db->insert($this->_name, $data);
	}
	public function getLastId(){
		$select = $this->select();
        $select->from($this->_name, "book_id");
        $select->order('book_id DESC');
        $select->limit(0, 0);
        $result = $this->fetchAll($select)->current();

        return $result->book_id;
	}
}