import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const WorkoutButtons = ({
  startWorkout,
  resetWorkout,
  randomizeWorkout,
  timerState,
}) => {
  return (
    <Row>
      <Col xs={{ span: 4 }} className="p-1">
        <Button
          className="workout-btn light-box-shadow"
          variant="primary"
          block
          disabled={timerState.period !== "NOT_STARTED"}
          onClick={() => startWorkout()}
        >
          Start
        </Button>
      </Col>
      <Col xs={{ span: 4 }} className="p-1">
        <Button
          className="workout-btn light-box-shadow"
          variant="danger"
          block
          disabled={timerState.period === "NOT_STARTED" || timerState.isActive}
          onClick={() => resetWorkout()}
        >
          Reset
        </Button>
      </Col>
      <Col xs={{ span: 4 }} className="p-1">
        <Button
          className="workout-btn light-box-shadow"
          variant="info"
          block
          onClick={() => randomizeWorkout()}
          disabled={timerState.period !== "NOT_STARTED"}
        >
          Randomize
        </Button>
      </Col>
    </Row>
  );
};

export default WorkoutButtons;
