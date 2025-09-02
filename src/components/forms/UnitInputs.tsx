"use client";
import { useEffect, useMemo, useState } from "react";

type CommonProps = {
  value: any;
  onChange: (v: any) => void;
  labelClass: string;
  inputClass: string;
  choiceBase: string;
  choiceActive: string;
  className?: string;
  label?: string;
  placeholder?: string;
};

function Toggle({
  options,
  value,
  onChange,
  base,
  active,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  base: string;
  active: string;
}) {
  return (
    <div className="flex gap-2">
      {options.map((o) => {
        const is = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            className={`${base} ${is ? active : ""}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function WeightInput(props: CommonProps) {
  const {
    value,
    onChange,
    labelClass,
    inputClass,
    choiceBase,
    choiceActive,
    className,
    label = "Weight",
    placeholder = "Enter weight",
  } = props;

  const initialUnit = (value && value.unit) || "kg";
  const initialVal =
    typeof value === "number"
      ? value
      : typeof value?.value === "number"
      ? value.value
      : "";

  const [unit, setUnit] = useState<"kg" | "lb">(initialUnit);
  const [num, setNum] = useState<string>(initialVal === "" ? "" : String(initialVal));

  useEffect(() => {
    if (value && value.unit && value.unit !== unit) {
      setUnit(value.unit);
      setNum(value.value === undefined ? "" : String(value.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  function commit(nextUnit = unit, raw = num) {
    const v = raw === "" ? null : Number(raw);
    onChange(v === null ? null : { unit: nextUnit, value: v });
  }

  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="number"
          inputMode="decimal"
          placeholder={placeholder}
          className={inputClass}
          value={num}
          onChange={(e) => setNum(e.target.value)}
          onBlur={() => commit()}
        />
        <Toggle
          options={[
            { value: "kg", label: "kg" },
            { value: "lb", label: "lb" },
          ]}
          value={unit}
          onChange={(u) => {
            if (num === "") {
              setUnit(u as any);
              commit(u as any, "");
              return;
            }
            const n = Number(num);
            const converted =
              u === "kg" ? (unit === "kg" ? n : +(n / 2.2046226218).toFixed(1)) : unit === "lb" ? n : +(n * 2.2046226218).toFixed(1);
            setUnit(u as any);
            setNum(String(converted));
            commit(u as any, String(converted));
          }}
          base={choiceBase}
          active={choiceActive}
        />
      </div>
    </div>
  );
}

export function HeightInput(props: CommonProps) {
  const {
    value,
    onChange,
    labelClass,
    inputClass,
    choiceBase,
    choiceActive,
    className,
    label = "Height",
    placeholder = "Enter height",
  } = props;

  const initialUnit = (value && value.unit) || "cm";
  const initialVal =
    typeof value === "number"
      ? value
      : typeof value?.value === "number"
      ? value.value
      : "";

  const [unit, setUnit] = useState<"cm" | "in">(initialUnit);
  const [num, setNum] = useState<string>(initialVal === "" ? "" : String(initialVal));

  useEffect(() => {
    if (value && value.unit && value.unit !== unit) {
      setUnit(value.unit);
      setNum(value.value === undefined ? "" : String(value.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  function commit(nextUnit = unit, raw = num) {
    const v = raw === "" ? null : Number(raw);
    onChange(v === null ? null : { unit: nextUnit, value: v });
  }

  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="number"
          inputMode="decimal"
          placeholder={placeholder}
          className={inputClass}
          value={num}
          onChange={(e) => setNum(e.target.value)}
          onBlur={() => commit()}
        />
        <Toggle
          options={[
            { value: "cm", label: "cm" },
            { value: "in", label: "in" },
          ]}
          value={unit}
          onChange={(u) => {
            if (num === "") {
              setUnit(u as any);
              commit(u as any, "");
              return;
            }
            const n = Number(num);
            const converted =
              u === "cm" ? (unit === "cm" ? n : +(n * 2.54).toFixed(1)) : unit === "in" ? n : +(n / 2.54).toFixed(1);
            setUnit(u as any);
            setNum(String(converted));
            commit(u as any, String(converted));
          }}
          base={choiceBase}
          active={choiceActive}
        />
      </div>
    </div>
  );
}

export function CircumferenceInput(props: CommonProps) {
  const {
    value,
    onChange,
    labelClass,
    inputClass,
    choiceBase,
    choiceActive,
    className,
    label = "Circumference",
    placeholder = "Enter value",
  } = props;

  const initialUnit = (value && value.unit) || "cm";
  const initialVal =
    typeof value === "number"
      ? value
      : typeof value?.value === "number"
      ? value.value
      : "";

  const [unit, setUnit] = useState<"cm" | "in">(initialUnit);
  const [num, setNum] = useState<string>(initialVal === "" ? "" : String(initialVal));

  useEffect(() => {
    if (value && value.unit && value.unit !== unit) {
      setUnit(value.unit);
      setNum(value.value === undefined ? "" : String(value.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  function commit(nextUnit = unit, raw = num) {
    const v = raw === "" ? null : Number(raw);
    onChange(v === null ? null : { unit: nextUnit, value: v });
  }

  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="number"
          inputMode="decimal"
          placeholder={placeholder}
          className={inputClass}
          value={num}
          onChange={(e) => setNum(e.target.value)}
          onBlur={() => commit()}
        />
        <Toggle
          options={[
            { value: "cm", label: "cm" },
            { value: "in", label: "in" },
          ]}
          value={unit}
          onChange={(u) => {
            if (num === "") {
              setUnit(u as any);
              commit(u as any, "");
              return;
            }
            const n = Number(num);
            const converted =
              u === "cm" ? (unit === "cm" ? n : +(n * 2.54).toFixed(1)) : unit === "in" ? n : +(n / 2.54).toFixed(1);
            setUnit(u as any);
            setNum(String(converted));
            commit(u as any, String(converted));
          }}
          base={choiceBase}
          active={choiceActive}
        />
      </div>
    </div>
  );
}
