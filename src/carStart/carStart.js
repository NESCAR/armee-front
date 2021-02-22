import React from "react";
import {
  Layout, Card,
} from "antd";

import "./carStart.css";

import role from "../App.js";

const { Content } = Layout;

class App extends React.Component {
  state = {
    collapsed: false,
    otaInfoTableDataSource: [],
    otaModalVisible: null,
    selectedVersion: undefined,
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="瑞立-OTA信息管理平台" id="hello">
              <div style={{ fontSize: 15 }}>
                  您好，{localStorage.getItem('userId')}，您是{localStorage.getItem('user_type')}
              </div>
              <div style={{ fontSize: 15, display: (role === 'DRIVER') ? 'block' : 'none'}}>
                  很抱歉，您没有操作权限。
              </div>
              <div style={{ fontSize: 15, display: (role === 'ADMIN') ? 'block' : 'none'}}>
                  您的权限为汽车控制、汽车信息。
              </div>
              <div style={{ fontSize: 15, display: (role === 'SUPERADMIN') ? 'block' : 'none'}}>
                  您的权限为汽车控制、汽车信息、用户管理。
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout>
    );
  }
}

export default App;
