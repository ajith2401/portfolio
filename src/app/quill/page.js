import WritingForm from "@/components/ui/form/WritingForm";

export default function QuillPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Create New Writing</h1>
        <WritingForm />
      </div>
    </div>
  );
}