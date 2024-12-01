import WritingForm from "@/components/ui/form/WritingForm";

export default function CreateWritingPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Create New Writing</h1>
        <WritingForm />
      </div>
    </div>
  );
}