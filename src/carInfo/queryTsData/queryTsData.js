import React from "react";
import {
  Layout,
  Icon,
  Card,
  Button,
  message,
  DatePicker,
  Input,
  Modal,
  Tooltip,
  List
} from "antd";
import { 
  Chart,  
  Axis, 
  Guide,
  Point,
  Geom
 } from "bizcharts";
import {
  Map, 
  Marker, 
  NavigationControl, 
  Polyline
} from "react-bmap";
import {
  queryTsData,
} from "../../axios";
import "./queryTsData.css";
// import BMap  from 'BMap';

const { Content } = Layout;
const InputGroup = Input.Group;
const { Line } = Guide;
const gridStyle = { 
  width: "20%", 
  height: "200px", 
  textAlign: "center", 
  padding: "10px" 
};
const cols = {
  time: {
    alias: "时间"
  },
  speed: {
    alias: "速度(km/h)"
  }
};

var length = 0;
var data = [];
var objSpeed = [];
var location = [
  {
    time: new Date().getFullYear()+"-"+add((new Date().getMonth()+1))+"-"+add(new Date().getDate())+"T"+add(new Date().getHours())+":"+add(new Date().getMinutes())+":"+add(new Date().getSeconds())+"."+addmilli(new Date().getMilliseconds())+"+08:00",
    lng: 116.397128,
    lat: 39.916527,
    height: 0,
    direction: "正北"
  }
];
var historicalLocation = [
  {
    lng: 116397128,
    lat: 39916527
  }
];

var carQueryParam = {
  st: "",
  et: "",
  fields: [
    "direction","height","lat","lng","locationTime","speed","status"
  ],
  retentionPolicy: "",
  tags: {
    terminalId: ""
  }
};

// 转换时间格式
function add(n) {
  return n<10 ? "0"+n : n;
}

function addmilli(n) {
  if (n < 10){
    return "00"+n;
  }
  else if (n<100){
    return "0"+n;
  }
  else return n;
}

// const response = {
//   data:{
//     error: "",
//     results: [{
//       error: "",
//       series: [
//         {
//           columns: [
//             "direction",
//             "height",
//             "lat",
//             "lng",
//             "locationTime",
//             "speed",
//             "status"
//           ],
//           values: [[
//             0,
//             800,
//             40916527,
//             117397128,
//             "2021-02-09T07:01:13.892+08:00",
//             0,
//             0 
//           ],
//           [
//             0,
//             801,
//             41916528,
//             118397129,
//             "2021-02-09T07:02:13.892+08:00",
//             2,
//             0 
//           ],
//           [
//             0,
//             799,
//             42916529,
//             119397130,
//             "2021-02-09T07:03:13.892+08:00",
//             7,
//             4096 
//           ],
//           [
//             0,
//             801,
//             43916530,
//             120397131,
//             "2021-02-09T07:04:13.892+08:00",
//             10,
//             0 
//           ],
//           [
//             0,
//             801,
//             44916531,
//             121397132,
//             "2021-02-09T07:05:13.892+08:00",
//             20,
//             0 
//           ],
//           [
//             0,
//             801,
//             45916532,
//             122397133,
//             "2021-02-09T07:06:13.892+08:00",
//             13,
//             0 
//           ],
//           [
//             45,
//             801,
//             46916533,
//             123397134,
//             "2021-02-09T07:07:13.892+08:00",
//             0,
//             45 
//           ],
//           [
//             271,
//             801,
//             45916532,
//             122397133,
//             "2021-02-09T07:08:13.892+08:00",
//             13,
//             0 
//           ]
//         ]
//         }
//       ]
//     }]
//   }
// }

class App extends React.Component {
  // 状态变更变量
  state = {
    collapsed: false,
    speedTableDataSource: [],
    accOnlineState: "开",
    carLoadState: "满载",
    oilWayState: "断开",
    elecWayState: "断开",
    carDoorState: "解锁",
    inputDeviceModalVisible: false,
    keyValue: "time",
    key: "tab1"
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  onTabChange = (key, type) => { 
    this.setState({ [type]: key }); 
  }

  componentDidMount() {
    let date = new Date();
    carQueryParam.tags.terminalId="12312";
    carQueryParam.st=date.getFullYear()+"-"+add((date.getMonth()+1))+"-"+add(date.getDate())+"T"+add(0)+":"+add(0)+":"+add(0)+"."+addmilli(0)+"+08:00";
    carQueryParam.et=date.getFullYear()+"-"+add((date.getMonth()+1))+"-"+add(date.getDate())+"T"+add(23)+":"+add(59)+":"+add(59)+"."+addmilli(999)+"+08:00";
    // console.log(carQueryParam);
    queryTsData(carQueryParam).then(res => {
      if (res.status === 200 || res.status === 201){
        length = 0;
        res.data.results[0].series[0].values.forEach(element => {
        // response.data.results[0].series[0].values.forEach(element => {
          data[length]=new Array();
          data[length] = element;
          objSpeed[length]=new Object();
          objSpeed[length].speed = element[5];
          objSpeed[length].time = element[4];
          location[length]=new Object();
          if (element[0] === 0){
            location[length].direction="正北";
          }
          else if(element[0] === 90){
            location[length].direction="正东";
          }
          else if (element[0] === 180){
            location[length].direction="正南";
          }
          else if (element[0] === 270){
            location[length].direction="正西";
          }
          else if (element[0] > 0 && element[0] < 90){
            location[length].direction="北偏东"+element[0]+"°";
          }
          else if (element[0] > 90 && element[0] < 180){
            location[length].direction="南偏东"+(180-element[0])+"°";
          }
          else if (element[0] > 180 && element[0] < 270){
            location[length].direction="南偏西"+(element[0]-180)+"°";
          }
          else {
            location[length].direction="北偏西"+(360-element[0])+"°";
          }
          location[length].height = element[1];
          location[length].lat = element[2]*1.0/1000000;
          location[length].lng = element[3]*1.0/1000000;
          location[length].time = element[4];
          historicalLocation[length]=new Object();
          historicalLocation[length].lat=element[2]*1.0/1000000;
          historicalLocation[length].lng=element[3]*1.0/1000000;
          length++;
        });
      length--;
      this.setState({accOnlineState : "" + (data[length][6] & 1) === "1" ? "开" : "关"});
      this.setState({carLoadState : "" + (data[length][6] & 768) === "768" ? "满载" : ("" + (data[length][6] & 768) === "0" ? "空载" : "半载")});
      this.setState({oilWayState : "" + (data[length][6] & 1024) === "1024" ? "正常" : "断开"});
      this.setState({elecWayState: "" + (data[length][6] & 2048) === "2048" ? "正常" : "断开"});
      this.setState({carDoorState : "" + (data[length][6] & 4096) === "4096" ? "加锁" : "解锁"});
      }
      else if (res.status === 401){
        message.error("Unauthorized, 获取时序数据失败");
        return;
      }
      else if (res.status === 403){
        message.error("Forbidden, 获取时序数据失败"); 
      }
      else {
        message.error("Not Found, 获取时序数据失败");
      }
    })
  }

  inputDeviceModal = () => {
    this.setState({ inputDeviceModalVisible: true });
  };

  inputDeviceModalHandleOk = () => {
    if (
      !this.state.inputDeviceTerminalId ||
      !this.state.inputDeviceSt ||
      !this.state.inputDeviceEt
    ) {
      message.error("请输入完整查询信息！");
    }
    else {
      carQueryParam.tags.terminalId=this.state.inputDeviceTerminalId;
      carQueryParam.st=this.state.inputDeviceSt.getFullYear()+"-"+add((this.state.inputDeviceSt.getMonth()+1))+"-"+add(this.state.inputDeviceSt.getDate())+"T"+add(this.state.inputDeviceSt.getHours())+":"+add(this.state.inputDeviceSt.getMinutes())+":"+add(this.state.inputDeviceSt.getSeconds())+"."+addmilli(this.state.inputDeviceSt.getMilliseconds())+"+08:00";
      carQueryParam.et=this.state.inputDeviceEt.getFullYear()+"-"+add((this.state.inputDeviceEt.getMonth()+1))+"-"+add(this.state.inputDeviceEt.getDate())+"T"+add(this.state.inputDeviceEt.getHours())+":"+add(this.state.inputDeviceEt.getMinutes())+":"+add(this.state.inputDeviceEt.getSeconds())+"."+addmilli(this.state.inputDeviceEt.getMilliseconds())+"+08:00";
      //console.log(carQueryParam);
      queryTsData(carQueryParam).then(res => {
        if (res.status === 200 || res.status === 201){
          data=new Array();
          objSpeed=new Array();
          location=new Array();
          historicalLocation=new Array();
          length = 0;
          res.data.results[0].series[0].values.forEach(element => {
          // response.data.results[0].series[0].values.forEach(element => {
            data[length]=new Array();
            data[length] = element;
            objSpeed[length]=new Object();
            objSpeed[length].speed = element[5];
            objSpeed[length].time = element[4];
            location[length]=new Object();
            if (element[0] === 0){
              location[length].direction="正北";
            }
            else if(element[0] === 90){
              location[length].direction="正东";
            }
            else if (element[0] === 180){
              location[length].direction="正南";
            }
            else if (element[0] === 270){
              location[length].direction="正西";
            }
            else if (element[0] > 0 && element[0] < 90){
              location[length].direction="北偏东"+element[0]+"°";
            }
            else if (element[0] > 90 && element[0] < 180){
              location[length].direction="南偏东"+(180-element[0])+"°";
            }
            else if (element[0] > 180 && element[0] < 270){
              location[length].direction="南偏西"+(element[0]-180)+"°";
            }
            else {
              location[length].direction="北偏西"+(360-element[0])+"°";
            }
            location[length].height = element[1];
            location[length].lat = element[2]*1.0/1000000;
            location[length].lng = element[3]*1.0/1000000;
            location[length].time = element[4];
            historicalLocation[length]=new Object();
            historicalLocation[length].lat=element[2]*1.0/1000000;
            historicalLocation[length].lng=element[3]*1.0/1000000;
            length++;
          });
        length--;
        // console.log(data);
        this.setState({accOnlineState : "" + (data[length][6] & 1) === "1" ? "开" : "关"});
        this.setState({carLoadState : "" + (data[length][6] & 768) === "768" ? "满载" : ("" + (data[length][6] & 768) === "0" ? "空载" : "半载")});
        this.setState({oilWayState : "" + (data[length][6] & 1024) === "1024" ? "正常" : "断开"});
        this.setState({elecWayState: "" + (data[length][6] & 2048) === "2048" ? "正常" : "断开"});
        this.setState({carDoorState : "" + (data[length][6] & 4096) === "4096" ? "加锁" : "解锁"});
        }
        else if (res.status === 401){
          message.error("Unauthorized, 获取时序数据失败");
          return;
        }
        else if (res.status === 403){
          message.error("Forbidden, 获取时序数据失败"); 
          return;
        }
        else {
          message.error("Not Found, 获取时序数据失败");
          return;
        }
        this.setState({
          inputDeviceModalVisible: false,
          keyValue: new Date(),
          inputDeviceTerminalId: null,
          inputDeviceSt: null,
          inputDeviceEt: null
        });
      }) 
    }
  };

  inputDeviceModalHandleCancel = () => {
    this.setState({
      inputDeviceModalVisible: false,
      keyValue: new Date(),
      inputDeviceTerminalId: null,
      inputDeviceSt: null,
      inputDeviceEt: null
    });
  };

  render() {
    const tabList = [{
      key: "tab1",
      tab: (
        <Tooltip title="显示汽车历史GPS定位">
          汽车定位
        </Tooltip>
      )
    },{
      key: "tab2",
      tab: (
        <Tooltip title="显示汽车历史时速">
          汽车时速
        </Tooltip>
      )
    }];
    const contentList = {
      tab1:
      <div>
        <Card>
          <Card.Grid style={{ 
            width: "75%", 
            height: "370px", 
            textAlign: "center", 
            padding: "10px" 
          }}>
            <Map 
              enableScrollWheelZoom={true}
              center={{lng: historicalLocation[length].lng, lat: historicalLocation[length].lat}} 
              zoom="7"
            >
              <Marker 
                icon={"start"}
                position={{lng: historicalLocation[0].lng, lat: historicalLocation[0].lat}} 
              />
              <Marker 
                icon={"end"}
                position={{lng: historicalLocation[length].lng, lat: historicalLocation[length].lat}} 
              />
              <NavigationControl /> 
              <Polyline
                strokeColor="blue"
                path={historicalLocation}
              />
            </Map>
          </Card.Grid>
          <Card.Grid
            style={{ 
              width: "25%", 
              height: "370px", 
              textAlign: "center", 
              padding: "20px",
              
            }}>
            <List
              style={{marginTop: "8%"}}
              bordered
              header={
                <div style={{ fontSize: "18px", fontWeight: "bold", height: "20%", textAlign: "left"}}>
                  最后一次上报时汽车位置信息：
                </div>
              }
              dataSource={[
                "时间："+location[length].time,
                "经度："+location[length].lng+'°',
                "纬度："+location[length].lat+'°',
                "高程："+location[length].height+'米',
                "方向："+location[length].direction
              ]}
              renderItem={item => <List.Item>{item}</List.Item>}
            >
            </List>
          </Card.Grid>
        </Card>
      </div>,
      tab2: 
      <div>
        <Chart
          padding={[10, 20, 50, 50]}
          autoFit
          height={370}
          data={objSpeed}
          scale={cols}
          placeholder
        >
          <Line position="time*speed" tooltip={["time*speed", (t, s) => {
            return {
              title: `${t}`,
              name: "speed",
              value: s
            }
          }]} />
          <Point position="time*speed" />
          <Tooltip showCrosshairs lock triggerOn="click" />
          <Axis name="speed" title={{
            position: "center",
            style: {
              fontSize: "12"
            }
          }} />
          <Axis name="time" title={{
            position: "center",
            style: {
              fontSize: "12"
            }
          }} />
          <Geom 
            type="line" 
            position="time*speed" 
            size={2} 
            shape={"smooth"} 
            color={"#0099ff"}
            animate={false}
           />
          <Geom 
            type="area"
            position="time*speed"
            shape={"smooth"}
            color={"#0099ff"}
            animate={false}
          />
        </Chart>
      </div>
      
    }
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <div style={{ height: "300px" }}>
              <Card title="汽车时序数据查询" id="nodeManage" style={{height: "20px", width: "100%"}} extra={
                <div>
                  当前terminalId:{carQueryParam.tags.terminalId}
                  &nbsp;
                  <Button type="primary" onClick={this.inputDeviceModal}>点击输入汽车信息</Button>
                </div>
              }>
              <Card.Grid style={gridStyle}>
              <div style={{ display: "flex", alignItems: "center", paddingTop: "5%", justifyContent: "center", height: "100%", width: "100%" }}> 
                <div style={{ position: "relative", border: "1px solid #e8e8e8", height: "100%", width: "100%", borderRadius: "4px", }}> 
                  <div style={{ position: "absolute", top: "-20px", marginLeft: "30%", height: "100px", width: "100px", backgroundColor: "#FFC125", borderRadius: "4px", boxShadow: "0 0 10px grey", display: "flex", alignItems: "center", justifyContent: "center", }}> 
                    <Icon type={this.state.accOnlineState === "开" ? "menu" : "key"} style={{ color: "white", fontSize: "60px" }} /> 
                  </div> 
                  <div style={{ textAlign: "center" }}> 
                    <div style={{ fontSize: "14px", marginTop: "100px" }}> ACC开关状态</div> 
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>{this.state.accOnlineState}</div> 
                  </div>
                </div> 
              </div>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
              <div style={{ display: "flex", alignItems: "center", paddingTop: "5%", justifyContent: "center", height: "100%", width: "100%" }}> 
                <div style={{ position: "relative", border: "1px solid #e8e8e8", height: "100%", width: "100%", borderRadius: "4px", }}> 
                  <div style={{ position: "absolute", top: "-20px", marginLeft: "30%", height: "100px", width: "100px", backgroundColor: "#912CEE", borderRadius: "4px", boxShadow: "0 0 10px grey", display: "flex", alignItems: "center", justifyContent: "center", }}> 
                    <Icon type={this.state.carLoadState === "空载" ? "search" : this.state.carLoadState === "半载" ? "monitor" : "fire"} style={{ color: "white", fontSize: "60px" }} /> 
                  </div> 
                  <div style={{ textAlign: "center" }}> 
                    <div style={{ fontSize: "14px", marginTop: "100px" }}> 汽车载量状态</div>
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>{this.state.carLoadState}</div> 
                  </div>
                </div> 
              </div>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
              <div style={{ display: "flex", alignItems: "center", paddingTop: "5%", justifyContent: "center", height: "100%", width: "100%" }}> 
                <div style={{ position: "relative", border: "1px solid #e8e8e8", height: "100%", width: "100%", borderRadius: "4px", }}> 
                  <div style={{ position: "absolute", top: "-20px", marginLeft: "30%", height: "100px", width: "100px", backgroundColor: "#4169E1", borderRadius: "4px", boxShadow: "0 0 10px grey", display: "flex", alignItems: "center", justifyContent: "center", }}> 
                    <Icon type={this.state.oilWayState === "正常" ? "link" : "disconnect"} style={{ color: "white", fontSize: "60px" }} /> 
                  </div> 
                  <div style={{ textAlign: "center" }}> 
                    <div style={{ fontSize: "14px", marginTop: "100px" }}> 汽车油路状态</div> 
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>{this.state.oilWayState}</div> 
                  </div>
                </div> 
              </div>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
              <div style={{ display: "flex", alignItems: "center", paddingTop: "5%", justifyContent: "center", height: "100%", width: "100%" }}> 
                <div style={{ position: "relative", border: "1px solid #e8e8e8", height: "100%", width: "100%", borderRadius: "4px", }}> 
                  <div style={{ position: "absolute", top: "-20px", marginLeft: "30%", height: "100px", width: "100px", backgroundColor: "#D02090", borderRadius: "4px", boxShadow: "0 0 10px grey", display: "flex", alignItems: "center", justifyContent: "center", }}> 
                    <Icon type={this.state.elecWayState === "正常" ? "check" : "close"} style={{ color: "white", fontSize: "60px" }} /> 
                  </div> 
                  <div style={{ textAlign: "center" }}> 
                    <div style={{ fontSize: "14px", marginTop: "100px" }}> 汽车电路状态</div> 
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>{this.state.elecWayState}</div> 
                  </div>
                </div> 
              </div>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
              <div style={{ display: "flex", alignItems: "center", paddingTop: "5%", justifyContent: "center", height: "100%", width: "100%" }}> 
                <div style={{ position: "relative", border: "1px solid #e8e8e8", height: "100%", width: "100%", borderRadius: "4px", }}> 
                  <div style={{ position: "absolute", top: "-20px", marginLeft: "30%", height: "100px", width: "100px", backgroundColor: "#ed7010", borderRadius: "4px", boxShadow: "0 0 10px grey", display: "flex", alignItems: "center", justifyContent: "center", }}> 
                    <Icon type={this.state.carDoorState === "加锁" ? "poweroff" : "exclamation"} style={{ color: "white", fontSize: "60px" }} /> 
                  </div> 
                  <div style={{ textAlign: "center" }}> 
                    <div style={{ fontSize: "14px", marginTop: "100px" }}> 车门状态</div> 
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>{this.state.carDoorState}</div> 
                  </div>
                </div> 
              </div>
              </Card.Grid>
            </Card>
            </div>
            <div>
              <Card
                style={{ width: "100%" }} 
                tabList={tabList} 
                activeTabKey={this.state.key} 
                onTabChange={(key) => { 
                  this.onTabChange(key, "key"); 
                }}> 
                {contentList[this.state.key]} 
            </Card>
            </div>
            <div id="inputDevice">
              <Modal title="输入汽车信息"
                visible={this.state.inputDeviceModalVisible}
                onOk={this.inputDeviceModalHandleOk}
                onCancel={this.inputDeviceModalHandleCancel}
                cancelText="取消"
                okText="确定"
              >
                <InputGroup compact>
                <Input 
                  style={{ width: "20%" }}
                  defaultValue="terminalId"
                  disabled={true}
                  className="inputTitle"/>
                <Input 
                  style={{ width: "80%" }}
                  placeholder="请输入汽车terminalId"
                  value={this.state.inputDeviceTerminalId}
                  onChange={(e)=> {
                    this.setState({inputDeviceTerminalId: e.target.value});
                  }}
                  />
                </InputGroup>
                <InputGroup compact>
                  <Input
                    style={{ width: "20%" }}
                    defaultValue="开始时间"
                    disabled={true}
                    className="inputTitle" />
                  <DatePicker showTime
                    style={{ width: "80%" }}
                    placeholder="请输入查询开始时间"
                    key={this.state.keyValue}
                    onChange={(e)=>{
                      this.setState({inputDeviceSt: e._d});
                    }}
                    />
                </InputGroup>
                <InputGroup compact>
                  <Input
                    style={{ width: "20%" }}
                    defaultValue="结束时间"
                    disabled={true}
                    className="inputTitle"/>
                  <DatePicker showTime
                    style={{ width: "80%" }}
                    placeholder="请输入查询结束时间"
                    key={this.state.keyValue}
                    onChange={(e)=>{
                      this.setState({inputDeviceEt: e._d});
                    }}
                  />  
                </InputGroup>
              </Modal>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;