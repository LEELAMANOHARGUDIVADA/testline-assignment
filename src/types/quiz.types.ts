export type Question = {
    id: string,
    description: string,
    options: [
        {
            description: string,
            is_correct: boolean
        }
    ]
}

export type AnsweredQuestion = {
    id: number;
    selectedAnswer: number | null;
    isCorrect: boolean;
  };