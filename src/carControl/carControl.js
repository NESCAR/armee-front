import React from "react";
import {
  DatePicker,
  Table,
  Button,
  Layout,
  Card,
  Input,
  message
} from "antd";

import {
  addLockInfo,
  queryDevice, 
  lockIm
} from "../axios";
import "./carControl.css";

const { Content } = Layout;
const { RangePicker } = DatePicker;

var st = "";
var et = "";
var obj = {}; // 保存后端数据

function add(n) {
  return n<10 ? '0'+n : n;
}

function addmilli(n) {
  if (n < 10){
    return '00'+n;
  }
  else if (n<100){
    return '0'+n;
  }
  else return n;
}

// var response = [
//   {
//     gid: "00001",
//   },
//   {
//     gid: "00002",
//   }
// ]

const nodeInfoTableColumns = [
  {
    title: "汽车ID",
    dataIndex: "deviceId",
    key: "deviceId"
  },
  {
    title: "司机ID",
    dataIndex: "driverId",
    key: "driverId",
    render: () => (
      <Input onChange={ (e) =>{
        obj.driverId = e.target.value;
      }} />
    )
  },
  {
    title: "解锁时间",
    dataIndex: "time",
    key: "time",
    render: () => (
      <RangePicker showTime onChange={(e)=>{
        st = e[0]._d; 
        et = e[1]._d;
        //console.log(st);
      }}/>
    ),
  },
  {
    title: "",
    dataIndex: "upload",
    key: "upload",
    render: (text, record, index) => (
        <Button onClick={ function (){
          if (!st || !obj.driverId){
            message.error("请输入完整信息");
          }
          else {
            obj.st = st.getFullYear()+"-"+add((st.getMonth()+1))+"-"+add(st.getDate())+"T"+add(st.getHours())+":"+add(st.getMinutes())+":"+add(st.getSeconds())+"."+addmilli(st.getMilliseconds())+"+08:00";
            obj.et = et.getFullYear()+"-"+add((et.getMonth()+1))+"-"+add(et.getDate())+"T"+add(et.getHours())+":"+add(et.getMinutes())+":"+add(et.getSeconds())+"."+addmilli(et.getMilliseconds())+"+08:00";
            obj.deviceId = record.deviceId;
            console.log(obj.st);
            addLockInfo([
              obj.deviceId,
              obj.driverId,
              obj.et,
              obj.st
            ]).then(res => {
              switch (res.status){
                case 401:message.error("Unauthorized, 指令下发失败");break;
                case 403:message.error("Forbidden, 指令下发失败");break;
                case 404:message.error("Not Found, 指令下发失败");break;
                case 200:message.success("指令下发成功");break;
                case 201:message.success("指令下发成功");break;
              }
            })
          }
        } }>确定</Button>
    ),
  },
  {
    title: "",
    dataIndex: "lockIm",
    key: "lockIm",
    render: (text, record, index) => (
      <Button onClick={ function (){
        //console.log(record.deviceId);
        lockIm([
          record.deviceId
        ]).then(res => {
          switch (res.status){
            case 401:message.error("Unauthorized, 指令下发失败");break;
            case 403:message.error("Forbidden, 指令下发失败");break;
            case 404:message.error("Not Found, 指令下发失败");break;
            case 200:message.success("指令下发成功");break;
            case 201:message.success("指令下发成功");break;
          }
        })
      }}>立即上锁</Button>
    ),
  }
];

class App extends React.Component {
  state = {
    collapsed: false,
    nodeInfoTableDataSource: [],
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() { }

  componentDidMount() {
    // 获得汽车列表数据并整型数组
    queryDevice().then(res => {
      if (res.status === 201 || res.status === 200) {
        let nodeInfoTableDataSource = [];
        // response.forEach(element => {
        res.data.forEach(element => {
          let obj={};
          obj.deviceId = element.gid;
          nodeInfoTableDataSource.push(obj);
        });
        this.setState({ nodeInfoTableDataSource: nodeInfoTableDataSource });
      } 
      else if (res.status === 401) {
        message.error("Unauthorized, 获取汽车列表失败");
        return;
      }
      else if (res.status === 403) {
        message.error("Forbidden, 获取汽车列表失败");
        return;
      }
      else if (res.status === 404) {
        message.error("Not Found, 获取汽车列表失败");
        return;
      }
    });
  }

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="汽车控制" id="nodeManage">
              <div style={{ marginTop: 5 }}>
                <Table
                  rowSelection={this.dataInfoTableRowSelection}
                  dataSource={this.state.nodeInfoTableDataSource}
                  columns={nodeInfoTableColumns}
                />
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout>
    );
  }
}

export default App;