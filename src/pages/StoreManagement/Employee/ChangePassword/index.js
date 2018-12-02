import React, { Component } from 'react';
import {
  Form,
  Modal,
  Popover,
  Input,
  Progress,
} from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@Form.create()
class ChangePassword extends Component {
  constructor(props){
    super(props)
    this.state={
      help:'',
    }
  }

  handleConfirmBlur = e => {
    const { confirmDirty } = this.state;
    const { value } = e.target;
    this.setState({ confirmDirty:confirmDirty || !!value });
  }

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  }

  checkPassword = (rule, value, callback) => {
    const { visible , confirmDirty} = this.state;
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  }

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  }

  onCancel = () => {
    this.setState({
      visible: false
    }, () => {
      this.props.onCancel()
    })
  }

  handleSubmit = e => {
    const {
      form
    } = this.props;
    e.preventDefault();
    form.validateFields({
      force: true
    }, (err, values) => {
      if (!err) {
        this.props.onOk(values);
      }
    });
  };

  render() {
    const { help,visible } = this.state;
    const { passwordVisible,form } = this.props;
    return (
      <Modal
        title='修改密码'
        visible={passwordVisible}
        onCancel={this.onCancel}
        onOk={this.handleSubmit}
        destroyOnClose
      >
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="新密码" help={help}>
          <Popover
            content={
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[this.getPasswordStatus()]}
                {this.renderPasswordProgress()}
                <div style={{ marginTop: 10 }}>
                  请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  <a onClick={()=>this.setState({visible:false})}>知道了</a>
                </div>
              </div>
            }
            overlayStyle={{ width: 240 }}
            placement="right"
            visible={visible}
          >
            {form.getFieldDecorator('password', {
              rules: [
                {
                  validator: this.checkPassword,
                },
              ],
            })(<Input type="password" placeholder="至少6位密码，区分大小写" />)}
          </Popover>
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="确认新密码">
          {form.getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '请确认密码！',
              },
              {
                validator: this.checkConfirm,
              },
            ],
          })(<Input type="password" placeholder="确认密码" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default ChangePassword
