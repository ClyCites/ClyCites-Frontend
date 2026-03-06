import type { FieldDefinition } from "@/lib/store/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function renderExpertFieldControl(
  field: FieldDefinition,
  value: string | number | boolean,
  onChange: (next: string | number | boolean) => void
) {
  if (field.type === "textarea") {
    return (
      <Textarea
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === "select") {
    return (
      <Select
        value={String(value || field.options?.[0]?.value || "")}
        onValueChange={(nextValue) => onChange(nextValue)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select value" />
        </SelectTrigger>
        <SelectContent>
          {(field.options ?? []).map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (field.type === "switch") {
    return <Switch checked={Boolean(value)} onCheckedChange={(checked) => onChange(checked)} />;
  }

  const inputType = field.type === "number" ? "number" : field.type === "date" ? "date" : "text";

  return (
    <Input
      type={inputType}
      value={String(value)}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
    />
  );
}

