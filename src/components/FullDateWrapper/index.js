import React from "react";
import {Col} from "react-bootstrap";

const currentYear = new Date().getFullYear();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = [];
const years = [];

for (let i = 1; i < 32; i++)
  days.push(i);

for (let i = 17; i > 13; i--)
  years.push(currentYear - i);

export default class FullDateWrapper extends React.Component {

  constructor(props) {
    super(props);

    this.handleItemUpdate = this.handleItemUpdate.bind(this);

    const oldValue = props._value;
    if(oldValue) {
      const oldValueParts = oldValue.split("/");

      this.state = {
        day: oldValueParts[0],
        month: months[parseInt(oldValueParts[1]) - 1],
        year: oldValueParts[2],
      };
    } else {
      this.state = {
        day: null,
        month: null,
        year: null,
      };
    }
  }

  handleItemUpdate(name, e) {
    const {value} = e.target;

    const newState = {
      ...this.state,
      [name.toLowerCase()]: value,
    };

    this.setState(newState);

    // Check if this is complete
    const {day, month, year} = newState;

    if (day && month && year) {
      console.log("Handling update...");

      this.props.updateData({
        target: {
          value: `${day}/${months.indexOf(month) + 1}/${year}`,
        }
      });
    }
  }

  render() {
    const { day, month, year } = this.state;

    return (
      <>
        <SelectArrayWrapper name={"Day"} handleItemUpdate={this.handleItemUpdate} data={days} _value={day}/>
        <SelectArrayWrapper name={"Month"} handleItemUpdate={this.handleItemUpdate} data={months} _value={month}/>
        <SelectArrayWrapper name={"Year"} handleItemUpdate={this.handleItemUpdate} data={years} _value={year}/>
      </>
    );
  }
}

const SelectArrayWrapper = ({name, handleItemUpdate, data, _value}) => (
  <Col>
    <select className={"form-control"} onChange={e => {
      handleItemUpdate(name, e);
    }} value={_value || "default"}>
      <option value={"default"} disabled>{name}</option>
      {data.map(i => <option key={`${name}_${i}`} value={i}>{i}</option>)}
    </select>
  </Col>
);