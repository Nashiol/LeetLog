import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DueToday } from "@/components/dashboard/DueToday";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Streak } from "@/components/dashboard/Streak";
import { MasteryProgress } from "@/components/dashboard/MasteryProgress";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...new Set(dates.map((d) => d.toDateString()))]
    .map((s) => new Date(s))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const expected = new Date(sorted[0]);
    expected.setDate(expected.getDate() - i);
    if (sorted[i].toDateString() === expected.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  const [dueResult, problemsResult, dsaResult, codingResult, interviewResult, sdResult] =
    await Promise.all([
      supabase
        .from("leetcode_problems")
        .select("*")
        .eq("user_id", user.id)
        .lte("next_review_date", today)
        .neq("status", "mastered"),
      supabase
        .from("leetcode_problems")
        .select("difficulty, status, date_solved, created_at, question, id, problem_number, programming_language")
        .eq("user_id", user.id),
      supabase
        .from("dsa_concepts")
        .select("topic, date_studied, created_at")
        .eq("user_id", user.id),
      supabase
        .from("coding_questions")
        .select("question, date_created, created_at")
        .eq("user_id", user.id),
      supabase
        .from("interview_questions")
        .select("question, created_at")
        .eq("user_id", user.id),
      supabase
        .from("system_design")
        .select("question, created_at")
        .eq("user_id", user.id),
    ]);

  const dueProblems = dueResult.data ?? [];
  const allProblems = problemsResult.data ?? [];

  const dueIds = dueProblems
    .filter((p) => p.status === "in_progress")
    .map((p) => p.id);

  if (dueIds.length > 0) {
    await supabase
      .from("leetcode_problems")
      .update({ status: "due_for_review" })
      .in("id", dueIds);
  }

  const updatedStatus = dueProblems.map((p) =>
    p.status === "in_progress" ? { ...p, status: "due_for_review" as const } : p
  );

  const difficultyCounts = {
    easy: allProblems.filter((p) => p.difficulty === "easy").length,
    medium: allProblems.filter((p) => p.difficulty === "medium").length,
    hard: allProblems.filter((p) => p.difficulty === "hard").length,
  };

  const mastered = allProblems.filter((p) => p.status === "mastered").length;
  const total = allProblems.length;

  const streakDates: Date[] = [];
  (problemsResult.data ?? []).forEach((p) => {
    if (p.date_solved) streakDates.push(new Date(p.date_solved));
    streakDates.push(new Date(p.created_at));
  });
  (dsaResult.data ?? []).forEach((d) => {
    if (d.date_studied) streakDates.push(new Date(d.date_studied));
    streakDates.push(new Date(d.created_at));
  });
  (codingResult.data ?? []).forEach((c) => {
    if (c.date_created) streakDates.push(new Date(c.date_created));
    streakDates.push(new Date(c.created_at));
  });
  (interviewResult.data ?? []).forEach((i) => streakDates.push(new Date(i.created_at)));
  (sdResult.data ?? []).forEach((s) => streakDates.push(new Date(s.created_at)));

  const streak = calculateStreak(streakDates);

  const recent: { id: string; type: string; label: string; title: string; date: string }[] = [];
  (problemsResult.data ?? []).forEach((p) =>
    recent.push({ id: p.id, type: "LeetCode", label: "LeetCode", title: `#${p.problem_number} ${p.question}`, date: p.created_at })
  );
  (dsaResult.data ?? []).forEach((d) =>
    recent.push({ id: d.topic, type: "DSA", label: "DSA", title: d.topic, date: d.created_at })
  );
  (codingResult.data ?? []).forEach((c) =>
    recent.push({ id: c.question, type: "Coding", label: "Coding", title: c.question, date: c.created_at })
  );
  (interviewResult.data ?? []).forEach((i) =>
    recent.push({ id: i.question, type: "Interview", label: "Interview", title: i.question, date: i.created_at })
  );
  (sdResult.data ?? []).forEach((s) =>
    recent.push({ id: s.question, type: "System Design", label: "System Design", title: s.question, date: s.created_at })
  );

  recent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentActivity = recent.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display font-bold tracking-tight text-on-surface">Dashboard</h1>
        <p className="mt-2 text-body-lg text-on-surface-variant">
          Welcome back. You have {updatedStatus.length} problem{updatedStatus.length === 1 ? "" : "s"} due for review today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-card-gap xl:grid-cols-4">
        <div className="xl:col-span-3">
          <StatsCards counts={difficultyCounts} />
        </div>
        <Streak count={streak} />
      </div>

      <MasteryProgress mastered={mastered} total={total} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between border-b border-outline-variant pb-3">
            <h2 className="flex items-center gap-2 text-headline-lg font-semibold text-on-surface">
              <span className="material-symbols-outlined text-primary">schedule</span>
              Due Today
            </h2>
          </div>
          <DueToday problems={updatedStatus} />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between border-b border-outline-variant pb-3">
            <h2 className="flex items-center gap-2 text-headline-lg font-semibold text-on-surface">
              <span className="material-symbols-outlined text-on-surface-variant">history</span>
              Recent Activity
            </h2>
          </div>
          <RecentActivity entries={recentActivity} />
        </section>
      </div>
    </div>
  );
}
