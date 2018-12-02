import React, { Component } from 'react';
import MyIcon from '@/components/MyIcon';
import {
  Col,
  Row,
} from 'antd';
import styles from './index.less';

class SelectedUsed extends Component {
  constructor(props){
    super(props)
    this.state={
      selectedUsed:props.selectedUsed
    }
  }

  componentWillReceiveProps(nextProps) {

    if(nextProps.selectedUsed !== this.props.selectedUsed){
      this.setState({
        selectedUsed:nextProps.selectedUsed
      })
    }
  }

  del = (items) => {
    const { selectedUsed } = this.state;
    for (let i = 0; i < selectedUsed.length; i++) {
      if(items.route === selectedUsed[i].route){
        selectedUsed.splice(i,1)
      }
    }

    this.props.callback(selectedUsed)

  }

  selectedUsed = (selectedData) =>{

    return selectedData.map((items)=>(
      <Col xs={6} md={3} key={JSON.stringify(items)}>
        <div style={{margin:'0 auto',width:56}}>
          <div className={styles['commonly-used-box']}>
            <div className={styles['commonly-used-del']} onClick={()=>this.del(items)}>
              ×
            </div>
            <div style={{userSelect:'none'}}>
              <MyIcon type={items.icon_name} style={{fontSize:56}} />
              <div>{items.name}</div>
              <br />
            </div>
          </div>
        </div>
      </Col>
    ))
  }

  render() {

    return (
      <Row>
        {this.selectedUsed(this.state.selectedUsed)}
      </Row>
    );
  }
}

export default SelectedUsed
