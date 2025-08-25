export const INSULIN_TYPES = [
  { label: "Lantus (insulin glargine)", value: "lantus" },
  { label: "Levemir (insulin detemir)", value: "levemir" },
  { label: "Tresiba (insulin degludec)", value: "tresiba" },
  { label: "NovoRapid (insulin aspart)", value: "novorapid" },
  { label: "Humalog (insulin lispro)", value: "humalog" },
  { label: "Apidra (insulin glulisine)", value: "apidra" },
  { label: "Fiasp (insulin aspart)", value: "fiasp" },
  { label: "Other", value: "other" },
];

export const MEDICAL_HELP = {
  basalInsulin:
    "Long-acting insulin that provides background glucose control throughout the day and night.",
  mealInsulin:
    "Rapid-acting insulin taken before meals to cover carbohydrates consumed.",
  correctionInsulin:
    "Rapid-acting insulin used to correct high blood glucose levels.",
  carbRatio: "The amount of insulin needed per 1 grams of carbohydrates.",
  correctionFactor:
    "How much 1 unit of insulin lowers blood glucose (in mmol/L).",
  targetRange:
    "The desired blood glucose range for optimal diabetes management.",
};
