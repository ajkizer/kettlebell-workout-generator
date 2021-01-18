import React, { useEffect, useState } from "react";
import { Button, Col, Spinner } from "react-bootstrap";

const Timer = ({
  stopTimer,
  startTimer,
  currentTime,
  timerState,
  ui,
  workout,
}) => {
  const [display, setDisplay] = useState("0:00");

  useEffect(() => {
    if (currentTime === 0 && !timerState.isActive) {
      setDisplay("0:00");
    }

    const seconds = currentTime % 60;
    const minutes = Math.floor(currentTime / 60);

    let secondsText;

    if (seconds < 10) {
      secondsText = `0${seconds}`;
    } else {
      secondsText = seconds.toString();
    }

    setDisplay(`${minutes}:${secondsText}`);
  }, [currentTime]);

  return (
    <>
      <h1>{display}</h1>
      <p>Sets Completed: {workout.setsCompleted}/12</p>
      {workout.exercises.length &&
        workout.exercises.map((exercise, index) =>
          index === workout.exercises.indexOf(ui.currentExercise) ? (
            <Col>
              <Button
                variant="primary"
                key={exercise}
                className="light-box-shadow mt-1 mb-1 ml-4 mr-4 p-3 exercise-btn active"
              >
                {ui.isRandomizing ? (
                  <Spinner animation="border" className="mx-auto" />
                ) : (
                  <span className="fadeIn">{exercise}</span>
                )}
              </Button>
            </Col>
          ) : (
            <Col>
              <Button
                variant="light"
                key={exercise}
                className="light-box-shadow mt-1 mb-1 ml-4 mr-4 p-3 exercise-btn"
              >
                {ui.isRandomizing ? (
                  <Spinner animation="border" className="mx-auto" />
                ) : (
                  <span className="fadeIn">{exercise}</span>
                )}
              </Button>
            </Col>
          )
        )}
      <Col>
        {timerState.isActive ? (
          <Button
            className="m-4 light-box-shadow"
            variant="info"
            onClick={() => stopTimer()}
            disabled={
              timerState.period === "NOT_STARTED" ||
              timerState.period === "FINISHED"
            }
          >
            Pause
          </Button>
        ) : (
          <Button
            className="m-4 light-box-shadow"
            variant="info"
            onClick={() => startTimer()}
            disabled={
              timerState.period === "NOT_STARTED" ||
              timerState.period === "FINISHED"
            }
          >
            {timerState.period === "NOT_STARTED"
              ? "Click start to begin"
              : "Continue"}
          </Button>
        )}
      </Col>
    </>
  );
};

export default Timer;
