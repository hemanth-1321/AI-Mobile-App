import { Appbar } from "@/components/Appbar";
import { TemplateButtons } from "@/components/TemplateButtons";
import { Prompt } from "@/components/Prompt";

export default function Home() {
  return (
    <div className="p-4">
      <Appbar />
      <div className="max-w-2xl mx-auto pt-32">
        <div className="text-2xl font-bold text-center">
          What do u want to build
        </div>
      </div>
      <div className="text-sm text-muted-foreground text-center">
        Prompt, Click generate and watch your app come to life
      </div>

      <div className="pt-4">
        <Prompt />
      </div>

      <div className="max-w-2xl mx-auto pt-">
        <TemplateButtons />
      </div>
    </div>
  );
}
