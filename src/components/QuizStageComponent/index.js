import React from "react";
import {Container} from "react-bootstrap";
import GeneralInputComponent from "../GeneralInputComponent";

export default class QuizStageComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };

    this.updateData = this.updateData.bind(this);
    this.handleOnProceed = this.handleOnProceed.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
  }

  updateData(e) {

    let {value} = e.target;

    if (this.props.type === "boolean") {
      value = e.target.checked.toString();
    }

    this.setState({
      ...this.state,
      data: value.length === 0 ? null : value,
    });
    if (value.length !== 0)
      this.props.checkValue(value, this.props.valueName);
    else
      this.props.checkValue(null, this.props.valueName);
  }

  handleEnterKeyPress(e) {
    const {data} = this.state;
    const {optional} = this.props;

    if (e.key !== "Enter" || !(data || optional)) {
      return;
    }
    this.handleOnProceed();
  }

  handleOnProceed() {
    this.props.onProceed(this.state.data);
  }

  render() {
    const {optional, title, placeholder = title, type, allowedFields, text, _value, hideOptionalText, preText} = this.props;

    return (
      <Container>
        {preText && (
          <>
            <br />
            <hr />
            <br />
            <h2>{preText}</h2>
            <hr />
          </>
        )}
        <br/>
        <h4 align="center">{text}</h4>
        <h3>{title}</h3>
        {optional && !hideOptionalText && <p className={"text-muted"}>This question is optional.</p>}

        <GeneralInputComponent type={type}
                               infoText={placeholder}
                               _value={_value}
                               updateData={this.updateData}
                               handleEnterKeyPress={this.handleEnterKeyPress}
                               allowedFields={allowedFields}
        />
      </Container>
    );
  }
}