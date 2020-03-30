import React from "react";
import {Button} from "react-bootstrap";

export default class ExpandableTableList extends React.Component {

  constructor(props) {
    super(props);

    const { _value } = this.props;

    this.state = {
      data: _value && _value !== "" ? JSON.parse(this.props._value).data : [],
    };

    this.createNewRow = this.createNewRow.bind(this);
    this.updateFieldContent = this.updateFieldContent.bind(this);
    this.removeRow = this.removeRow.bind(this);
  }

  createNewRow() {
    const { data } = this.state;
    const { headers } = this.props;
    const obj = {};

    headers.forEach(header => obj[header] = "");
    data.push(obj);

    this.setState({
      ...this.state,

      data
    });
  }

  updateFieldContent(e, index, header) {
    const { value } = e.target;
    const { data } = this.state;

    data[index][header] = value;

    this.props.updateData({ target: { value: JSON.stringify({data})} });

    this.setState({
      ...this.state,

      data
    });
  }

  removeRow(index) {
    const { data } = this.state;

    data.splice(index, 1);

    if(data.length === 0) {
      this.props.updateData({target: { value: "" }});
    } else {
      this.props.updateData({target: {value: JSON.stringify({data})}});
    }

    this.setState({
      ...this.state,

      data
    });
  }

  render() {
    const { headers, examples } = this.props;
    const { data } = this.state;

    return (
      <>
        {examples && <>
          <table style={{width: "100%", opacity: "0.7"}}>
            <thead>
              <tr>
                {headers.map(header => (
                  <th key={`expandable_table_header_${header}_example`}>
                    Example {header}
                  </th>
                ))}
                <th style={{width: "10%"}} />
              </tr>
            </thead>
            <tbody>
              {examples.map((dataItem, i) => (
                <tr key={`expandable_table_item_${i}_example`}>
                  {headers.map((header, headerIndex) => (
                    <td>
                      <input type={"text"} disabled value={dataItem[headerIndex]} className={"form-control"} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <br />
        </>}

        <table style={{width: "100%"}}>
          <thead>
            <tr>
              {headers.map(header => (
                <th key={`expandable_table_header_${header}`}>
                  {header}
                </th>
              ))}
              <th style={{width: "10%"}}>Remove</th>
            </tr>
          </thead>
          <tbody>
            {data.map((dataItem, i) => (
              <tr key={`expandable_table_item_${i}`}>
                {headers.map(header => (
                  <td>
                    <input type={"text"}
                           value={dataItem[header]}
                           placeholder={dataItem[header]}
                           className={"form-control"}
                           onChange={(e) => {
                             this.updateFieldContent(e, i, header);
                           }}/>
                  </td>
                ))}
                <tr>
                  <Button variant={"danger"} block onClick={() => {
                    this.removeRow(i);
                  }}>X</Button>
                </tr>
              </tr>
            ))}
          </tbody>
        </table>
        <Button block onClick={this.createNewRow}>Add row</Button>
      </>
    );
  }
}