import { FaPlus, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Table, message } from "antd";
import api from "../../../utils/api";


const columns = [
  {
    title: "Company Name",
    dataIndex: "maincompany_name",
    render: (text) => (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <FaPlus size={12} style={{ marginRight: 4 }} />
        <a style={{ display: 'inline' }}>{text}</a>
      </span>
    ),
  },
  {
    title: "Address",
    dataIndex: "Address",
  },
];

const MainCompanyAdmin= () => {
  const [activeLink, setActiveLink] = useState({ left: 1, right: 0 });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [drawerData, setDrawerData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [maincompanies, setMainCompanies] = useState([]);
  const [newform] = Form.useForm(); // Use the useForm hook
  console.log(maincompanies)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Fetch companies data from the API
        const response = await api.get("/api/main");
   
        setMainCompanies(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (activeLink.left === 1) {
      fetchCompanies();
    }
  }, [activeLink.left]);

  const handleLink = (side, index) => {
    setActiveLink((prevState) => ({ ...prevState, [side]: index }));
  };

  const handleAdd = () => {
    newform.resetFields();
    showAddDrawer();
  };

  const handleDelete = async () => {
    try {
      const companyIds = selectedRowKeys; // Array of selected company IDs
      await api.delete("/api/companies/delete", { data: { companyIds } });
      success("Companies deleted successfully");
      fetchCompanies();
    } catch (e) {
      error("Failed to delete companies");
    }
  };

  const [openAdd, setOpenAdd] = useState(false);

  const showAddDrawer = () => {
    setOpenAdd(true);
  };

  const onCloseAdd = () => {
    setOpenAdd(false);
  };

  const onFinishAdd = async (values) => {
    try {
      await newform.validateFields(); 
  
      await api.post("/api/main", values);
      onCloseAdd();
      success("Company added successfully");
      fetchCompanies();
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle validation errors
        error("Please fill in all required fields.");
      } else {
        // Handle other errors
        console.error(error);
        error("Error adding company. Please try again.");
      }
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <>
      <div style={{ width: "100%" }} className="flex-grow flex flex-col items-center bg-white">
       <div style={{ width: "100%" }}>
          {activeLink.left === 1 ? (
            // <div>Company</div>
            <div style={{ width: "100%" }} className="flex flex-row">
              <div style={{ width: "15%" }}>
                <div
                  style={{ width: "100%" }}
                  className="flex items-center mt-2 pl-2 border-b border-gray-600 pb-1"
                >
                  <button
                    onClick={handleAdd}
                    className="flex items-center text-black hover:bg-white hover:text-green-500 rounded"
                  >
                    <FaPlus size={12} style={{ marginRight: 4 }} /> Add New Company
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={selectedRows.length === 0}
                    className={`flex items-center rounded pl-4 ${
                      selectedRows.length === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-black hover:bg-white hover:text-red-500"
                    }`}
                  >
                    <FaTrash size={12} style={{ marginRight: 4 }} /> Delete
                  </button>
                </div>
                <Table
                  size="small"
                  style={{ width: "100%" }}
                  rowSelection={{
                    type: "chevron",
                    ...rowSelection,
                  }}
                  columns={columns}
                  dataSource={ maincompanies}
                  rowKey="maincompany_id"
                />
              </div>
              <div style={{ width: "85%" }} className="border-l border-gray-600">
                <Table
                  size="small"
                  style={{ width: "100%" }}
                  rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                  }}
                  columns={columns}
                  dataSource={ maincompanies}
                  rowKey="maincompany_id"
                />
              </div>
           
            </div>
          ) : (
            <></>
            
          )}


          <div>cppp</div>
        </div>
        <Drawer width={500} title="Add New Company" onClose={onCloseAdd} open={openAdd}>
          {/* Pass form prop to connect useForm hook with Form component */}
          <Form
            onFinish={onFinishAdd}
            form={newform}
            layout="vertical"
            style={{
              maxWidth: 600,
            }}
          >
           <Form.Item
        label="Company Name"
        name="maincompany_name"
        rules={[
    {
      required: true,
      message: "Please input the company name!",
    },
  ]}
>
  <Input />
</Form.Item>
<Form.Item
  label="Address"
  name="Address"
  rules={[
    {
      required: true,
      message: "Please input the company address!",
    },
  ]}
>
  <Input />
</Form.Item>
            <Form.Item>
              <Button
                style={{ background: "#387ADF", color: "white", width: "100%" }}
                htmlType="submit"
              >
                Save Company
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </>
  );
};

export default MainCompanyAdmin;