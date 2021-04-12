import React, { Component } from "react";
import { Button, Table, DatePicker } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import moment from "moment";

class PageWrapper extends Component {
  state = {
    singleData: {
      from: "",
      to: ""
    },
    tempArr: [],
    errVar: false
  };

  setData = (e, type) => {
    const singleData = { ...this.state.singleData };
    singleData[type] = moment(e).format("yyyy-MM-DD");
    this.setState({ singleData });
  };

  fetchData = () => {
    const { singleData } = this.state;
    const requestOption = {
      method: "GET",
      headers: {}
    };
    fetch("/api/interview.json", requestOption)
      .then(response => response.json())
      .then(response => {
        let tempArray = [];
        if (!singleData.from || !singleData.to) {
          tempArray = response;
          this.setState({singleData:{}});
        } else {
          response.forEach(element => {
            if (
              this.returnDate(element.date) >= this.returnDate(singleData.from) &&
              this.returnDate(element.date) <= this.returnDate(singleData.to)
            ) {
              tempArray.push(element);
            }
          });
        }
        let final = [];
        tempArray.forEach(e => {
          let i = final.findIndex(l => l.websiteId === e.websiteId);
          if (i === -1) {
            let sumed = {
              websiteId: "",
              missedChats: 0,
              chats: 0
            };
            let filtered = tempArray.filter(l => l.websiteId === e.websiteId);
            filtered.forEach(f => {
              sumed.websiteId = f.websiteId;
              sumed.missedChats += f.missedChats;
              sumed.chats += f.chats;
            });
            final.push(sumed);
          }
        });
        this.setState({ tempArr: final });
      })
      .catch(err => {
        console.log(err);
      });
  };

  returnDate = (d) => {
    return new Date(d).getTime();
  }

  render() {
    const { tempArr, singleData } = this.state;
    const columns = [
      {
        title: "website Id",
        dataIndex: "websiteId",
        key: "websiteId"
      },
      //   {
      //     title: "Date",
      //     dataIndex: "date",
      //     key: "date"
      //     // render: (text, obj) => (<span>{obj.date}{console.log(obj)
      //     // }</span>)
      //   },
      {
        title: "Chats",
        dataIndex: "chats",
        key: "chats"
      },
      {
        title: "Missed Chats",
        dataIndex: "missedChats",
        key: "missedChats"
      }
    ];
    return (
      <div
        style={{ width: "100%", padding: "20px", height: "calc(100% - 40px)" }}
      >
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex" }}>
            <div>From&nbsp;&nbsp;</div>
            <div style={{marginRight:"10px"}}>
              <DatePicker value={singleData.from ? moment(singleData.from) : null} onChange={e => this.setData(e, "from")} />
            </div>
            <div>To&nbsp;&nbsp;</div>
            <div style={{marginRight:"10px"}}>
              <DatePicker value={singleData.to ? moment(singleData.to) : null} onChange={e => this.setData(e, "to")} />
            </div>
            <div style={{marginRight:"10px"}}>
              <Button type="primary" onClick={this.fetchData}>
                Fetch
              </Button>
            </div>
            <div>
              <Button type="primary" onClick={() => this.setState({singleData:{}, tempArr:[]})}>
                Reset
              </Button>
            </div>
          </div>
        </div>
        {tempArr && tempArr.length === 0 ? (
          <div>Click on Fetch button to get data</div>
        ) : (
          <Table pagination={false} dataSource={tempArr} columns={columns} />
        )}
      </div>
    );
  }
}

export default PageWrapper;
