<?php
class Model_Transaction{
	protected $_name='transactions';
	public function getTransaction($id){
	$db = Zend_Db_Table::getDefaultAdapter();
	$select = new Zend_Db_Select($db);
	$select->from($this->_name)
			->where('TRANSACTIONID = ?',$id);
	return $select;
	}
	public function getTransactions($like){
	$db = Zend_Db_Table::getDefaultAdapter();
	$select = new Zend_Db_Select($db);
	$select->from($this->_name)
			->where('LASTNAME LIKE ?',$like);
	return $select;
	}
	public function getCategoryRevenue(){
	$db = Zend_Db_Table::getDefaultAdapter();
	$select = new Zend_Db_Select($db);
	$select->from(array('t'=>$this->_name),'SUM(AMT)')
			->join(array('p'=>'payment'),'p.tr_id=t.TRANSACTIONID','')
			->join(array('c'=>'category'), 'c.id=p.category_id','name')
			->group('c.id');
	return $select->query()->fetchAll();
	}
	public function getCategoryCountreis($category_id){
	$db = Zend_Db_Table::getDefaultAdapter();
	$select = new Zend_Db_Select($db);
	$select->from(array('t'=>$this->_name),array('SHIPTOCOUNTRYNAME','COUNT(SHIPTOCOUNTRYNAME) AS count'))
			->join(array('p'=>'payment'),'p.tr_id=t.TRANSACTIONID','')
			->where('p.category_id = ?',$category_id)
			->group('SHIPTOCOUNTRYNAME')
			->order('count DESC')
			->limit(9);
	return $select->query()->fetchAll();
	}
	public function getTransactionsSelected(){
	$db = Zend_Db_Table::getDefaultAdapter();
	$select = new Zend_Db_Select($db);
	$select->from($this->_name,array('DATE(TIMESTAMP) AS TIMESTAMP','SUM(AMT) AS AMT'))
			->group('DATE(TIMESTAMP)');
	return $select->query()->fetchAll();
	}
	public function insertTransaction($data){
		$db = Zend_Db_Table::getDefaultAdapter();
	 $db->insert($this->_name,$data);
	}
}