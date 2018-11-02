import React, { Component } from 'react';
import { Button, Icon, Row, Col, Form, Modal,Tooltip } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
class OtherIncomeAndPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otherIncomeVisible: false,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  onCancel = () => {
    this.setState({
      otherIncomeVisible: false,
    });
    this.resetForm();
  };

  /**
   * 打开其他收入
   */
  show = () => {
    this.setState({
      otherIncomeVisible: true,
    });
  };

  /**
   * 保存
   */
  save = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let sum = 0;
      for (const i in fieldsValue) {
        if (Object.prototype.hasOwnProperty.call(fieldsValue, i)) {
          if (i !== 'id' && i !== 'remarks' && fieldsValue[i]) {
            sum += Number(fieldsValue[i]);
          }
        }
      }
      this.setState({
        otherIncomeVisible: false,
      });
      if (typeof this.props.dataInfo === 'function') {
        this.props.dataInfo(fieldsValue, sum);
      }
    });
  };

  /**
   * 重置表单（清空）
   */
  resetForm = () => this.props.form.resetFields();

  render() {
    const { form, dataSource } = this.props;
    const idStyle = { margin: 0, padding: 0, height: 0, width: 0 };
    const item = dataSource.map(fields => {
      return (
        <Col
          span={fields.span}
          style={fields.formName === 'id' ? idStyle : null}
          key={fields.formName}
        >
          <FormItem
            labelCol={{ span: fields.labelCol }}
            wrapperCol={{ span: 24 - fields.labelCol }}
            label={fields.label}
          >
            {form.getFieldDecorator(fields.formName, {
              rules: fields.rules,
              initialValue: fields.initialValue,
            })(fields.tab)}
          </FormItem>
        </Col>
      );
    });

    return (
      <div style={{ display: 'inline-block', padding: '2px' }}>
        <Tooltip placement="topLeft" title={`￥${this.props.sum}`} arrowPointAtCenter>
          <Button type="dashed" onClick={this.show} className={styles.button}>
            <span>
              <Icon type="plus" theme="outlined" />
              {this.props.buttonName}(￥{this.props.sum})
            </span>
          </Button>
        </Tooltip>
        
        <Modal
          title={this.props.buttonName}
          visible={this.state.otherIncomeVisible}
          onCancel={this.onCancel}
          onOk={this.save}
        >
          <Row>{item}</Row>
        </Modal>
      </div>
    );
  }
}
export default OtherIncomeAndPay