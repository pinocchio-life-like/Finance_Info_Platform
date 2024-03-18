import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';

const History = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Author',
      dataIndex: 'age',
    },
    {
      title: 'Date Modified',
      dataIndex: 'address',
    },
  ];
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
 // Fetch the version data form the DB
 const [state, setState] = useState({
  text: "",
  scrollElement: document.documentElement,
});
 useEffect(() => {
  const getMainArticle = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/article/main/1");
      const { data } = res.data;

      setState({
        text: data.articleContent,
        scrollElement: document.documentElement,
      });
    } finally {
      setIsLoading(false);
    }
  };
  getMainArticle();
}, []); 
  return (
    <div className='mt-10'>
        <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Compare Selected Versions
        </Button>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  )
}

export default History