import axios from "axios";
import { useEffect, useState } from "react";
import Timer from "./Timer";
import { AnsweredQuestion, Question } from "../types/quiz.types";

const Quiz = () => {
  const [quizStarted, setQuizStarted] = useState<Boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [optionSelected, setOptionSelected] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState<Boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [score, setScore] = useState<number>(0);

  const fetchData = async () => {
    const response = await axios.get("https://api.jsonserve.com/Uw5CrX");
    setQuestions(response.data.questions);
  };
  const handleNextQuestion = () => {
    if(optionSelected != null) {
        if (questions[currentQuestion].options[optionSelected]?.is_correct) {
            setScore((prevScore) => prevScore + 4);
          }
          if (currentQuestion + 1 < questions.length && optionSelected >= 0) {
            setAnsweredQuestions((prev) => [
              ...prev,
              {
                id: currentQuestion,
                selectedAnswer: optionSelected,
                isCorrect:
                  questions[currentQuestion].options[optionSelected].is_correct,
              },
            ]);
            setCurrentQuestion(currentQuestion + 1);
            setOptionSelected(null);
          }
    }
  };

  const handleSubmitQuiz = () => {
    if (optionSelected !== null) { 
      setAnsweredQuestions((prev) => [
        ...prev,
        {
          id: currentQuestion,
          selectedAnswer: optionSelected,
          isCorrect:
            questions[currentQuestion].options[optionSelected].is_correct,
        },
      ]);
  
      if (questions[currentQuestion].options[optionSelected].is_correct) {
        setScore((prevScore) => prevScore + 4);
      }
    }
    setQuizSubmitted(true);
  };
  

  const handleRestartQuiz = () => {
    setAnsweredQuestions([]);
    setOptionSelected(null);
    setQuizStarted(false);
    setQuizSubmitted(false);
    setScore(0);
  }
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (timeLeft == 0 && currentQuestion < questions.length -1) setCurrentQuestion((prev) => prev + 1);
  }, [timeLeft,currentQuestion]);
  return (
    <div>
      {quizStarted && questions.length > 0 ? (
        <div
          className={` w-full ${
            !quizSubmitted && "h-screen"
          } bg-neutral-100 flex items-center justify-center`}
        >
          {!quizSubmitted ? (
            <div className="w-[80%] lg:w-[50%] bg-white p-8 rounded-2xl border border-neutral-200 shadow">
              <div className="w-full flex items-center justify-between gap-5">
                <h3 className="text-md lg:text-lg font-semibold">
                  {currentQuestion + 1}.{" "}
                  {questions[currentQuestion]?.description}
                </h3>
                <Timer
                  currentQuestion={currentQuestion}
                  duration={15}
                  timeLeft={timeLeft}
                  setTimeLeft={setTimeLeft}
                />
              </div>
              <ul className="mt-5 flex flex-col items-start justify-center gap-5">
                {questions[currentQuestion]?.options?.map((option, index) => (
                  <li
                    key={index}
                    className={`font-medium w-full bg-slate-50 rounded-lg px-5 py-2 border ${
                      optionSelected == index
                        ? "border-black border-2"
                        : "border-neutral-200"
                    } drop-shadow-xs cursor-pointer`}
                    onClick={() => setOptionSelected(index)}
                  >
                    {String.fromCharCode(65 + index)}. {option?.description}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-center mt-5">
                {currentQuestion == questions.length - 1 ? (
                  <button
                    className="text-white bg-slate-900 px-8 py-2 rounded-lg text-xs cursor-pointer"
                    onClick={handleSubmitQuiz}
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    className="text-white bg-slate-900 px-8 py-2 rounded-lg text-xs cursor-pointer"
                    onClick={handleNextQuestion}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="w-[90%] lg:w-[50%] bg-white p-8 rounded-2xl border border-neutral-200 shadow flex flex-col items-start justify-start my-20">
              <h3 className="text-xl font-semibold text-center">
                You have Scored {score} points
              </h3>
              <div className="w-full flex flex-col items-start justify-center gap-5 mt-5">
                {questions.map((question, index) => {
                  const questionNumber = index;
                  return (
                    <div key={index}>
                      <h3 className=" text-sm md:text-lg font-semibold">
                        {index + 1}. {question?.description}
                      </h3>
                      <ul className="mt-5 w-full flex flex-col items-start justify-center gap-5">
                        {question.options?.map((option, index) => (
                          <li
                            key={index}
                            className={`font-medium w-full bg-neutral-50 rounded-lg px-5 py-2 border text-sm md:text-lg 
                                  ${
                                    option.is_correct &&
                                    "border-green-500 bg-green-100"
                                  }  ${
                              answeredQuestions[questionNumber]
                                ?.selectedAnswer == index &&
                              !option.is_correct &&
                              "bg-red-200 border-red-500"
                            } drop-shadow-xs cursor-pointer`}
                            onClick={() => setOptionSelected(index)}
                          >
                            {String.fromCharCode(65 + index)}.{" "}
                            {option?.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex items-center justify-center">
                <button
                  className="bg-slate-900 px-5 py-2 rounded-lg text-white shadow text-sm cursor-pointer mt-5"
                  onClick={handleRestartQuiz}
                >
                  Restart Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center bg-neutral-50">
          <div className=" w-[90%] lg:w-[40%] bg-white p-8 rounded-2xl border border-neutral-200">
            <h2 className="text-xl font-semibold">Instructions</h2>
            <div className="mt-5 flex flex-col items-start justify-center gap-3">
              <h3 className="text-xs font-medium">Answer all questions</h3>
              <h3 className="text-xs font-medium">
                Each correct answer scores 4 points
              </h3>
              <h3 className="text-xs font-medium">
                Each question has a duration of 15 secs
              </h3>
            </div>
            <div className="w-full flex items-center justify-center">
              <button
                className="bg-slate-900 px-5 py-2 rounded-lg text-white shadow text-sm cursor-pointer mt-5"
                onClick={() => setQuizStarted(true)}
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
