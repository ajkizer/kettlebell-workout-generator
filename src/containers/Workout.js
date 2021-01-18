import React, { useState, useEffect } from "react";
import { exercises } from "../data/exercises";
import { Col, Row, Card, Container } from "react-bootstrap";
import Timer from "../components/Timer";
import WorkoutButtons from "../components/WorkoutButtons";

const Workout = () => {
  const [workout, setWorkout] = useState({
    exercises: [],
    setsCompleted: 0,
  });

  const [workoutOptions, setWorkoutOptions] = useState({
    totalSets: 12,
    roundTime: 60,
    restTime: 60,
    conditioningTime: 300,
    prepTime: 5,
  });

  const [initialLoad, setInitialLoad] = useState(true);

  const [timerState, setTimerState] = useState({
    period: "NOT_STARTED",
    isActive: false,
  });

  const [currentTime, setCurrentTime] = useState(workoutOptions.prepTime);

  const [ui, setUI] = useState({
    currentDisplay: "Click to Start Workout",
    currentExercise: "",
    isRandomizing: false,
  });

  const startTimer = () => {
    if (timerState.period === "NOT_STARTED") return;
    setTimerState({ ...timerState, isActive: true });
    setWorkout({ ...workout, initialLoad: false });
  };

  const stopTimer = () => {
    if (timerState.period === "NOT_STARTED") return;
    setTimerState({ ...timerState, isActive: false });
  };

  const startWorkout = () => {
    setWorkout({ ...workout, setsCompleted: 0 });
    setTimerState({ ...timerState, period: "PREP", isActive: true });
    setCurrentTime(workoutOptions.prepTime);
  };

  const resetWorkout = () => {
    setWorkout({ ...workout, setsCompleted: 0 });
    setTimerState({ ...timerState, period: "NOT_STARTED", isActive: false });
    setCurrentTime(0);
  };

  const startRest = () => {
    setCurrentTime(workoutOptions.restTime);
    setTimerState({ ...timerState, period: "REST" });
    setWorkout({ ...workout, setsCompleted: workout.setsCompleted + 1 });
    setUI({
      ...timerState,
      currentExercise: `Next Up: ${genCurrentExercise()}`,
    });
  };

  const startRound = () => {
    setCurrentTime(workoutOptions.roundTime);
    setTimerState({ ...timerState, period: "EXERCISE" });
    setUI({ ...ui, currentExercise: genCurrentExercise() });
  };

  const finishWorkout = () => {
    setWorkout({ ...workout, setsCompleted: workoutOptions.totalSets });
    setTimerState({ ...timerState, period: "FINISHED", isActive: false });
  };

  const randomizeWorkout = () => {
    setUI({ ...ui, isRandomizing: true });
    const generateRandomIndex = (property) => {
      return Math.floor(Math.random() * property.length);
    };
    let randomExercises = [
      exercises.main[generateRandomIndex(exercises.main)],
      exercises.assistanceLower[generateRandomIndex(exercises.assistanceLower)],
      exercises.assistanceUpper[generateRandomIndex(exercises.assistanceUpper)],
      exercises.conditioning[generateRandomIndex(exercises.conditioning)],
    ];

    setTimeout(() => setUI({ ...ui, isRandomizing: false }), 1000);
    setWorkout({ ...workout, exercises: randomExercises });
  };

  const genCurrentExercise = () => {
    let display;

    if (workout.setsCompleted < 5) {
      display = workout.exercises[0];
    } else if (workout.setsCompleted < 8) {
      display = workout.exercises[1];
    } else if (workout.setsCompleted < 11) {
      display = workout.exercises[2];
    } else {
      display = workout.exercises[3];
    }

    return display;
  };

  const zeroCheck = () => {
    if (currentTime > 0) return;

    if (timerState.period === "PREP" || timerState.period === "REST") {
      startRound();
    } else if (timerState.period === "EXERCISE") {
      console.log("checking if rest break or not");
      workout.setsCompleted === workoutOptions.totalSets - 1
        ? finishWorkout()
        : startRest();
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      randomizeWorkout();
    }
    let intervalID;

    if (timerState.isActive) {
      zeroCheck();
      intervalID = setInterval(() => {
        setCurrentTime((currentTime) => currentTime - 1);
      }, 1000);
    }

    return () => clearInterval(intervalID);
  }, [timerState.isActive, currentTime]);

  return (
    <Container>
      <Row>
        <Col xs={{ span: 12 }}>
          <Card className="light-box-shadow p-4">
            <WorkoutButtons
              startWorkout={startWorkout}
              resetWorkout={resetWorkout}
              timerState={timerState}
              randomizeWorkout={randomizeWorkout}
            />
            <Timer
              stopTimer={stopTimer}
              startTimer={startTimer}
              currentTime={currentTime}
              timerState={timerState}
              ui={ui}
              workout={workout}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="instructions">
            Instructions: Just follow the timer! First exercise is the main
            exercise, meant to improve your total body strength and
            conditioning; you'll complete 5 sets of 1 minute. Second and third
            exercises are your lower and upper body assistance exercises, chosen
            to help you build muscle and promote a balance between opposing
            muscle groups. You will do 3 sets of 1 minute for each of these
            exercises, focusing on slow and controlled movements throughout the
            set. The last exercise is meant to help you burn off body fat and
            improve your cardiovascular health. 1 set of 5 minutes. As always,
            stay safe, have fun, and be sure to stretch afterwards.
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Workout;
