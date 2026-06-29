import { QuestionDetailsPage } from "@/components/questions/question-details-page";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function QuestionPage({ params }: Params) {
  const { id } = await params;
  return <QuestionDetailsPage questionId={id} />;
}
