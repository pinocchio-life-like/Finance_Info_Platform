import React, { useState } from 'react';
import { Layout, Menu, Input, Button, Divider } from 'antd';
import {
  HomeOutlined,
  FolderOutlined,
  TeamOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import FolderUpload from './FolderUpload';

const { Header, Content, Sider } = Layout;

// Dummy data for folders
const folders = [
  { name: "Folder 1", createdAt: "2024-05-13", owner: "Alice", company: "XYZ Corp" },
  { name: "Folder 2", createdAt: "2024-05-12", owner: "Bob", company: "ABC Inc." },
  { name: "Folder 3", createdAt: "2024-05-11", owner: "Charlie", company: "123 Company" }
];

function Ftp() {
  const [showUpload, setShowUpload] = useState(false);

  const handleAddNewClick = () => {
    setShowUpload(!showUpload);
  };
  return(
    <>
    <div>
      <Button className='m-5' onClick={handleAddNewClick}>+ Add New</Button>
      {showUpload && <FolderUpload />}
    </div>
    
   
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>Home</Menu.Item>
          <Menu.Item key="2" icon={<FolderOutlined />}>My Folder</Menu.Item>
          <Menu.Item key="3" icon={<TeamOutlined />}>Shared With Me</Menu.Item>
          <Menu.Item key="4" icon={<ClockCircleOutlined />}>Recent</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
      
      <div className="ml-8 mb-2">
            <Input placeholder="Search" className="w-2/3" />
          </div>
         
        < div className='ml-8'>
        <Button className="mr-2">type</Button>
          <Button className="mr-2">people</Button>
          <Button className="mr-2">modify</Button>
          <Button>company</Button>
          </ div>

        <Content style={{ padding: '24px 24px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <h2 className="mb-4">Name</h2>
                {folders.map((folder, index) => (
                  <div key={index} className="mb-4">
                    <div>{folder.name}</div>
                    <Divider />
                  </div>
                ))}
              </div>
              <div>
                <h2 className="mb-4">Created At</h2>
                {folders.map((folder, index) => (
                  <div key={index} className="mb-4">
                    <div>{folder.createdAt}</div>
                    <Divider />
                  </div>
                ))}
              </div>
              <div>
                <h2 className="mb-4">Owner</h2>
                {folders.map((folder, index) => (
                  <div key={index} className="mb-4">
                    <div>{folder.owner}</div>
                    <Divider />
                  </div>
                ))}
              </div>
              <div>
                <h2 className="mb-4">Company</h2>
                {folders.map((folder, index) => (
                  <div key={index} className="mb-4">
                    <div>{folder.company}</div>
                    <Divider />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
    </>
  );
}

export default Ftp;