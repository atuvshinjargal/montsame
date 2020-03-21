<?php
class Admin_Model_Pay{
	protected $_name='payment';
	public function getpays($id){
	$db = Zend_Db_Table::getDefaultAdapter();
	$select = new Zend_Db_Select($db);
	$select->from(array('p'=>$this->_name))
			->where('user_id = ?',$id)
			->order('paydate DESC')
			->join(array('c'=>'category'), 'category_id=c.id');
	return $select;
	}
	public function getCategoryLast($user_id,$category_id){
		$db = Zend_Db_Table::getDefaultAdapter();
		$select = new Zend_Db_Select($db);
		$select->from($this->_name)
			->where('user_id = ?',$user_id)
			->where('category_id = ?',$category_id)
			->order('finisdate DESC');
		return $select->query()->fetch();
	}
	public function insertpay($data){
		$db = Zend_Db_Table::getDefaultAdapter();
		$db->insert($this->_name,$data);
	}
	public function isPayed($id){
	$db = Zend_Db_Table::getDefaultAdapter();
	$select = new Zend_Db_Select($db);
	$select->from(array('p'=>$this->_name),array("num"=>"COUNT(*)"))
			->where('user_id = ?',$id)
			->order('finisdate DESC')
			->join(array('c'=>'category'), 'category_id=c.id')
			->query();
	$checkrequest = $db->fetchRow($select);
			return $checkrequest["num"];
	}
	public function deletePays($user_id){
		$db = Zend_Db_Table::getDefaultAdapter();
		$db->delete($this->_name, 'user_id = '.$user_id);
	}
}