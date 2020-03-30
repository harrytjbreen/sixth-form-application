import React from "react";
import {Card, Col, Row} from "react-bootstrap";
import getSubjects from "../../subjects";
import GeneralInputComponent from "../GeneralInputComponent";

export default class SubjectSelector extends React.Component {

  constructor(props) {
    super(props);
    let oldValue = props._value;
    let oldBreadth = null;

    let subjectList = getSubjects().map(subject => subject.name).sort().map(name => ({ name }));

    if(oldValue) {
      oldValue = JSON.parse(oldValue);

      // Check if this has a breadth option
      if(oldValue.breadthOption) {
        oldBreadth = oldValue.breadthOption;

        delete oldValue["breadthOption"];
      }

      const _names = Object.values(oldValue);

      subjectList = subjectList.filter(wrapper => !_names.includes(wrapper.name));
    }

    this.state = {
      isDragging: false,
      notSelectedSubjects: subjectList,
      selectedSubjects: oldValue || {},
      search: "",
      scrollY: 0,
      breadthOption: oldBreadth,
    };

    //updateData & _value

    this.toggleDragState = this.toggleDragState.bind(this);
    this.allowDrop = this.allowDrop.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handlePotentialUpdate = this.handlePotentialUpdate.bind(this);
    this.listenToScroll = this.listenToScroll.bind(this);
    this.setBreadthOption = this.setBreadthOption.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.listenToScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenToScroll);
  }

  listenToScroll() {
    this.setState({
      ...this.state,
      scrollY: document.body.scrollTop || document.documentElement.scrollTop,
    })
  }

  handleDrop(e) {
    e.preventDefault();

    const subjectName = e.dataTransfer.getData("subjectName");
    const selectedSubjectTargetId = parseInt(e.target.getAttribute("dropitemnumber").replace("drop_item_", "")) - 1;

    // Check the selected to see if there is already a subject here
    const potentialItem = this.state.selectedSubjects[selectedSubjectTargetId];
    let subjectList = this.state.notSelectedSubjects;

    if(potentialItem) {
      subjectList.push({ name: potentialItem });
      subjectList = subjectList.map(subject => subject.name).sort().map(name => ({ name }));
    }

    const potentialState = {
      ...this.state,

      isDragging: false,
      notSelectedSubjects: subjectList.filter(item => item.name !== subjectName),
      selectedSubjects: { ...this.state.selectedSubjects, [selectedSubjectTargetId]: subjectName },
      search: "",
    };

    this.handlePotentialUpdate(potentialState);
    this.setState(potentialState);
  }

  setBreadthOption(breadthOption) {
    const state = {
      ...this.state,
      breadthOption
    };

    this.handlePotentialUpdate(state);
    this.setState(state);
  }

  handlePotentialUpdate(state = this.state) {
    const { selectedSubjects, breadthOption } = state;

    let passed = true;

    [1, 2, 3].forEach(i => {
      if(!selectedSubjects[`${i - 1}`])
        passed = false;
    });

    if(!selectedSubjects["3"] && !breadthOption) {
      passed = false;
    } else if(breadthOption && !selectedSubjects["3"]) {
      selectedSubjects.breadthOption = breadthOption;
    }

    this.props.updateData({ target: {
      value: passed ? JSON.stringify(selectedSubjects) : ""
    } });
  }

  allowDrop(e) {
    e.preventDefault();
  }

  toggleDragState() {
    this.setState({
      ...this.state,
      isDragging: !this.state.isDragging,
    });
  }

  handleSearch(e) {
    this.setState({
      ...this.state,
      search: e.target.value.toLowerCase(),
    });
  }

  handleRemoveItem(i) {
    const { selectedSubjects, notSelectedSubjects } = this.state;

    // Get the subject
    const subject = selectedSubjects[i];

    if(!subject) {
      return;
    }

    delete selectedSubjects[i];

    notSelectedSubjects.push({ name: subject });

    const potentialState = {
      ...this.state,
      selectedSubjects,
      notSelectedSubjects: notSelectedSubjects.map(subject => subject.name).sort().map(name => ({ name })),
    };

    this.handlePotentialUpdate(potentialState);
    this.setState(potentialState);
  }

  render() {
    const { isDragging, notSelectedSubjects, selectedSubjects, search } = this.state;

    return (
      <Row>
        <Col md={12}>
          <p>Drag and drop subjects from the left hand panel into their priority on the right.</p>
          <br />
        </Col>
        <Col md={3}>
          <Row>
            <Col md={12}>
              <input type={"text"}
                     className={"form-control"}
                     placeholder={"Type to Search..."}
                     onChange={this.handleSearch}
                     value={search} />

              <br />
            </Col>

            {notSelectedSubjects.map(subject => subject.name).filter(name => name.toLowerCase().includes(search)).map(subject => <Subject name={subject}
                                                                                      key={`subject_item_${subject}`}
                                                                                      toggleDragState={this.toggleDragState} />)}
          </Row>
        </Col>
        <Col md={9}>
          <div style={{width: "100%", height: `${Math.max(this.state.scrollY - 400, 0)}px`}} />
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Priority</th>
                <th style={{width: "80%"}}>Subject</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(i => {
                const thisItemDrag = isDragging && !selectedSubjects[i - 1];

                return (
                  <tr key={`subject_landing_item_${i}`}>
                    <td>#{i}{i === 4 && " (Optional)"}</td>
                    <td>
                      <Card style={thisItemDrag ? { backgroundColor: "var(--success)", position: "relative" } : {}}>
                        <Card.Body className={"text-center"}
                                   style={thisItemDrag ? { color: "white" } : {}}
                                   dropitemnumber={`drop_item_${i}`}
                                   onDragOver={this.allowDrop}
                                   onDrop={this.handleDrop}>
                          {thisItemDrag ? "Drop Here!" : (selectedSubjects[i - 1] || "...")}
                          {selectedSubjects[i - 1] && <div style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            height: "100%"
                          }}>
                            <div style={{ display: "table", height: "100%" }}>
                              <i className="fas fa-times fa-fw fa-2x text-muted" style={{
                                display: "table-cell",
                                verticalAlign: "middle",
                                paddingRight: 15,
                                cursor: "pointer"
                              }} onClick={() => { this.handleRemoveItem(i - 1); }} />
                            </div>
                          </div>}
                        </Card.Body>
                      </Card>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <br />

          { !selectedSubjects["3"] ? (<>
            <p>
              You can choose to study 3 or 4 A Levels over two years (Please note that Higher Education Institutions will
              generally expect students to have studied 3 A Levels and base their entry criterion on this)
            </p>
            <p>Alternatively to a fourth subject, you can select a breadth option from the below.</p>
            <b>If you would like to take Further Mathematics as a Subject, please also select it here.</b>
            <GeneralInputComponent type={"dropdown"} infoText={"Select a breadth option..."} allowedFields={["Classical Civilisations",
              "Creative Writing",
              "EPQ",
              "Geology",
              "Global Perspectives",
              "Gold Duke of Edinburgh Award",
              "Mathematical Studies",
              "Sports Coaching", "Further Mathematics"]} updateData={(update) => {
                this.setBreadthOption(update.target.value);
            }} _value={this.state.breadthOption} />
              </>
          ) : (
            <p>By selecting a 4th subject, you are unable to select a breadth option or Further Maths. Please remove this if you would like to select either of these.</p>
          )}
        </Col>
      </Row>
    );
  }
}

const Subject = ({ name, toggleDragState }) => (
  <Col md={12}>
    <Card style={{cursor: "pointer"}} draggable={"true"} onDragStart={(e) => {
      e.dataTransfer.setData("subjectName", name);

      toggleDragState(e);
    }} onDragEnd={toggleDragState}>
      <Card.Body className={"text-center"}>{name}</Card.Body>
    </Card>
  </Col>
);