import React, { Component } from 'react';

const AA = (props)=>{
  return(
    <div>{props.name}</div>
  )
}

class AllUsed extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

 render() {
    return <div><AA name='aaaaa' /></div>;
  }
}

export default AllUsed
