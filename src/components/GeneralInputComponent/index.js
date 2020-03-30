import React from "react";
import {Col, Row} from "react-bootstrap";
import 'react-infinite-calendar/styles.css';
import FullDateWrapper from "../FullDateWrapper";
import SubjectSelector from "../SubjectSelector";
import ExpandableTableList from "../ExpandableTableList";

const GeneralInputComponent = ({type, infoText, handleEnterKeyPress, updateData, allowedFields, _value}) => {

  switch (type) {
    case "text": {
      return (
        <input type={"text"}
               className={"form-control"}
               onChange={updateData}
               value={_value || ""}
               placeholder={infoText}
        />
      );
    }
    case "largeText": {
      return (
        <textarea className={"form-control"}
                  onChange={updateData}
                  value={_value || ""}
                  placeholder={infoText} />
      );
    }
    case "boolean": {
      return (
        <Row>
          <Col className={"text-left"}>
            {infoText}
          </Col>
          <Col className={"text-right"}>
            <input type={"checkbox"} width={10} onChange={updateData}/>
          </Col>
        </Row>
      );
    }
    case "dropdown": {
      return (
        <div>
          <select onChange={updateData}
                  className={"form-control"}
                  value={_value || "default"}
          >

            <option value="default" disabled>{infoText}</option>
            {
              allowedFields.map((i) => {
                return <option key={`field_${infoText}_${i.toString().toLowerCase()}`}
                               value={i.toString().toLowerCase()}
                               className={"dropdown-menu-center"}>
                  {i}</option>
              })
            }
          </select>
          <br/>
        </div>
      );

    }
    case "date": {
      return (
        <Row>
          <FullDateWrapper updateData={updateData} _value={_value} />
        </Row>
      );
    }
    case "subjectSelector": {
      return <SubjectSelector updateData={updateData} _value={_value} />;
    }
    case "qualificationFiller": {
      return <>
        <p>Please enter all of your expected grades for all of the subjects you have taken.</p>
        <ExpandableTableList headers={["Subject Name", "Predicted Grade"]}
                             examples={[["Biology", "6"], ["English Language", "7"]]}
                             updateData={updateData}
                             _value={_value} />
      </>;
    }
    case "currentQualificationFiller": {
      return <>
        <p>Please enter all of your current qualifications. This includes any past GCSEs taken, including half-GCSEs. If you don't have any, just click Proceed.</p>
        <ExpandableTableList headers={["Subject Name", "Level", "Exam Board", "Grade"]}
                             examples={[["Religious Studies", "1", "WJEC", "8"]]}
                             updateData={updateData}
                             _value={_value} />
      </>;
    }
    case "none": {
      return <></>;
    }
    default: {
      return <p>Something went wrong here!</p>;
    }
  }
};

export default GeneralInputComponent;