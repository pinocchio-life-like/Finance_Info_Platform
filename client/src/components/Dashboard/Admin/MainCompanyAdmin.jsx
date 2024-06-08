import { FaPlus, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Table, message, Select } from "antd";
import api from "../../../utils/api";

const columns = [
  {
    title: "Company Name",
    dataIndex: "company_name",
    render: (text) => (
      <span style={{ display: "flex", alignItems: "center" }}>
        {/* <FaPlus size={12} style={{ marginRight: 4 }}
         /> */}
        <a style={{ display: "inline" }}>{text}</a>
      </span>
    ),
  },
  {
    // title: "parentCompany",
    dataIndex: "parentCompany",
  },
];

const MainCompanyAdmin = () => {
  const [activeLink, setActiveLink] = useState({ left: 1, right: 0 });
  const [selectedRows, setSelectedRows] = useState([]);
  const [drawerData, setDrawerData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [newform] = Form.useForm(); // Use the useForm hook
  const [selectedMainCompany, setSelectedMainCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Fetch companies data from the API
        const response = await api.get("/api/company");
        setCompanies(response.data.data);
      } catch (error) {
        console.error(error);
        // Handle error
        message.error("Failed to fetch companies.");
      }
    };

    if (activeLink.left === 1) {
      fetchCompanies();
    }
  }, [activeLink.left]);
  // const handleMainCompanyClick = (record) => {
  //   setSelectedMainCompany(selectedMainCompany === record ? null : record);
  // };

  const handleLink = (side, index) => {
    setActiveLink((prevState) => ({ ...prevState, [side]: index }));
  };

  const handleAdd = () => {
    newform.resetFields();
    showAddDrawer();
  };

  const handleDelete = async () => {
    try {
      const companyIds = selectedRows.map(row => row.company_id); // Array of selected company IDs
      await api.delete("/api/companies/delete", { data: { companyIds } });
      message.success("Companies deleted successfully");
      fetchCompanies();
    } catch (e) {
      console.error(e);
      // Handle error
      message.error("Failed to delete companies.");
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
      await api.post("/api/company", values);
      onCloseAdd();
      message.success("Company added successfully");
      fetchCompanies();
    } catch (error) {
      console.error(error);
      // Handle error
      message.error("Error adding company. Please try again.");
    }
  };

  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setSelectedRows(selectedRows);
  //     setSelectedRowKeys(selectedRowKeys);
  //   },
  // };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };

  // const renderCompany = (company) => {
  //   const handleClick = () => {
  //     setActiveLink((prevState) => ({ ...prevState, right: 1 }));
  //     setMainCompanies([company]);
  //   };
  //   console.log(company.subsidarycompanies)

  //   return (
  //     <div key={company.company_id}>
  //       <h2 onClick={handleClick}>{company.company_name}</h2>
  //       {activeLink.right === 1 &&
  //         company.subsidarycompanies &&
  //         company.subsidarycompanies.length > 0 && (
  //           <ul>
  //             {company.subsidarycompanies.map((subcompany) => (
  //               <li key={subcompany.company_id}>{subcompany.company_name}</li>
  //             ))}
  //           </ul>
  //         )}
  //     </div>
  //   );
  // };
  const renderSubsidiaryCompanies = (subCompanies, level = 1) => (
    <ul>
      {subCompanies.map((subCompany) => (
        <li key={subCompany.company_id} className={`ml-${level * 8}`}>
          {subCompany.company_name}
          {subCompany.subsidarycompanies &&
            renderSubsidiaryCompanies(subCompany.subsidarycompanies, level + 1)}
        </li>
      ))}
    </ul>
  );
  return (
    <>
      <div
        style={{ width: "100%" }}
        className="flex-grow flex flex-col items-center bg-white"
      >
        <div style={{ width: "100%" }}>
          {activeLink.left === 1 && (
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
                    <FaPlus size={12} style={{ marginRight: 4 }} /> Add New
                    Company
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
                  // rowSelection={false}
                  columns={columns}
                  dataSource={companies}
                  pagination={false}
                  rowKey="company_id"
                  expandable={{
                    expandedRowRender: (record) => (
                      <div
                        style={{ paddingLeft: "100px", background: "#f5f5f5" }}
                      >
                        <a
                          href={`/company/${record.subsidarycompanies.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          {record.subsidarycompanies &&
                            renderSubsidiaryCompanies(
                              record.subsidarycompanies
                            )}
                        </a>
                      </div>
                    ),
                  }}
                />
              </div>
              <div
                style={{ width: "85%" }}
                className="border-l border-gray-600"
              >
                {/* <Table
                  size="small"
                  style={{ width: "100%" }}
                  rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                  }}
                  columns={columns}
                  // dataSource={companies.map((company) => renderCompany(company))}
                  rowKey="company_id"
                /> */}
              </div>
            </div>
          )}
        </div>
        <Drawer
          width={500}
          title="Add New Company"
          onClose={onCloseAdd}
          visible={openAdd}
        >
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
              name="company_name"
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
              label="Parent Company"
              name="parentCompany"
              rules={[
                {
                  required: false,
                  message: "Please input the parent company!",
                },
              ]}
            >
              {/* <Input /> */}
              <Select placeholder="Parent Company">
                {companies.map((comp) => (
                  <Select.Option key={comp.company_id} value={comp.company_name}>
                    {comp.company_name}
                  </Select.Option>
                ))}
              </Select>
              
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