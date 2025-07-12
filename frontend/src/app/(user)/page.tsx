

import QuestionsList from "@/components/questions-list";
import SearchFilter from "@/components/search-filter";

export default function Home() {
 
  return (
    <div className="space-y-4 h-full container mx-auto">
      <SearchFilter />
      <QuestionsList/>
    </div>
  );
}
