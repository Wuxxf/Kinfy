import React, { Component } from 'react';
import { connect } from 'dva';
import MyIcon from '@/components/MyIcon';
import { routerRedux } from 'dva/router';
import {
  Icon,
  Col,
  Row,
  Divider,
  Tooltip,
  message,
} from 'antd';
import TweenOne from 'rc-tween-one';
import UsedModal from './UsedModal'
import styles from '../Guide.less';
import commonStyle from '../../../global.less'; // 公共样式

@connect()
class CommonlyUsed extends Component {
  count = 0; //  鼠标点击次数（区别单双击)

  constructor(props){
    super(props)
    // 抖动动画
    this.animation1 = [
      {
        rotate:1,
        duration: 200,
      },
      {
        rotate:-1,
        duration: 200,
      },

      {
        rotate:1,
        duration: 200,
      },
      {
        rotate:-1,
        duration: 200,
      },
    ];
    this.animation2 = [
      {
        rotate:-1,
        duration: 200,
      },
      {
        rotate:1,
        duration: 200,
      },

      {
        rotate:-1,
        duration: 200,
      },
      {
        rotate:1,
        duration: 200,
      },
    ];

    this.state={
      data:[],
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.onKeyDown)
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.commonlyUsed !== this.props.commonlyUsed) {

      this.setState({
        data:nextProps.commonlyUsed
      });

    }

  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.onKeyDown)
    clearTimeout(this.timeout)
  }

  shuffle = (i)=> {
    if(i % 4 === 0 || i % 4 === 3)
      return this.animation2
    return this.animation1
  }

  timeout =()=>{
    setTimeout(()=>{
      if(!this.state.isDeling) return;
      this.setState({
        isDeling:false,
      })
    }, 30000);
  }

  onKeyDown=(e)=>{
    const { isDeling } = this.state;
    // 设置 alt+s 快捷键
    if (e.altKey && e.keyCode === 83){
      this.setState({
        isDeling:!isDeling
      },()=>{
        if(!isDeling){
          this.timeout()
        }
      });
    }
  }

  show = () => {

    this.setState({
      visible:true
    })

  }

  handleOk=(selectedUsed)=>{

    const { dispatch } = this.props;
    dispatch({
      type: 'guide/fetchCommonlyUsedAdd',
      payload: {
        data: selectedUsed,
      },
      callback: res => {
        if (res.errcode) {
          message.error(res.msg);
        } else {
          message.success(res.msg);
          this.setState({
            visible:false,
          })
          dispatch({
            type: 'guide/fetch',
          });
        }
      },
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  commonlyUsed = () =>{
    const { data , isDeling } = this.state;
    if(isDeling)
      return data.map((items,i)=>(
        <Col xs={8} sm={3} md={3} lg={4} xl={12} key={items.id}>
          <TweenOne
            animation={this.shuffle(i)}
            repeat={-1}
            yoyo
          >
            <div style={{margin:'0 auto',width:56}}>
              <div className={styles['commonly-used-box']}>
                <div className={styles['commonly-used-del']} onClick={()=>this.del(items.id)}>
                  ×
                </div>
                <div style={{userSelect:'none'}}>
                  <MyIcon type={items.icon_name} style={{fontSize:56}} />
                  <div>{items.name}</div>
                  <br />
                </div>
              </div>
            </div>
          </TweenOne>
        </Col>
      ))
    else
      return data.map(items=>(
        <Col xs={8} sm={3} md={3} lg={4} xl={12} key={items.id}>
          <div style={{margin:'0 auto',width:56,cursor: 'pointer',userSelect:'none'}} onClick={()=>this.userClick()}>
            <MyIcon type={items.icon_name} style={{fontSize:56}} />
            <div>{items.name}</div>
            <br />
          </div>
        </Col>

    ))
  }

  del = (id) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'guide/fetchCommonlyUsedDel',
      payload: {
        id,
      },
      callback: () => {
        dispatch({
          type: 'guide/fetch',
        });
      },
    });

  }

  userClick = () =>{

    this.count += 1;
    setTimeout(() => {
      if (this.count === 1) {
        this.props.dispatch(routerRedux.push('/supplierManagement/supplierManagement'))
      } else if (this.count === 2) {
        this.setState({
          isDeling:true,
        })
        this.timeout();
      }
      this.count = 0;
    }, 250);

  }

  render() {
    const { data } = this.state;
    const detailsProps ={
      selectedUsed:data,
      visible:this.state.visible,
      handleOk:this.handleOk,
      handleCancel:this.handleCancel
    }

    return (
      <div className={commonStyle['rowBackground-div']} style={{height:'490px'}}>
        <Row type="flex" justify="space-around" align="middle">
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className={styles.divider}>
            <span className={styles.title}>
              常用功能&nbsp;
              <Tooltip className={styles['tooltip-bg']} placement="top" title={<p>双击常用功能选择删除<br />30秒自动取消<br />(快捷键：Alt+s)</p>}>
                <Icon type="question-circle" style={{fontSize:13}} />
              </Tooltip>
              <Icon onClick={()=>this.show()} type="setting" theme="twoTone" style={{cursor: 'pointer',float:'right',fontSize:22}} />
            </span>
            <Divider />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Row gutter={9}>
              {data.length?this.commonlyUsed():<div className={styles['no-commonly-used']}>暂无常用功能</div>}
            </Row>
            <UsedModal {...detailsProps} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CommonlyUsed
