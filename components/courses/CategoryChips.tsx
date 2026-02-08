import { cn } from "@/lib/utils";

type CategoryChipsProps = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

export function CategoryChips({ categories, selectedCategory, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold transition",
            selectedCategory === category
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
