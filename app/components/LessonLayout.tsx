function LessonLayout({ lesson }: any) {
  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-xl p-8">
        <h2 className="text-2xl font-semibold mb-4">The Concept</h2>
        <p className="text-lg leading-relaxed italic">{lesson.content}</p>
      </div>

      <h3 className="text-2xl font-bold mt-8">Practice Examples</h3>
      <div className="grid gap-4">
        {lesson.examples.map((ex: any, i: number) => (
          <div
            key={i}
            className="collapse collapse-plus bg-base-100 border border-base-300"
          >
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-xl font-medium">
              {ex.question}
            </div>
            <div className="collapse-content">
              <p className="text-success font-bold text-lg">{ex.solution}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default LessonLayout;