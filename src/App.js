import React from "react";
import "./scss/marling.scss";
import "animate.css/animate.css";
import {Button, Col, Container, Modal, ProgressBar, Row} from "react-bootstrap";
import QuizStageComponent from "./components/QuizStageComponent";
import logo from "./imgs/logo.png";
import getQuestions from "./questions";
import CookieConsent from "react-cookie-consent";
import axios from "axios";

export default class App extends React.Component {

  constructor(props) {
    super(props);

    const compilingData = {};
    const localStorageData = JSON.parse(window.localStorage.getItem("applicationData")) || {};

    let currentQuestionSet = -1;
    getQuestions().forEach((questionSet, i) => {
      questionSet.forEach(question => {
        const potentialValue = localStorageData[question.valueName] || null;

        if(!potentialValue && !question.optional && currentQuestionSet === -1) {
          // This is where they've got up to
          currentQuestionSet = i;
        }

        compilingData[question.valueName] = potentialValue;
      });
    });

    console.log(`Compiling Data:`, compilingData);

    this.state = {
      hasReturned: Object.keys(localStorageData).length > 0,
      count: 0,
      currentQuestionSet: currentQuestionSet === -1 ? 0 : currentQuestionSet,
      currentQuestion: 0,
      totalQuestionNumber: 0,
      rawQuestionData: getQuestions(),
      compilingData,
      complete: false,
      allPageDataValid: false,
      sentApplication: false,
      _appId: "Sending...",
      showResetModal: false,
    };

    this.calculateTotalQuestionCount = this.calculateTotalQuestionCount.bind(this);
    this.onQuestionProceed = this.onQuestionProceed.bind(this);
    this.getCurrentQuestionData = this.getCurrentQuestionData.bind(this);
    this.handleGoBackward = this.handleGoBackward.bind(this);
    this.handleGoForward = this.handleGoForward.bind(this);
    this.checkValue = this.checkValue.bind(this);
    this.calculateCurrentQuestion = this.calculateCurrentQuestion.bind(this);
    this.toggleResetModal = this.toggleResetModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      allPageDataValid: this.isPageDataValid(),
    });
  }

  toggleResetModal() {
    this.setState({
      ...this.state,
      showResetModal: !this.state.showResetModal,
    });
  }

  calculateTotalQuestionCount() {
    const {compilingData, rawQuestionData} = this.state;

    let count = 0;

    Object.keys(compilingData).forEach(item => {
      rawQuestionData.forEach(questionSet => {
        const data = questionSet.filter(q => q.valueName === item)[0];

        if (data && !data.optional) {
          count++;
        }
      });
    });

    return count;
  }

  handleGoForward() {
    this.onQuestionProceed(); // Is any more logic needed?
  }

  handleGoBackward() {
    const { currentQuestionSet } = this.state;

    if(currentQuestionSet === 0)
      return;

    const buildingState = {
      ...this.state,
      currentQuestionSet: currentQuestionSet - 1,
    };

    buildingState.allPageDataValid = this.isPageDataValid(buildingState);

    this.setState(buildingState);
  }

  onQuestionProceed() {
    const buildingState = {
      ...this.state,
      currentQuestionSet: this.state.currentQuestionSet + 1,
    };

    if(buildingState.currentQuestionSet === this.state.rawQuestionData.length) {
      // They have completed the application
      buildingState.complete = true;
      buildingState.allPageDataValid = false;
      this.sendApplication();
    } else {
      buildingState.allPageDataValid = this.isPageDataValid(buildingState);
    }

    this.setState(buildingState);
  }

  async sendApplication() {
    const { data } = await axios.post(process.env.REACT_APP_SERVER_ADDRESS + "/save-application", this.state.compilingData);

    // Remove the local storage so they can't double send
    window.localStorage.removeItem("applicationData");

    this.setState({
      sentApplication: true,
      _appId: data.id,
    });
  }

  getCurrentQuestionData() {
    const {currentQuestionSet, currentQuestion, rawQuestionData} = this.state;

    return rawQuestionData[currentQuestionSet][currentQuestion];
  }

  checkValue(value, title) {
    const newCompilingData = this.state.compilingData;

    newCompilingData[title] = value;

    // Save the compiling data to local storage
    window.localStorage.setItem("applicationData", JSON.stringify(newCompilingData));

    this.setState({
      compilingData: newCompilingData,
      allPageDataValid: this.isPageDataValid({ ...this.state, compilingData: newCompilingData }),
    });
  }

  isPageDataValid(state = this.state) {
    let dataMap = true;
    state.rawQuestionData[state.currentQuestionSet].filter(item => !item.optional).forEach(item => {
      if (!state.compilingData[item.valueName]) {
        dataMap = false;
      }
    });

    return dataMap;
  }

  calculateCurrentQuestion() {
    const {compilingData, rawQuestionData} = this.state;

    let count = 0;

    Object.keys(compilingData).forEach(item => {
      const value = compilingData[item];

      rawQuestionData.forEach(questionSet => {
        const data = questionSet.filter(q => q.valueName === item)[0];

        if (data && !data.optional && value) {
          count++;
        }
      });
    });

    return count;
  }

  handleApplicationReset() {
    window.localStorage.removeItem("applicationData");
    window.location.reload();
  }

  render() {
    const {rawQuestionData, currentQuestionSet, compilingData, hasReturned, _appId, sentApplication, complete} = this.state;

    return (
      <div>
        <CookieConsent>
          We use cookies to allow you to return to this application later. By utilising this website you agree to this.
        </CookieConsent>
        <Row>
          <Col md={12}>
            <header>
              <Container>
                <br/>
                <img src={logo} height={118} alt={"School Logo"}/>
                <br/>
                <br/>
              </Container>
            </header>
            <Container>
              <br/>
              {!complete ? (
                <>
                  <ProgressBar
                    variant={"success"}
                    min={0}
                    max={this.calculateTotalQuestionCount()}
                    now={this.calculateCurrentQuestion()}
                  />
                  {hasReturned ? <p className={"text-muted"} onClick={this.toggleResetModal} style={{cursor: "pointer"}}>Welcome back! Click Here to reset your application.</p>
                    : <br />}
                </>
              ) : (
                <div className={"text-center"}>
                  <br />
                  <i className={`fas fa-${sentApplication ? "check" : "spinner fa-spin"} fa-5x`} />
                  <br />
                  <br />
                  <h1>{sentApplication ? "Your application has been successfully submitted." : "Submitting application..."}</h1>
                  {sentApplication && <p></p>}
                  <br />
                  <pre>
                    {sentApplication ? `Application ID: ${_appId}` : "This will only take a few seconds."}
                  </pre>
                </div>
              )}
            </Container>
            {!complete && <Container>
              <Row>
                <Col xs={5} md={3}>
                  <Button variant={"outline-success"} block onClick={this.handleGoBackward} disabled={currentQuestionSet === 0}>
                    <i className="fas fa-long-arrow-alt-left" style={{paddingRight: 5}} />
                    Back
                  </Button>
                </Col>

                <Col />

                <Col xs={5} md={3}>
                  <Button variant={"outline-success"} block onClick={this.handleGoForward} disabled={!this.state.allPageDataValid || currentQuestionSet === rawQuestionData.length - 1}>
                    Forward
                    <i className="fas fa-long-arrow-alt-right" style={{paddingLeft: 5}} />
                  </Button>
                </Col>
              </Row>
            </Container> }
            {!complete && rawQuestionData[currentQuestionSet].map(_q => {
              const {question, optional, type, allowedFields, text, valueName, hideOptionalText, preText} = _q;

              return (
                <QuizStageComponent
                  key={`question_item_${question}_${valueName}`}
                  optional={!!optional}
                  hideOptionalText={!!hideOptionalText}
                  text={text}
                  type={type}
                  valueName={valueName}
                  checkValue={this.checkValue}
                  allowedFields={allowedFields}
                  preText={preText}
                  title={question}
                  _value={compilingData[valueName]}
                />
              );
            })}
          </Col>
          <Container>
            <br/>
            {this.state.allPageDataValid && (
              <Button variant={"outline-success"} className={"animated fadeIn faster"} block
                      onClick={this.onQuestionProceed}>Proceed</Button>)}
          </Container>
        </Row>
        <br/>
        <br/>

        <Modal show={this.state.showResetModal} centered onHide={this.toggleResetModal}>
          <Modal.Header closeButton>
            <Modal.Title>Reset Application</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Are you sure you want to reset your application? This will delete all currently entered data.</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant={"secondary"} onClick={this.toggleResetModal}>
              Cancel
            </Button>
            <Button variant={"danger"} onClick={this.handleApplicationReset}>
              Reset Application
            </Button>
          </Modal.Footer>
        </Modal>

        <footer>
          <h5 className={"text-center"}>Developed By Harry Breen, Tom Heaton & Scott Hiett</h5>
          <p className={"text-center text-muted"}>All Students of Marling</p>
        </footer>
      </div>
    );
  }
}