export interface Question {
    question: string,
    options: [
        {
            description: string,
            isCorrect: boolean
        }
    ]
}