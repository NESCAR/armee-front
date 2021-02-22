import React, { Component } from "react";
import { Button, Input, message, Row, Icon, Card } from "antd";
import { login } from "../axios";
import "./SignIn.css";

export default class SignIn extends Component {
  state = {
    userID: "",
    password: ""
  };

  componentwillMount = () => {

  }
  componentDidMount = () => {

  };

  login = () => {
    if (!this.state.userID) {
      message.error("请输入用户名");
      return;
    }
    if (!this.state.password) {
      message.error("请输入密码");
      return;
    }
    // 登录函数
    login([this.state.userID, this.state.password]).then(res => {
      if (res.data.status === 1) {
        message.success("登陆成功");
        localStorage.setItem("token", res.data.data.refresh_token);
        localStorage.setItem("access_token", res.data.data.access_token);
        localStorage.setItem("userID", this.state.userID);
        localStorage.setItem("user_type", res.data.data.userType[0].value);
        setTimeout(function () {
          window.location.href = "/app/otaHistory";
        }, 1000);
      } else {
        message.error("用户名或密码错误");
      }
    });
  };

  render() {
    return (
      <div>
        <div style={{ display: "flex", flexDirection: 'column' }}>
          <div className="SignIn-body">
            <div className="cover">
              <Row type="flex" justify="center">
                <Card
                  className="loadpart"
                  title={"瑞立-OTA信息管理平台"}
                >
                  <Row type="flex" justify="center">
                    <Input
                      size="large"
                      className="SignIn-Input"
                      placeholder="请输入用户名"
                      prefix={<Icon type="user" />}
                      onChange={e => this.setState({ userID: e.target.value })}
                      value={this.state.userID}
                    />
                  </Row>
                  <Row type="flex" justify="center">
                    <Input
                      size="large"
                      className="SignIn-Input"
                      placeholder="请输入密码"
                      prefix={<Icon type="lock" />}
                      type="password"
                      onChange={e => this.setState({ password: e.target.value })}
                      value={this.state.password}
                    />
                  </Row>
                  <Row type="flex" justify="center">
                    <Button
                      className="SignIn-requestbutton"
                      onClick={() => {
                        this.login();
                      }}
                    >
                      登录
                      </Button>
                  </Row>
                </Card>
              </Row>
            </div>
          </div>
          <Row type="flex" justify="center" style={{ paddingTop: '2%', background: "rgba(255,255,255,0.9)", height: "10vh" }}>
            浙江大学NeSC课题组-瑞立集团
            {/* <a id="beian" href="http://www.beian.miit.gov.cn" h="ID=SERP,5041.1">浙ICP备18047772号-1</a> */}
        </Row>
        </div>
      </div>
    );
  }
}
