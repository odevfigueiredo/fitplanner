"use client";

import { workoutTypes } from "@fitplanner/shared";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ExerciseBadge } from "@/components/exercise-badge";
import { PageHeader } from "@/components/page-header";
import { apiFetch, getStoredToken } from "@/lib/api";
import { getTrainingTypeImage } from "@/lib/assets";
import { fallbackExercises, fallbackWorkouts } from "@/lib/mock";
import { useResource } from "@/lib/use-resource";

type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment?: string | null;
  instructions?: string | null;
  userId?: string | null;
};

type WorkoutExercise = {
  id: string;
  sets: number;
  reps: number;
  restSeconds: number;
  targetWeight: number | null;
  order: number;
  exercise: Exercise;
};

type Workout = {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  dayOfWeek?: number | null;
  exercises: WorkoutExercise[];
  isLocal?: boolean;
};

type ExerciseConfig = {
  sets: number;
  reps: number;
  restSeconds: number;
  targetWeight: string;
};

type ExerciseConfigField = keyof ExerciseConfig;

const CUSTOM_WORKOUTS_KEY = "fitplanner.custom-workouts";
const CUSTOM_CATEGORIES_KEY = "fitplanner.custom-workout-categories";
const defaultWorkoutTypes = new Set<string>(workoutTypes);
const defaultExerciseConfig: ExerciseConfig = { sets: 3, reps: 10, restSeconds: 90, targetWeight: "" };
const dayOptions = [
  { value: "", label: "Sem dia fixo" },
  { value: "1", label: "Segunda" },
  { value: "2", label: "Terça" },
  { value: "3", label: "Quarta" },
  { value: "4", label: "Quinta" },
  { value: "5", label: "Sexta" },
  { value: "6", label: "Sábado" },
  { value: "0", label: "Domingo" },
];
const dayLabels = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function readStoredList<T>(key: string) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T[]) : [];
  } catch {
    return [];
  }
}

function writeStoredList<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uniqueList(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function clampNumber(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(Math.max(Math.round(value), min), max);
}

function normalizeConfig(config: ExerciseConfig) {
  const parsedWeight = config.targetWeight.trim() ? Number(config.targetWeight.replace(",", ".")) : null;

  return {
    sets: clampNumber(config.sets, 1, 20, defaultExerciseConfig.sets),
    reps: clampNumber(config.reps, 1, 200, defaultExerciseConfig.reps),
    restSeconds: clampNumber(config.restSeconds, 0, 1800, defaultExerciseConfig.restSeconds),
    targetWeight: parsedWeight !== null && Number.isFinite(parsedWeight) ? Math.min(Math.max(parsedWeight, 0), 1000) : null,
  };
}

export default function WorkoutsPage() {
  const { data, isLoading, error, reload } = useResource<Workout[]>("/workouts", fallbackWorkouts as Workout[]);
  const { data: exercises } = useResource<Exercise[]>("/exercises", fallbackExercises as Exercise[]);
  const [localWorkouts, setLocalWorkouts] = useState<Workout[]>([]);
  const [localCategories, setLocalCategories] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Strength");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>(["global-bench-press", "global-overhead-press"]);
  const [exerciseConfigById, setExerciseConfigById] = useState<Record<string, ExerciseConfig>>({});
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalWorkouts(readStoredList<Workout>(CUSTOM_WORKOUTS_KEY));
    setLocalCategories(readStoredList<string>(CUSTOM_CATEGORIES_KEY));
  }, []);

  const workouts = useMemo(() => [...localWorkouts, ...data], [data, localWorkouts]);

  const categories = useMemo(
    () => uniqueList([...workoutTypes, ...localCategories, ...workouts.map((workout) => workout.type), category]),
    [category, localCategories, workouts],
  );

  const selectedExercises = useMemo(
    () => exercises.filter((exercise) => selectedExerciseIds.includes(exercise.id)),
    [exercises, selectedExerciseIds],
  );

  const configuredExercises = useMemo(
    () =>
      selectedExercises.map((exercise, order) => ({
        exercise,
        order,
        config: normalizeConfig(exerciseConfigById[exercise.id] ?? defaultExerciseConfig),
      })),
    [exerciseConfigById, selectedExercises],
  );

  const previewDescription = description.trim() || "Defina categoria, dia e os detalhes de cada exercício antes de salvar.";
  const selectedDayLabel = dayOfWeek === "" ? "Sem dia fixo" : dayLabels[Number(dayOfWeek)];

  function getExerciseConfig(exerciseId: string) {
    return exerciseConfigById[exerciseId] ?? defaultExerciseConfig;
  }

  function persistCategories(nextCategories: string[]) {
    const uniqueCategories = uniqueList(nextCategories);
    setLocalCategories(uniqueCategories);
    writeStoredList(CUSTOM_CATEGORIES_KEY, uniqueCategories);
  }

  function persistWorkouts(nextWorkouts: Workout[]) {
    setLocalWorkouts(nextWorkouts);
    writeStoredList(CUSTOM_WORKOUTS_KEY, nextWorkouts);
  }

  function addCategory() {
    const value = newCategory.trim();
    if (!value) {
      return;
    }

    setCategory(value);
    persistCategories([value, ...localCategories]);
    setNewCategory("");
    setStatus({ tone: "success", message: `Categoria "${value}" pronta para usar.` });
  }

  function toggleExercise(id: string) {
    setSelectedExerciseIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setExerciseConfigById((current) => (current[id] ? current : { ...current, [id]: defaultExerciseConfig }));
  }

  function updateExerciseConfig(exerciseId: string, field: ExerciseConfigField, value: string | number) {
    setExerciseConfigById((current) => ({
      ...current,
      [exerciseId]: {
        ...(current[exerciseId] ?? defaultExerciseConfig),
        [field]: value,
      },
    }));
  }

  function resetForm() {
    setName("");
    setDescription("");
    setDayOfWeek("");
    setSelectedExerciseIds([]);
    setExerciseConfigById({});
    setStatus(null);
  }

  async function createWorkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const workoutDay = dayOfWeek === "" ? null : Number(dayOfWeek);

    if (!trimmedName) {
      setStatus({ tone: "error", message: "Dê um nome para o treino antes de salvar." });
      return;
    }

    if (!trimmedCategory) {
      setStatus({ tone: "error", message: "Escolha ou crie uma categoria para o treino." });
      return;
    }

    if (configuredExercises.length === 0) {
      setStatus({ tone: "error", message: "Selecione pelo menos um exercício." });
      return;
    }

    const localId = `local-workout-${Date.now()}`;
    const workoutExercises = configuredExercises.map(({ exercise, order, config }) => ({
      id: `${localId}-exercise-${exercise.id}`,
      sets: config.sets,
      reps: config.reps,
      restSeconds: config.restSeconds,
      targetWeight: config.targetWeight,
      order,
      exercise,
    }));
    const workout: Workout = {
      id: localId,
      name: trimmedName,
      type: trimmedCategory,
      description: description.trim() || "Treino personalizado criado no FitPlanner.",
      dayOfWeek: workoutDay,
      isLocal: true,
      exercises: workoutExercises,
    };

    setIsSaving(true);

    try {
      const token = getStoredToken();
      if (token) {
        await apiFetch("/workouts", {
          token,
          method: "POST",
          body: {
            name: workout.name,
            type: workout.type,
            description: workout.description,
            dayOfWeek: workoutDay,
            exercises: configuredExercises.map(({ exercise, order, config }) => ({
              exerciseId: exercise.id,
              sets: config.sets,
              reps: config.reps,
              restSeconds: config.restSeconds,
              targetWeight: config.targetWeight,
              order,
            })),
          },
        });
        await reload();
        setStatus({ tone: "success", message: "Treino salvo e sincronizado com a API." });
      } else {
        persistWorkouts([workout, ...localWorkouts]);
        setStatus({ tone: "success", message: "Treino salvo localmente neste navegador." });
      }

      if (!defaultWorkoutTypes.has(trimmedCategory)) {
        persistCategories([trimmedCategory, ...localCategories]);
      }

      setName("");
      setDescription("");
    } catch (requestError) {
      persistWorkouts([workout, ...localWorkouts]);
      if (!defaultWorkoutTypes.has(trimmedCategory)) {
        persistCategories([trimmedCategory, ...localCategories]);
      }
      setStatus({
        tone: "success",
        message: requestError instanceof Error
          ? `API indisponível agora. O treino ficou salvo localmente. (${requestError.message})`
          : "API indisponível agora. O treino ficou salvo localmente.",
      });
      setName("");
      setDescription("");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-5 md:gap-6">
      <PageHeader title="Treinos" subtitle="Crie divisões, categorias, dias e metas próprias para planejar a semana com clareza." />

      <section className="no-scrollbar flex gap-2 overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--panel)] p-3">
        {categories.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setCategory(type)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-black transition ${
              category === type ? "bg-[var(--neon)] text-black" : "bg-[var(--panel-2)] text-[var(--muted)] hover:text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current opacity-80" />
            {type}
            {!defaultWorkoutTypes.has(type) ? <span className="opacity-70">Custom</span> : null}
          </button>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <form onSubmit={createWorkout} className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--neon)]">Personalizar</p>
              <h2 className="mt-2 text-2xl font-black text-white">Novo treino</h2>
            </div>
            <span className="rounded-full bg-[var(--panel-2)] px-3 py-1 text-xs font-black text-white">{selectedExercises.length} exercícios</span>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_180px]">
            <label className="grid gap-2 text-sm font-bold text-white">
              Nome
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Push pesado"
                className="rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-3 py-3 text-white outline-none transition focus:border-[var(--neon)]"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-white">
              Categoria
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Push, Upper, Cardio..."
                className="rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-3 py-3 text-white outline-none transition focus:border-[var(--neon)]"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-white">
              Dia
              <select
                value={dayOfWeek}
                onChange={(event) => setDayOfWeek(event.target.value)}
                className="rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-3 py-3 text-white outline-none transition focus:border-[var(--neon)]"
              >
                {dayOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-3 grid gap-2 text-sm font-bold text-white">
            Descrição
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Peito, ombros e tríceps com foco em progressão de carga."
              rows={3}
              className="resize-none rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-3 py-3 text-white outline-none transition focus:border-[var(--neon)]"
            />
          </label>

          <div className="mt-4 grid gap-3 rounded-lg border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCategory(type)}
                  className={`rounded-full px-3 py-2 text-xs font-black transition ${
                    category === type ? "bg-[var(--neon)] text-black" : "bg-[var(--panel-2)] text-white hover:text-[var(--neon)]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="Nova categoria"
                className="rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-3 py-3 text-sm text-white outline-none transition focus:border-[var(--neon)]"
              />
              <button type="button" onClick={addCategory} className="rounded-lg bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-[var(--neon)]">
                Adicionar categoria
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--muted)]">Exercícios</h3>
              <span className="text-xs font-bold text-[var(--muted)]">{configuredExercises.length} na sequência</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {exercises.map((exercise) => {
                const selected = selectedExerciseIds.includes(exercise.id);
                return (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => toggleExercise(exercise.id)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                      selected ? "border-[var(--neon)] bg-[rgba(34,197,94,0.1)]" : "border-[var(--line)] bg-[var(--panel-2)] hover:border-[rgba(255,255,255,0.22)]"
                    }`}
                  >
                    <ExerciseBadge label={exercise.name} detail={exercise.muscleGroup} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black text-white">{exercise.name}</span>
                      <span className="block truncate text-xs text-[var(--muted)]">{exercise.muscleGroup} · {exercise.equipment ?? "Sem equipamento"}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedExercises.length > 0 ? (
            <div className="mt-5 grid gap-2">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--muted)]">Metas por exercício</h3>
              {selectedExercises.map((exercise, index) => {
                const config = getExerciseConfig(exercise.id);
                return (
                  <div key={exercise.id} className="grid gap-3 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] p-3 md:grid-cols-[1fr_repeat(4,82px)] md:items-end">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--neon)] text-xs font-black text-black">{index + 1}</span>
                      <ExerciseBadge label={exercise.name} detail={exercise.muscleGroup} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-white">{exercise.name}</p>
                        <p className="text-xs text-[var(--muted)]">{exercise.muscleGroup}</p>
                      </div>
                    </div>
                    <label className="grid gap-1 text-[11px] font-black uppercase text-[var(--muted)]">
                      Séries
                      <input
                        inputMode="numeric"
                        min={1}
                        max={20}
                        value={config.sets}
                        onChange={(event) => updateExerciseConfig(exercise.id, "sets", Number(event.target.value))}
                        className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-2 py-2 text-sm text-white outline-none focus:border-[var(--neon)]"
                      />
                    </label>
                    <label className="grid gap-1 text-[11px] font-black uppercase text-[var(--muted)]">
                      Reps
                      <input
                        inputMode="numeric"
                        min={1}
                        max={200}
                        value={config.reps}
                        onChange={(event) => updateExerciseConfig(exercise.id, "reps", Number(event.target.value))}
                        className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-2 py-2 text-sm text-white outline-none focus:border-[var(--neon)]"
                      />
                    </label>
                    <label className="grid gap-1 text-[11px] font-black uppercase text-[var(--muted)]">
                      Desc.
                      <input
                        inputMode="numeric"
                        min={0}
                        max={1800}
                        value={config.restSeconds}
                        onChange={(event) => updateExerciseConfig(exercise.id, "restSeconds", Number(event.target.value))}
                        className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-2 py-2 text-sm text-white outline-none focus:border-[var(--neon)]"
                      />
                    </label>
                    <label className="grid gap-1 text-[11px] font-black uppercase text-[var(--muted)]">
                      Kg
                      <input
                        inputMode="decimal"
                        value={config.targetWeight}
                        onChange={(event) => updateExerciseConfig(exercise.id, "targetWeight", event.target.value)}
                        placeholder="-"
                        className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-2 py-2 text-sm text-white outline-none focus:border-[var(--neon)]"
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          ) : null}

          {status ? (
            <p className={`mt-4 rounded-lg border px-3 py-2 text-sm font-bold ${
              status.tone === "success"
                ? "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.1)] text-[var(--neon)]"
                : "border-red-500/35 bg-red-500/10 text-red-200"
            }`}>
              {status.message}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <button disabled={isSaving} className="rounded-lg bg-[var(--neon)] px-5 py-3 text-sm font-black text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
              {isSaving ? "Salvando..." : "Salvar treino"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-[var(--line)] px-5 py-3 text-sm font-black text-white transition hover:border-white">
              Limpar
            </button>
          </div>
        </form>

        <aside className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)]">
          <img src={getTrainingTypeImage(category)} alt="" className="aspect-video w-full object-cover" />
          <div className="p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--neon)] px-3 py-1 text-xs font-black text-black">{category || "Categoria"}</span>
              <span className="rounded-full bg-[var(--panel-2)] px-3 py-1 text-xs font-black text-white">{selectedDayLabel}</span>
              <span className="rounded-full bg-[var(--panel-2)] px-3 py-1 text-xs font-black text-white">{selectedExercises.length} exercícios</span>
            </div>
            <h2 className="mt-4 text-2xl font-black text-white">{name.trim() || "Prévia do treino"}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{previewDescription}</p>
            <div className="mt-5 grid gap-2">
              {configuredExercises.length > 0 ? configuredExercises.map(({ exercise, config }, index) => (
                <div key={exercise.id} className="flex items-center gap-3 rounded-lg bg-[var(--panel-2)] p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--neon)] text-xs font-black text-black">{index + 1}</span>
                  <ExerciseBadge label={exercise.name} detail={exercise.muscleGroup} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-white">{exercise.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {config.sets} séries · {config.reps} reps · {config.restSeconds}s{config.targetWeight === null ? "" : ` · ${config.targetWeight}kg`}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="rounded-lg border border-dashed border-[var(--line)] p-4 text-sm font-bold text-[var(--muted)]">
                  Selecione exercícios para montar a sequência.
                </div>
              )}
            </div>
          </div>
        </aside>
      </section>

      {isLoading ? <p className="text-sm font-bold text-[var(--muted)]">Carregando treinos...</p> : null}
      {error ? <p className="text-sm font-bold text-amber-200">Usando dados locais: {error}</p> : null}

      <section className="grid gap-4">
        {workouts.map((workout) => (
          <article key={workout.id} className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)]">
            <div className="grid gap-4 p-4 md:grid-cols-[184px_1fr_auto] md:items-start md:p-5">
              <img src={getTrainingTypeImage(workout.type)} alt="" className="aspect-video w-full rounded-lg object-cover md:w-44" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--neon)]">{workout.type}</p>
                  {typeof workout.dayOfWeek === "number" ? <span className="rounded-full bg-[var(--panel-2)] px-2 py-1 text-[10px] font-black uppercase text-white">{dayLabels[workout.dayOfWeek]}</span> : null}
                  {workout.isLocal ? <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black uppercase text-black">Personalizado</span> : null}
                </div>
                <h2 className="mt-2 text-xl font-black text-white">{workout.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{workout.description}</p>
              </div>
              <span className="w-fit rounded-full bg-[var(--neon)] px-3 py-1 text-xs font-black text-black">{workout.exercises.length} exercícios</span>
            </div>
            <div className="grid gap-2 border-t border-[var(--line)] p-4 md:hidden">
              {workout.exercises.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg bg-[var(--panel-2)] p-3">
                  <ExerciseBadge label={item.exercise.name} detail={item.exercise.muscleGroup} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-white">{item.exercise.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {item.sets}x{item.reps} | {item.restSeconds}s | {item.targetWeight ?? "--"}kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto border-t border-[var(--line)] md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-[var(--muted)]">
                  <tr>
                    <th className="px-5 py-3">Exercício</th>
                    <th>Grupo</th>
                    <th>Séries</th>
                    <th>Repetições</th>
                    <th>Descanso</th>
                    <th>Meta</th>
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises.map((item) => (
                    <tr key={item.id} className="border-t border-[var(--line)]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <ExerciseBadge label={item.exercise.name} detail={item.exercise.muscleGroup} />
                          <span className="font-bold text-white">{item.exercise.name}</span>
                        </div>
                      </td>
                      <td>{item.exercise.muscleGroup}</td>
                      <td>{item.sets}</td>
                      <td>{item.reps}</td>
                      <td>{item.restSeconds}s</td>
                      <td>{item.targetWeight ?? "--"}kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
