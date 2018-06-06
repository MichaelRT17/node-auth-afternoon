import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: []
    }
  }

  componentDidMount() {
    axios.get('/students').then(res => {
      this.setState({
        students: res.data
      })
    })
  }

  render() {
    let mapped = this.state.students.map(student => {
      return (
        <div key={student.id}>
          <p>Name: {student.student}</p>
          <p>Email: {student.email_address}</p>
          <p>Phone: {student.phone}</p>
          <p>Grade: {student.current_grade}</p>
        </div> 
      )
    })
    return (
      <div className="App">
        <h1>List of Students:</h1>
        {mapped}
      </div>
    );
  }
}

export default App;
