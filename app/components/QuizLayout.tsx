function QuizLayout({ quiz }: any) {
  return (
    <div className="space-y-10">
      {quiz.questions.map((q: any, i: number) => (
        <div
          key={i}
          className="card bg-base-100 border border-base-300 shadow-sm p-6"
        >
          <h3 className="text-xl font-medium mb-6">
            <span className="badge badge-secondary mr-2">{i + 1}</span>
            {q.question}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((option: string) => (
              <button
                key={option}
                className="btn btn-outline btn-primary no-animation lowercase"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="btn btn-block btn-success">Check Answers</button>
    </div>
  );
}
export default  QuizLayout;