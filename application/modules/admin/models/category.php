<?php
class Admin_Model_Category {
	protected $_name='category';
	public function getCategorys(){
	$db = Zend_Db_Table::getDefaultAdapter();
	$identity = Zend_Auth::getInstance()->getIdentity();
	$select = $db->select()->from($this->_name);
	$categorys=$select->query()->fetchAll();
	return $categorys;
	}
	public function getCategory($id){
	$db = Zend_Db_Table::getDefaultAdapter();
	$select = new Zend_Db_Select($db);
	$select->from($this->_name)
			->where('id = ?',$id);
	return $select->query()->fetch();
	}
}